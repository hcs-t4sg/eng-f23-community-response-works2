import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  datasets: [
    {
      label: '# of Users',
      data: [1, 2, 2, 3, 3, 1, 4, 4, 3, 5, 2, 5],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

export function RadarGraph() {
  return <Radar data={data} />;
}