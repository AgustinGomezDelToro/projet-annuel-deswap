import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 01', series1: 400000, series2: 200000 },
    { name: 'Week 02', series1: 300000, series2: 250000 },
    { name: 'Week 03', series1: 200000, series2: 300000 },
    { name: 'Week 04', series1: 278000, series2: 350000 },
    { name: 'Week 05', series1: 189000, series2: 400000 },
    { name: 'Week 06', series1: 239000, series2: 450000 },
    { name: 'Week 07', series1: 349000, series2: 500000 },
    { name: 'Week 08', series1: 449000, series2: 600000 },
    { name: 'Week 09', series1: 500000, series2: 700000 },
    { name: 'Week 10', series1: 600000, series2: 800000 },
];

const CustomLineChart = () => {
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
                    <Line type="monotone" dataKey="series1" stroke="#8884d8" strokeWidth={3} />
                    <Line type="monotone" dataKey="series2" stroke="#82ca9d" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;
