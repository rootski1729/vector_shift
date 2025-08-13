import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';
import { Link } from 'react-router-dom';

function UsersList() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchUsers() {
			setLoading(true);
			try {
				const res = await instance.get('/admin/users');
				setUsers(res.data.data || []);
				setLoading(false);
			} catch (err) {
				setError('Failed to load users');
				setLoading(false);
			}
		}
		fetchUsers();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">User Management</h1>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				<table className="w-full bg-white rounded shadow">
					<thead>
						<tr>
							<th className="p-2">Username</th>
							<th className="p-2">Email</th>
							<th className="p-2">Status</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map(user => (
							<tr key={user._id}>
								<td className="p-2">{user.username}</td>
								<td className="p-2">{user.email}</td>
								<td className="p-2">{user.status}</td>
								<td className="p-2">
									<Link to={`/users/${user._id}`} className="text-blue-600 underline">Details</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default UsersList;
