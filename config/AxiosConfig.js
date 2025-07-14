import axios from "axios"

const axiosUrl = axios.create({
    baseURL: 'https://backend-njgx.onrender.com'
})

export default axiosUrl