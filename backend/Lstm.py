from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
from supabase import create_client

# Supabase 설정
SUPABASE_URL = "https://vsmbidgenzscyzgxgede.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbWJpZGdlbnpzY3l6Z3hnZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDY3OTAsImV4cCI6MjA1MTM4Mjc5MH0.mJqtmjFDArnBy3dUFDS2hjyt8aXEf2WAMjOBbmVVAAo"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 데이터 로드
response = supabase.table("expense").select("*").execute()
expense_data = pd.DataFrame(response.data)

# 데이터 전처리
expense_data['expense_date'] = pd.to_datetime(expense_data['expense_date'])
expense_data = expense_data.groupby('expense_date')['amount'].sum().reset_index()
expense_data = expense_data.sort_values(by='expense_date')

# 데이터 정규화
scaler = MinMaxScaler()
expense_data['amount_scaled'] = scaler.fit_transform(expense_data[['amount']])

# 시퀀스 데이터 생성
def create_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i:i + sequence_length])
        y.append(data[i + sequence_length])
    return np.array(X), np.array(y)

sequence_length = 10
X, y = create_sequences(expense_data['amount_scaled'].values, sequence_length)

X = X.reshape((X.shape[0], X.shape[1], 1))

# 모델 훈련
def train_model():
    model = Sequential([
        LSTM(50, activation='relu', return_sequences=True, input_shape=(X.shape[1], 1)),
        Dropout(0.2),
        LSTM(50, activation='relu'),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')

    early_stopping = EarlyStopping(monitor='loss', patience=5, restore_best_weights=True)
    model.fit(X, y, epochs=50, batch_size=32, callbacks=[early_stopping])

    model.save("lstm_model.keras")
    return model

# 모델 훈련
train_model()

# 모델 로드
model = load_model("lstm_model.keras")

# 예측 함수
def adjust_sequence_length(input_sequence, sequence_length):
    input_sequence = np.array(input_sequence)
    if len(input_sequence.shape) == 1:
        input_sequence = input_sequence.reshape(-1, 1)

    if len(input_sequence) < sequence_length:
        padding = np.zeros((sequence_length - len(input_sequence), input_sequence.shape[1]))
        input_sequence = np.concatenate([padding, input_sequence], axis=0)
    elif len(input_sequence) > sequence_length:
        input_sequence = input_sequence[-sequence_length:]
    return input_sequence

def predict_monthly_values(data, model, sequence_length, months_to_predict=3):
    data = np.array(data)
    if len(data.shape) == 1:
        data = data.reshape(-1, 1)

    input_sequence = data[-sequence_length:] if len(data) >= sequence_length else adjust_sequence_length(data, sequence_length)
    monthly_predictions = []

    for month in range(1, months_to_predict + 1):
        monthly_sum = 0
        for day in range(30):
            input_data = np.array(input_sequence).reshape((1, sequence_length, 1))
            predicted_value = model.predict(input_data, verbose=0)[0, 0]
            predicted_rescaled = scaler.inverse_transform(
                np.array([predicted_value]).reshape(-1, 1)
            ).flatten()[0]

            # Convert to standard float for JSON serialization
            monthly_sum += float(predicted_rescaled)
            input_sequence = np.concatenate([input_sequence[1:], [[predicted_value]]], axis=0)

        monthly_predictions.append(monthly_sum)

    return monthly_predictions

# Flask 서버 설정
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/predict', methods=['GET'])
def predict():
    predictions = predict_monthly_values(expense_data['amount_scaled'].values, model, sequence_length)
    return jsonify({
        "1_month": predictions[0],
        "2_months": predictions[1],
        "3_months": predictions[2]
    })

if __name__ == '__main__':
    app.run(debug=True)
