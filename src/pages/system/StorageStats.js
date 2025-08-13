import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';

function StorageStats() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchStats() {
			setLoading(true);
			try {
				const res = await instance.get('/admin/storage/stats');
				setStats(res.data.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to load storage stats');
				setLoading(false);
			}
		}
		fetchStats();
	}, []);

	if (loading) return <div>Loading storage stats...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!stats) return <div>No storage data found.</div>;

	return (
		<div className="mb-8">
			<h2 className="text-xl font-semibold mb-4">Storage Stats</h2>
			<div>Total Files: {stats.totalFiles}</div>
			<div>Total Size: {stats.totalSize}</div>
			{/* Add more storage info as needed */}
		</div>
	);
}

export default StorageStats;
