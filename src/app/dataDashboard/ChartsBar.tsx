import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { useState } from 'react';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  export default function ChartsBar() {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const [data, setData] = useState
    ({
      labels: labels,
      datasets: [{
        label: 'Expenses by Month',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgb(153, 102, 255)'
        ],
        borderColor: [
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }]
    });
  
    return <Bar data={data} />;
  };


