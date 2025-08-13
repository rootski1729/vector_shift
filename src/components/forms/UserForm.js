import React from 'react';
import { Button } from '../ui';

function UserForm({ form, onChange, onSubmit, loading, error }) {
	return (
		<form className="bg-white p-6 rounded shadow w-full max-w-lg" onSubmit={onSubmit}>
			<input name="username" value={form.username} onChange={onChange} placeholder="Username" className="w-full mb-4 p-2 border rounded" required />
			<input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full mb-4 p-2 border rounded" required />
			<input name="status" value={form.status} onChange={onChange} placeholder="Status" className="w-full mb-4 p-2 border rounded" />
			<Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
			{error && <div className="text-red-500 mt-4">{error}</div>}
		</form>
	);
}

export default UserForm;
