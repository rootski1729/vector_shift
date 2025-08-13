import React from 'react';

function Alert({ type = 'info', message }) {
	const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue';
	return (
		<div className={`bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-2 rounded mb-4`}>
			{message}
		</div>
	);
}

export default Alert;
