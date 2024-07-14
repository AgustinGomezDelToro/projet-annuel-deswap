import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CustomLineChartProps {
    data: { name: string, value: number }[];
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({ data }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Utilisation depuis son lancement</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;
