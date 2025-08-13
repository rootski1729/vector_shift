import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Sidebar() {
	return (
		<aside className="w-64 bg-white shadow-md h-full">
		<div className="p-6 font-bold text-xl">Admin Dashboard</div>
		<nav className="mt-8">
			<ul>
				<li className="mb-4">
					<NavLink
						to="/dashboard"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Dashboard
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/users"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Users
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/content"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Content
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/upload"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Upload
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/analytics"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Analytics
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/system"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						System
					</NavLink>
				</li>
				<li className="mb-4">
					<NavLink
						to="/settings"
						className={({ isActive }) =>
							isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
						}
					>
						Settings
					</NavLink>
				</li>
			</ul>
			</nav>
			</aside>
		);
	}
	export default Sidebar;

