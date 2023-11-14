"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export interface LeaveData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const LeaveChart = ({ leaveData }: { leaveData: LeaveData }) => {
  return (
    <div className="p-4 w-full h-full sm:w-[500px] sm:h-[500px] max-w-xs mx-auto">
      <Doughnut data={leaveData} />
    </div>
  );
};

export default LeaveChart;
