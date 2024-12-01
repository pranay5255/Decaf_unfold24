"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js"; 
import { Doughnut, Line } from "react-chartjs-2";
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);// Register the scales


const Debug: NextPage = () => {
  const { address, isConnected } = useAccount();
  const donught_data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  //barchart

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Monthly data',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  const bar_data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  //line data
  const line_data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  //pie data

  const pie_data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  console.log(address, isConnected);
  return (
    <>
      <div className="flex w-4/5 pt-8 mx-auto">
        <h1 className="text-left">
            <span className="block text-4xl font-bold">Analytics</span>
          </h1>
      </div>
      
      <br/>
      <div className="flex flex-grow w-4/5 pt-8 mx-auto">
        <div className="w-1/2 flex justify-center items-center" 
          style={{height: "400px"}}> {/* First div (50% width) */}
          <p className="text-left">
            <span className="block text-1xl font-bold">TVL</span>
          </p>
        <Doughnut data={donught_data} />
        </div>
        <div className="w-1/2 flex justify-center items-center"> {/* Second div (50% width) */}
        <p className="text-left">
            <span className="block text-1xl font-bold">Monthly usage</span>
          </p>
        <Bar options={options} data={bar_data} />;
        </div>
      </div>
      <div className="flex flex-grow w-4/5 pt-8 mx-auto">
        <div className="w-1/2 flex justify-center items-center" 
        
          style={{height: "400px"}}> {/* First div (50% width) */}
          <p className="text-left">
            <span className="block text-1xl font-bold">Volatility</span>
          </p>
          <Line options={options} data={line_data} />
        </div>
        <div className="w-1/2 flex justify-center items-center"
        
        style={{height: "400px"}}> {/* Second div (50% width) */}
        <p className="text-left">
            <span className="block text-1xl font-bold">User distribution</span>
          </p>
          <Pie data={pie_data} />
        </div>
      </div>
      <br/><br/>
      <br/>
      <br/>
    </>
  );
};

export default Debug;
