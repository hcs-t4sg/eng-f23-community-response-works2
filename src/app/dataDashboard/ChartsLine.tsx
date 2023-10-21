import React from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const mock_user_data = [
  
  {
      month: 'January',
      new_users: 4000,
      users_lost: 2400,
      total_users: 2400,
  },
  {
      month: 'February',
      new_users: 3000,
      users_lost: 1398,
      total_users: 2210,
  },
  {
      month: 'March',
      new_users: 2000,
      users_lost: 9800,
      total_users: 2290,
  },
  {
      month: 'April',
      new_users: 2780,
      users_lost: 3908,
      total_users: 2000,
  },
  {
      month: 'May',
      new_users: 1890,
      users_lost: 4800,
      total_users: 2181,
  },
  {
      month: 'June',
      new_users: 2390,
      users_lost: 3800,
      total_users: 2500,
  },
  {
      month: 'July',
      new_users: 3490,
      users_lost: 4300,
      total_users: 2100,
  },
];

export const data = {
  labels: labels,
  datasets: [
    {
      label: 'New Users',
      data: mock_user_data.map(obj => obj.new_users),
      borderColor: 'rgb(50,205,50)',
      backgroundColor: 'rgba(50,205,50, 0.5)',
    },
    {
      label: 'Users Lost',
      data: mock_user_data.map(obj => obj.users_lost),
      borderColor: 'rgb(138,43,226)',
      backgroundColor: 'rgba(138,43,226 0.5)',
    },
    {
      label: 'Total Users',
      data: mock_user_data.map(obj => obj.total_users),
      borderColor: 'rgb(255, 87, 51)',
      backgroundColor: 'rgba(255, 87, 51, 0.5)',
    }
  ],
};


export default function ChartsLine() {
  return <Line options={options} data={data} />;
}
