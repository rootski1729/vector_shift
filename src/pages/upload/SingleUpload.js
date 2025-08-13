import React, { useState } from 'react';
import { instance } from '../../services/api';

function SingleUpload() {
	const [video, setVideo] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [episodeId, setEpisodeId] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleVideoUpload = async e => {
		e.preventDefault();
		if (!video) return;
		setLoading(true);
		setError(null);
		setSuccess(null);
		const formData = new FormData();
		formData.append('video', video);
		try {
			await instance.post('/admin/upload-video', formData);
			setSuccess('Video uploaded successfully');
			setLoading(false);
		} catch (err) {
			setError('Failed to upload video');
			setLoading(false);
		}
	};

	const handleThumbnailUpload = async e => {
		e.preventDefault();
		if (!thumbnail || !episodeId) return;
		setLoading(true);
		setError(null);
		setSuccess(null);
		const formData = new FormData();
		formData.append('thumbnail', thumbnail);
		try {
			await instance.post(`/admin/upload-thumbnail/${episodeId}`, formData);
			setSuccess('Thumbnail uploaded successfully');
			setLoading(false);
		} catch (err) {
			setError('Failed to upload thumbnail');
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Single Upload</h1>
			<form className="bg-white p-6 rounded shadow mb-6" onSubmit={handleVideoUpload}>
				<label className="block mb-2">Upload Video</label>
				<input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} className="mb-4" required />
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Uploading...' : 'Upload Video'}</button>
			</form>
			<form className="bg-white p-6 rounded shadow" onSubmit={handleThumbnailUpload}>
				<label className="block mb-2">Upload Thumbnail (for Episode)</label>
				<input type="text" value={episodeId} onChange={e => setEpisodeId(e.target.value)} placeholder="Episode ID" className="w-full mb-4 p-2 border rounded" required />
				<input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} className="mb-4" required />
				<button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Uploading...' : 'Upload Thumbnail'}</button>
			</form>
			{error && <div className="text-red-500 mt-4">{error}</div>}
			{success && <div className="text-green-500 mt-4">{success}</div>}
		</div>
	);
}

export default SingleUpload;
