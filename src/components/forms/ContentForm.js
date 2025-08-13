import React from 'react';
import { Button } from '../ui';

function ContentForm({ form, onChange, onSubmit, loading, error }) {
	return (
		<form className="bg-white p-6 rounded shadow w-full max-w-lg" onSubmit={onSubmit}>
			<input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full mb-4 p-2 border rounded" required />
			<textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full mb-4 p-2 border rounded" required />
			<input name="genre" value={form.genre} onChange={onChange} placeholder="Genre" className="w-full mb-4 p-2 border rounded" required />
			<input name="language" value={form.language} onChange={onChange} placeholder="Language" className="w-full mb-4 p-2 border rounded" required />
			<input name="type" value={form.type} onChange={onChange} placeholder="Type" className="w-full mb-4 p-2 border rounded" />
			<input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full mb-4 p-2 border rounded" />
			<input name="releaseYear" value={form.releaseYear} onChange={onChange} placeholder="Release Year" className="w-full mb-4 p-2 border rounded" />
			<input name="rating" value={form.rating} onChange={onChange} placeholder="Rating" className="w-full mb-4 p-2 border rounded" />
			<input name="totalEpisodes" type="number" value={form.totalEpisodes} onChange={onChange} placeholder="Total Episodes" className="w-full mb-4 p-2 border rounded" />
			<Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
			{error && <div className="text-red-500 mt-4">{error}</div>}
		</form>
	);
}

export default ContentForm;
