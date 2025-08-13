import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function LineChart({ data, xKey, yKey, color = '#82ca9d', height = 300 }) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<ReLineChart data={data}>
				<XAxis dataKey={xKey} />
				<YAxis />
				<Tooltip />
				<Line type="monotone" dataKey={yKey} stroke={color} />
			</ReLineChart>
		</ResponsiveContainer>
	);
}

export default LineChart;
