import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import { getOrderByMonthYear, getOrderStatusByMonthYear } from '../api/service';
import { Doughnut } from 'react-chartjs-2';

function Statistics() {
  const [data, setData] = useState([])
  const [orderStatusData, setOrderStatusData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [selectedMonthYear, setSelectedMonthYear] = useState('')

  useEffect(() => {
    if (selectedMonthYear) {
      const [year, month] = selectedMonthYear.split('-')
      fetchData(year, month)
    }
  }, [selectedMonthYear])

  const fetchData = async (year, month) => {
    try {
      const responseRevenue = await getOrderByMonthYear( month, year)
      const responseStatus = await getOrderStatusByMonthYear(month, year)
      
      setRevenueData(responseRevenue)
      setData(revenueData)
      setOrderStatusData(responseStatus)
      console.log(responseStatus)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  const formattedData = revenueData.map(item => ({
    date: item.date,
    revenue: item.total
  }))

  const handleMonthYearChange = (event) => {
    const selectedMonthYear = event.target.value
    setSelectedMonthYear(selectedMonthYear)
  }
//   useEffect(() => {
//     setData(revenueData);
// }, [revenueData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className='main-container'>
      <div>
        <h1 style={{textAlign: 'center', margin : "30px"}}>Thống Kê Doanh Thu và Trạng Thái Đơn Hàng Theo Tháng</h1>
        <label>Chọn Tháng và Năm: </label>
        <input type="month" onChange={handleMonthYearChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h3>Doanh Thu Theo Ngày</h3>
          <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <h3>Trạng Thái Đơn Hàng Trong Tháng</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={400} height={400}>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {orderStatusData && orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
