import React, { useState } from 'react';
import { instance } from '../../services/api';

function BatchUpload() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleBatchUpload = async e => {
		e.preventDefault();
		if (!videos.length) return;
		setLoading(true);
		setError(null);
		setSuccess(null);
		const formData = new FormData();
		for (let i = 0; i < videos.length; i++) {
			formData.append('videos', videos[i]);
		}
		try {
			await instance.post('/admin/upload-video/batch', formData);
			setSuccess('Batch upload successful');
			setLoading(false);
		} catch (err) {
			setError('Failed to batch upload');
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Batch Upload</h1>
			<form className="bg-white p-6 rounded shadow" onSubmit={handleBatchUpload}>
				<label className="block mb-2">Upload Multiple Videos</label>
				<input type="file" accept="video/*" multiple onChange={e => setVideos(Array.from(e.target.files))} className="mb-4" required />
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Uploading...' : 'Batch Upload'}</button>
			</form>
			{error && <div className="text-red-500 mt-4">{error}</div>}
			{success && <div className="text-green-500 mt-4">{success}</div>}
		</div>
	);
}

export default BatchUpload;
