import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

function LoginPage() {
	const { login, loading, error } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		const success = await login(username, password);
		if (success) {
			window.location.href = '/dashboard';
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleLogin}>
				<h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
				<input
					className="w-full mb-4 p-2 border rounded"
					value={username}
					onChange={e => setUsername(e.target.value)}
					placeholder="Username"
					required
				/>
				<input
					className="w-full mb-4 p-2 border rounded"
					value={password}
					onChange={e => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
				{error && <div className="text-red-500 mt-4 text-center">{error}</div>}
			</form>
		</div>
	);
}

export default LoginPage;
