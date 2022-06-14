import React from 'react';
import styled from '@emotion/styled';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useUser } from '../contexts/UserContext.jsx';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const options = {
    responsive: true,
};

const labels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const data = {
    labels,
    datasets: [
        {
            label: 'Daily Earnings',
            data: labels.map(() => 100 - Math.random() * 80),
            borderColor: '#32FFCE',
            backgroundColor: '#32FFCE',
        },
    ],
};

const LineChart = (props) => {
    const { user } = useUser();
    return <Line options={options} data={data} />;
};

export default LineChart;
