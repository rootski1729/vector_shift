import React, { useEffect, useState } from 'react';
import { instance } from '../../services/api';
import { Link } from 'react-router-dom';

function ContentList() {
	const [content, setContent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchContent() {
			setLoading(true);
			try {
				const res = await instance.get('/admin/content');
				setContent(res.data.data || []);
				setLoading(false);
			} catch (err) {
				setError('Failed to load content');
				setLoading(false);
			}
		}
		fetchContent();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Content Management</h1>
			<Link to="/content/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
				Create New Content
			</Link>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				<table className="w-full bg-white rounded shadow">
					<thead>
						<tr>
							<th className="p-2">Title</th>
							<th className="p-2">Genre</th>
							<th className="p-2">Status</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{content.map(item => (
							<tr key={item._id}>
								<td className="p-2">{item.title}</td>
								<td className="p-2">{item.genre}</td>
								<td className="p-2">{item.status}</td>
								<td className="p-2">
									<Link to={`/content/${item._id}`} className="text-blue-600 underline">
										Details
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default ContentList;
