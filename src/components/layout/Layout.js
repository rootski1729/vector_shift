import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 p-8 bg-gray-50">{children}</main>
			</div>
		</div>
	);
}

export default Layout;
