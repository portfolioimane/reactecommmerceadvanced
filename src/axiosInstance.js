import axios from 'axios';

// Create an Axios instance with a default base URL
const axiosInstance = axios.create({
    baseURL: 'http://localhost/',
    withCredentials: true, // Ensure cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to include the token in the headers
// Axios instance
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
        console.log('Request headers:', config.headers);
    return config;
}, error => {
    return Promise.reject(error);
});



export default axiosInstance;
