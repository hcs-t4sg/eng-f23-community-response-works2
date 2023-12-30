import React from 'react';
import { request } from '../requests';

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

export default function RequestByTimeOfDay(
  {dashboardData}:
  {dashboardData: request[] | undefined}
  ) {
    // Obtain data array
    var data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var max = -1;
    dashboardData?.forEach(function (request) {
      if (request.createdAt) {
        let hr = new Date(request.createdAt).getHours();
        data[hr % 24]++;
        max = Math.max(max, data[hr % 24]);
      }
    });
    // Scale graph to a maximum of 10
    const scaleFactor = 10;
    for (let i = 0; i < data.length; i++) {
      data[i] *= scaleFactor/max;
    }
    // Create graph
    const radial_data = {
        labels: [24,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        datasets: [
          {
            label: '# of Users',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
  return (
    <div className='w-full h-full flex justify-center align-middle'>
      <div className='max-w-md max-h-md place-self-center'>
        <h3 className='w-full text-center'>Users Per Time of Day</h3>
        <div className='w-full h-full'>
          <Radar data={radial_data} />
        </div>
      </div>
    </div>
  );
}
