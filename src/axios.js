import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://turndemo-ab9f7-default-rtdb.asia-southeast1.firebasedatabase.app'
});

export default instance;