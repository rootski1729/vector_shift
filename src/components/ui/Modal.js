import React from 'react';

function Modal({ open, onClose, title, children }) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
				<button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
				{title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
				{children}
			</div>
		</div>
	);
}

export default Modal;
