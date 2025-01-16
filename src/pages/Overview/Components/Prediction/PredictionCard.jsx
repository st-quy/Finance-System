import * as React from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

const styles = {
  card: "bg-white rounded-lg p-6",
  header: "flex gap-3 items-start w-full",
  title: "text-xl font-semibold text-neutral-950",
  subtitle: "text-sm font-medium text-slate-500",
  content: "flex flex-col items-center mt-6 w-full",
  tooltip: "flex z-10 flex-col self-center px-2.5 py-3.5 bg-white rounded-lg w-[173px]",
  date: "text-sm text-zinc-500",
  profitBox: "flex flex-col justify-center items-start px-2 py-2.5 mt-4 bg-gray-100 rounded-lg",
  profitLabel: "text-sm text-zinc-500",
  profitValue: "text-base tracking-tight text-slate-900",
  chart: "flex relative flex-col pb-20 w-full min-h-[163px]"
};

export function PredictionCard() {
  const [predictions, setPredictions] = React.useState(null);

  // React의 useEffect 훅을 사용하여 Flask API에서 데이터를 가져옵니다.
  React.useEffect(() => {
    fetch("http://127.0.0.1:5000/api/predict")
      .then((response) => response.json())
      .then((data) => setPredictions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log(predictions);

  if (!predictions) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Prediction</h2>
          <p className={styles.subtitle}>Profit growth prediction</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.tooltip}>
          <span className={styles.date}>February 2023</span>
          <div className={styles.profitBox}>
            <div className="flex gap-2 items-center">
              <ArrowUpOutlined className="text-2xl" />
              <div>
                <span className={styles.profitLabel}>Profit</span>
                <span className={styles.profitValue}>$4,251</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chart}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/264beb8974e205c37b1d1685918e45d339e250fa1edfa4ca1c54a9b9950f5e91?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
            alt="Chart background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4191d56c6167187c6d347db0286c5c12300fe0fc7fc4845c7a1fa90bb72a2bc1?placeholderIfAbsent=true&apiKey=1c5e4b15884e46cbb4105350fa4c2d13"
            alt="Chart line"
            className="relative z-10 w-full stroke-[3px] stroke-emerald-600"
          />
        </div>
      </div>
    </div>
  );
}