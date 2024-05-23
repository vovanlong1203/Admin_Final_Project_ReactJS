import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const OrderStatusChart = ({ orderStatusData }) => {
    // Dữ liệu mẫu về số lượng đơn hàng theo trạng thái
    const labels = Object.keys(orderStatusData);
    const values = Object.values(orderStatusData);

    // Dữ liệu cho biểu đồ
    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4CAF50' // Thêm các màu sắc khác tùy ý
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4CAF50' // Thêm các màu sắc hover tùy ý
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
