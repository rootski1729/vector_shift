import axios from './api';

export const login = (username, password) =>
	axios.post('/admin/login', { username, password });
