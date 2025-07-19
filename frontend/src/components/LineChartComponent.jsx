import React, { useRef, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChartComponent = ({ monthlyTrends }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = chartRef.current;

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [monthlyTrends]);

    const data = {
        labels: monthlyTrends.map(trend => trend.month),
        datasets: [
            {
                label: 'Total Investido',
                data: monthlyTrends.map(trend => trend.totalInvested),
                borderColor: '#3B82F6',
                fill: false,
            },
            {
                label: 'Juros Recebidos',
                data: monthlyTrends.map(trend => trend.interestEarned),
                borderColor: '#10B981',
                fill: false,
            },
        ],
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Tendências Mensais</h3>
            <Line ref={chartRef} data={data} />
        </div>
    );
};

export default LineChartComponent;
