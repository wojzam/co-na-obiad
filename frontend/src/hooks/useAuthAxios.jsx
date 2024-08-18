import useAuthData from "./useAuthData";
import axios from "axios";

const useAuthAxios = () => {
    const {token, logout} = useAuthData();
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAuthAxios;
