import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const OrderStatusChart = ({ orderStatusData }) => {
    const labels = Object.keys(orderStatusData)
    const values = Object.values(orderStatusData)

    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4CAF50',
                    '#36CAF4' 
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4CAF50',
                    '#36CAF4'
                ]
            }
        ]
    };

    return (
        <div style={{height: '380px'}}>
            <Doughnut data={data} />
        </div>
    );
};

export default OrderStatusChart;
