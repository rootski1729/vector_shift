import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function BarChart({ data, xKey, yKey, color = '#8884d8', height = 300 }) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<ReBarChart data={data}>
				<XAxis dataKey={xKey} />
				<YAxis />
				<Tooltip />
				<Bar dataKey={yKey} fill={color} />
			</ReBarChart>
		</ResponsiveContainer>
	);
}

export default BarChart;
