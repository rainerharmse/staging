import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://vuejs-stock-trader-adb21.firebaseio.com'
});

// instance.defaults.headers.common['SOMETHING'] = 'rain something'

export default instance;