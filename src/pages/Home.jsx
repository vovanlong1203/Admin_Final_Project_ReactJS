import React, { useEffect, useState } from 'react'
import { 
    BsFillBellFill, BsFillEnvelopeFill, BsFillGrid3X3GapFill, BsPersonCircle, BsSearch, BsJustify, BsFillArchiveFill, BsPeopleFill 
} from 'react-icons/bs'
import { FaReceipt } from "react-icons/fa";
import { 
    BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { get_all_user, getCategory, getProduct, getOrder, revenueStatisticYear, getYearOrder, getStatusOrder, getCountProduct, getCountCategory, getCountUser, getCountOrder, getOrderByMonthYear, getOrderStatusByMonthYear} from '../api/service';
import OrderStatusChart from './PieChart';
import ProductSize from './ProductSize';

function Home() {
    const [users, setUsers] = useState(0);
    const [products, setProducts] = useState(0)
    const [categories, setCategories] = useState(0)
    const [orders, setOrders] = useState(0)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [data, setData] = useState([])
    const [revenueData, setRevenueData] = useState([])
    const [years, setYears] = useState([])
    const [orderStatusData, setOrderStatusData] = useState({})

    const fetchData = async () => {
        const responseDataProducts = await getCountProduct()
        const responseDataCategories = await getCountCategory()
        const responseGetYearOrder = await getYearOrder()
        setProducts(responseDataProducts)
        setCategories(responseDataCategories)
        setYears(responseGetYearOrder)
    }

    const fetchDataUser = async () => {
        const responseDataUser = await getCountUser()
        setUsers(responseDataUser)
    }

    const fetchDataOrder = async () => {
        const responseDataOrder = await getCountOrder()
        setOrders(responseDataOrder)
    }

    const fetchDataRevenueStatisticYear = async (year) => {
        const response = await revenueStatisticYear(year)
        const responseStatus = await getStatusOrder(year)

        setRevenueData(response)
        setData(revenueData)
        setOrderStatusData(responseStatus)
    }

    const fetchDataStatusOrder = async (year) => {
        const response = await getStatusOrder(year)

    }

    useEffect(() => {
        fetchData()
        fetchDataUser()
        fetchDataOrder()
        fetchDataRevenueStatisticYear(selectedYear)

    }, [selectedYear])

    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ffbb28', '#ff7300', '#ff0000', '#00ff00'];

    const handleYearChange = (event) => {
        const year = event.target.value; 
        setSelectedYear(year); 
      };

    useEffect(() => {
        setData(revenueData);
    }, [revenueData]);


    return (
        <div className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>SẢN PHẨM</h3>
                        <BsFillArchiveFill className='card_icon'/>
                    </div>
                    <h1>{products}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>DANH MỤC</h3>
                        <BsFillGrid3X3GapFill className='card_icon'/>
                    </div>
                    <h1>{categories}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>KHÁCH HÀNG</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                    <h1>{users}</h1>
                </div>

                <div className='card'>
                    <div className='card-inner'>
                        <h3>ĐƠN HÀNG</h3>
                        <FaReceipt className='card_icon'/>
                    </div>
                    <h1>{orders}</h1>
                </div>
            </div>

            <div className='charts'>
                <div className='year-select'>
                    <label className='year-select-label'>Chọn năm: </label>
                    <select className='year-select-dropdown' value={selectedYear} onChange={handleYearChange}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <br />
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -10 }} />
                        <YAxis label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
                <div className='year-select'>
                    <label className='year-select-label'>Trạng thái dơn hàng</label>
                    <OrderStatusChart orderStatusData={orderStatusData} />
                </div>
            </div>
        </div>
    )
}

export default Home;
