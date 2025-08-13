import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [admin, setAdmin] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('adminToken');
		if (token) {
			setAdmin({ token });
		}
	}, []);

	const login = async (username, password) => {
		setLoading(true);
		setError(null);
		try {
			const res = await loginApi(username, password);
			localStorage.setItem('adminToken', res.data.token);
			setAdmin({ token: res.data.token });
			setLoading(false);
			return true;
		} catch (err) {
			setError('Login failed');
			setLoading(false);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem('adminToken');
		setAdmin(null);
	};

	return (
		<AuthContext.Provider value={{ admin, login, logout, loading, error }}>
			{children}
		</AuthContext.Provider>
	);
};
