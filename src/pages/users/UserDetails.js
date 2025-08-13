import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';
import { useParams } from 'react-router-dom';

function UserDetails() {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			setLoading(true);
			try {
				const res = await instance.get(`/admin/users/${id}`);
				setUser(res.data.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to load user');
				setLoading(false);
			}
		}
		fetchUser();
	}, [id]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (error) return <div className="p-8 text-red-500">{error}</div>;
	if (!user) return <div className="p-8">No user found.</div>;

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">{user.username}</h1>
			<div className="mb-4">Email: {user.email}</div>
			<div className="mb-2">Status: {user.status}</div>
			{/* Add more fields as needed */}
		</div>
	);
}

export default UserDetails;
