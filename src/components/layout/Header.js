import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
	return (
		<header className="bg-blue-700 text-white p-4 flex justify-between items-center">
			<Link to="/dashboard" className="font-bold text-xl">Cino Admin</Link>
			<nav>
				<Link to="/content" className="mx-2">Content</Link>
				<Link to="/users" className="mx-2">Users</Link>
				<Link to="/analytics" className="mx-2">Analytics</Link>
				<Link to="/system" className="mx-2">System</Link>
			</nav>
		</header>
	);
}

export default Header;
