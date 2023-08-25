import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../redux/userReducer/userSlice";
import { taskEnum } from "../../utils/constants";

const PieChart = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const dispatch = useDispatch();
  const { dashBoard } = useSelector((state) => state.user.value);

  useEffect(() => {
    dispatch(getDashboardData);
  }, [dispatch]);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (dashBoard) {
      setData({
        labels: taskEnum,
        datasets: [
          {
            label: "Cases",
            data: [
              dashBoard?.open,
              dashBoard?.pending,
              dashBoard?.inProgress,
              dashBoard?.closed,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(53, 162, 235, 0.7)",
              "rgba(0, 0, 255, 0.6)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(53, 162, 235, 0.5)",
              "rgba(0, 0, 255, 0.5)",
              "rgba(75, 192, 192, 0.5)",
            ],
            borderWidth: 0.5,
          },
        ],
      });
    }
  }, [dashBoard]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "start",
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: false,
        text: "Properties sales monthly",
      },
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce((sum, value) => sum + value, 0);
          const value = dataset.data[tooltipItem.index];
          const percentage = ((value / total) * 100).toFixed(2);
          return `${dataset.label}: ${value} (${percentage}%)`;
        },
      },
    },
  };

  return <>{data && <Pie data={data} options={options} />}</>;
};

export default PieChart;
