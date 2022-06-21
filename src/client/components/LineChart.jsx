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
    const [botData, totalData] = props.data;
    const data = {
        labels: [1, 2, 3, 4, 5],
        labels: botData?.map((item) => moment(item.date).format('dddd')),
        datasets: [
            {
                label: 'Bot Earnings',
                data: botData?.map((item) => item.earnings),
                borderColor: '#32FFCE',
                backgroundColor: '#32FFCE',
            },
            {
                label: 'Total Earnings',
                data: totalData?.map((item) => item.earnings),
                borderColor: '#7950f2',
                backgroundColor: '#7950f2',
            },
        ],
    };

    console.log(data);

    return <Line options={options} data={data} />;
};

export default LineChart;
