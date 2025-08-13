import React from 'react';

function Button({ children, onClick, type = 'button', className = '', disabled = false }) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${className}`}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export default Button;
