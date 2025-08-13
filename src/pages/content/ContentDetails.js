import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';
import { useParams } from 'react-router-dom';

function ContentDetails() {
	const { id } = useParams();
	const [content, setContent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchContent() {
			setLoading(true);
			try {
				const res = await instance.get(`/admin/content/${id}`);
				setContent(res.data.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to load content');
				setLoading(false);
			}
		}
		fetchContent();
	}, [id]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (error) return <div className="p-8 text-red-500">{error}</div>;
	if (!content) return <div className="p-8">No content found.</div>;

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">{content.title}</h1>
			<div className="mb-4">Genre: {content.genre}</div>
			<div className="mb-2">Status: {content.status}</div>
			<div className="mb-2">Description: {content.description}</div>
			{/* Add more fields as needed */}
		</div>
	);
}

export default ContentDetails;
