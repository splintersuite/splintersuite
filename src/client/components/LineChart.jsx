import React from 'react';
import moment from 'moment';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

const LineChart = (props) => {
    const data = {
        labels: props.data?.map((item) => moment(item.date).format('dddd')),
        datasets: [
            {
                label: 'Total Earnings',
                data: props.data?.map((item) => item.earnings),
                borderColor: '#32FFCE',
                backgroundColor: '#32FFCE',
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default LineChart;
