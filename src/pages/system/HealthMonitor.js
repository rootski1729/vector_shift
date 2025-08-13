import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';

function HealthMonitor() {
	const [health, setHealth] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchHealth() {
			setLoading(true);
			try {
				const res = await instance.get('/admin/health');
				setHealth(res.data.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to load system health');
				setLoading(false);
			}
		}
		fetchHealth();
	}, []);

	if (loading) return <div>Loading system health...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!health) return <div>No health data found.</div>;

	return (
		<div className="mb-8">
			<h2 className="text-xl font-semibold mb-4">System Health</h2>
			<div>Status: {health.status}</div>
			<div>Uptime: {health.uptime}</div>
			<div>Version: {health.version}</div>
			{/* Add more health info as needed */}
		</div>
	);
}

export default HealthMonitor;
