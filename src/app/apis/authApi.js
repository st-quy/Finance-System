import axiosInstance from "@app/configs/axios";

export const AuthApi = {
  registerUser: (userData) => {
    return axiosInstance.post("/user/register", userData);
  },
  verifyEmail: (token) => {
    return axiosInstance.post("/user/verify-email", { token });
  },
  
  loginUser: (credentials) => {
    return axiosInstance.post("/user/login", credentials);
  },
  refreshToken: (token) => {
    return axiosInstance.post("/user/refresh-token", { refreshToken: token });
  },
  getAllUsers: () => {
    return axiosInstance.get("/user/all");
  },
  handleFirebaseLogin: (firebaseData) => {
    return axiosInstance.post("/user/login-firebase", firebaseData);
  },
  logoutUser: (token) => {
    return axiosInstance.post("/user/logout", { refreshToken: token });
  },
  forgotPassword: (email) => {
    return axiosInstance.post("/user/forgot-password", { email });
  },
  createPassword: (password) => {
    return axiosInstance.post("/user/create-password", { password });
  },
  registerWithFirebase: (firebaseData) => {
    return axiosInstance.post("/user/register-firebase", firebaseData);
  },
  uploadAvatar: (userId, avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    return axiosInstance.post(`/user/upload-avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  removeAvatar: (userId) => {
    return axiosInstance.delete(`/user/remove-avatar/${userId}`);
  },
  getUserProfile: () => {
    return axiosInstance.get('/user/profile');
  },
  updateUserProfile: (userData) => {
    const formData = new FormData();
    
    if (userData.name) formData.append('name', userData.name);
    if (userData.phone) formData.append('phone', userData.phone);
    if (userData.address) formData.append('address', userData.address);
    
    if (userData.avatar && userData.avatar instanceof File) {
      formData.append('avatar', userData.avatar);
    }

    return axiosInstance.put('/user/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
