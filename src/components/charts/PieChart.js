import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function PieChart({ data, dataKey, nameKey, height = 300 }) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<RePieChart>
				<Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
			</RePieChart>
		</ResponsiveContainer>
	);
}

export default PieChart;
