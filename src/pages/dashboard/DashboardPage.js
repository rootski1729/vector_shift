import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';
import { Link } from 'react-router-dom';

function DashboardPage() {
	const [stats, setStats] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchStats() {
			setLoading(true);
			try {
				const res = await instance.get('/admin/analytics/platform');
				setStats(res.data.data || {});
				setLoading(false);
			} catch (err) {
				setError('Failed to load stats');
				setLoading(false);
			}
		}
		fetchStats();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded shadow p-6">
						<h2 className="text-lg font-semibold mb-2">Total Users</h2>
						<div className="text-2xl font-bold">{stats.totalUsers || '-'}</div>
					</div>
					<div className="bg-white rounded shadow p-6">
						<h2 className="text-lg font-semibold mb-2">Total Content</h2>
						<div className="text-2xl font-bold">{stats.totalContent || '-'}</div>
					</div>
					<div className="bg-white rounded shadow p-6">
						<h2 className="text-lg font-semibold mb-2">Active Users</h2>
						<div className="text-2xl font-bold">{stats.activeUsers || '-'}</div>
					</div>
				</div>
			)}
			<div className="flex gap-4">
				<Link to="/content" className="bg-blue-600 text-white px-4 py-2 rounded">Manage Content</Link>
				<Link to="/users" className="bg-blue-600 text-white px-4 py-2 rounded">Manage Users</Link>
				<Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded">Upload Episodes</Link>
				<Link to="/analytics" className="bg-blue-600 text-white px-4 py-2 rounded">View Analytics</Link>
				<Link to="/system" className="bg-blue-600 text-white px-4 py-2 rounded">System Controls</Link>
			</div>
		</div>
	);
}

export default DashboardPage;
