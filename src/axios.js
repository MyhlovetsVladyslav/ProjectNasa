import axios from 'axios';

const apiKey = 'kBllQcAMyae3gPG8jB2r3DuaamFHZ7eYBROa5NO7';

const axiosInstance = axios.create({
    baseURL: 'https://api.nasa.gov/planetary/apod',
    params: {
        api_key: apiKey,
        start_date: '', 
        end_date: ''
    },
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;
