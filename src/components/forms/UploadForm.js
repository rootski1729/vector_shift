import React from 'react';
import { Button } from '../ui';

function UploadForm({ video, thumbnail, onVideoChange, onThumbnailChange, onVideoUpload, onThumbnailUpload, loading, error, success }) {
	return (
		<div>
			<form className="bg-white p-6 rounded shadow mb-6" onSubmit={onVideoUpload}>
				<label className="block mb-2">Upload Video</label>
				<input type="file" accept="video/*" onChange={onVideoChange} className="mb-4" required />
				<Button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Video'}</Button>
			</form>
			<form className="bg-white p-6 rounded shadow" onSubmit={onThumbnailUpload}>
				<label className="block mb-2">Upload Thumbnail</label>
				<input type="file" accept="image/*" onChange={onThumbnailChange} className="mb-4" required />
				<Button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Thumbnail'}</Button>
			</form>
			{error && <div className="text-red-500 mt-4">{error}</div>}
			{success && <div className="text-green-500 mt-4">{success}</div>}
		</div>
	);
}

export default UploadForm;
