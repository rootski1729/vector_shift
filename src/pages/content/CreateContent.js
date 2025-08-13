import React, { useState } from 'react';
import { instance } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function CreateContent() {
	const [form, setForm] = useState({ title: '', genre: '', status: 'active' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleChange = e => {
	setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async e => {
	e.preventDefault();
	setLoading(true);
	setError(null);
	try {
	await instance.post('/admin/content', form);
	setLoading(false);
	navigate('/content');
	} catch (err) {
	setError('Failed to create content');
	setLoading(false);
	}
	};

	return (
	<div className="p-8">
	<h1 className="text-2xl font-bold mb-6">Create New Content</h1>
	<form className="bg-white p-6 rounded shadow w-full max-w-lg" onSubmit={handleSubmit}>
	<input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full mb-4 p-2 border rounded" required />
	<input name="genre" value={form.genre} onChange={handleChange} placeholder="Genre" className="w-full mb-4 p-2 border rounded" required />
	<select name="status" value={form.status} onChange={handleChange} className="w-full mb-4 p-2 border rounded">
	<option value="active">Active</option>
	<option value="inactive">Inactive</option>
	</select>
	<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
	{loading ? 'Saving...' : 'Create'}
	</button>
	{error && <div className="text-red-500 mt-4">{error}</div>}
	</form>
	</div>
	);
}

export default CreateContent;
