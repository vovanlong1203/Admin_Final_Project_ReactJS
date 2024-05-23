import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input } from 'semantic-ui-react'
import { getOrder, updateStatusOrder} from '../api/service';
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "../assets/category.css"

function Order() {

    const [order, setOrder] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filterOrder, setFilterOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage, setItemsPerPage] = useState(10); // Số mục trên mỗi trang

    const nextStatuses = {
        UNCONFIRMED: ['CONFIRMED'],
        CONFIRMED: ['IN_TRANSIT'],
        IN_TRANSIT: ['DELIVERED'],
        DELIVERED: ['DELIVERED'],
    };

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentOrder = filterOrder.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filterOrder.length / itemsPerPage)

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <div>
                <Button color='grey' onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</Button>
                {pageNumbers.map(number => (
                    <Button
                        key={number}
                        onClick={() => goToPage(number)}
                        disabled={currentPage === number}
                    >
                        {number}
                    </Button>
                ))}
                <Button color='purple' onClick={goToNextPage} disabled={currentPage === totalPages}>Next</Button>

            </div>
        );
    };

    const fetchOrder = async () => {
        try {
            const orderData = await getOrder()
            console.log(orderData)
            setOrder(orderData)
            setFilterOrder(orderData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])


    const handleStatusClick = async (id, status) => {
        const data = {
            'status' : status
        }
        const response = await updateStatusOrder(id, data)
        if (response.status == 200) {
            fetchOrder()
            toast.success(`update status ${status}  order successfully`)
        } else {
            toast.error("failed update status order")
        }
    }

    const getStatusButtonColor = (status) => {
        switch (status) {
            case 'UNCONFIRMED':
                return 'grey';
            case 'CONFIRMED':
                return 'blue';
            case 'PACKAGING':
                return 'orange';
            case 'IN_TRANSIT':
                return 'yellow';
            case 'DELIVERED':
                return 'green';
            default:
                return 'grey'; // default color
        }
    }

    const getStatusButtonStyle = () => {
        return {
            width: '100px', // hoặc kích thước bạn muốn
            height: '40px', // hoặc kích thước bạn muốn
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    };

    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase()

        const filtered = order.filter((pro) => 
            pro.customer.toLowerCase().includes(keyword) ||
            pro.phone_number.toLowerCase().includes(keyword) ||
            pro.payment_method.toLowerCase().includes(keyword) ||
            pro.status.toLowerCase().includes(keyword) 
        )
        setFilterOrder(filtered)
    }

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2 className="text-center">Order List</h2>
            </center>
            <br />

            <div className="row" style={{marginBottom: '20px'}}>
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ paddingRight: '20px' }}
                />
                <Button primary type='button' 
                onClick={handleSearch}
                >Search</Button>
            </div>

            <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Id</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Phone_number</Table.HeaderCell>
                    <Table.HeaderCell>Total_amount</Table.HeaderCell>
                    <Table.HeaderCell>Payment_method</Table.HeaderCell>
                    <Table.HeaderCell>Shipping_address</Table.HeaderCell>
                    <Table.HeaderCell>order_date</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                <Table.Body>
                    {
                        currentOrder.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell>{item.customer}</Table.Cell>
                                    <Table.Cell>{item.phone_number}</Table.Cell>
                                    <Table.Cell>{item.total_amount}</Table.Cell>
                                    <Table.Cell className="break-word">{item.payment_method}</Table.Cell>
                                    <Table.Cell className="break-word">{item.shipping_address}</Table.Cell>
                                    <Table.Cell className="break-word">{item.order_date}</Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                        style={getStatusButtonStyle()}
                                        color={getStatusButtonColor(item.status)}>
                                            {item.status}
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {nextStatuses[item.status] && nextStatuses[item.status].length > 0 && !nextStatuses[item.status].includes(item.status) ? (
                                            <>
                                            {nextStatuses[item.status].map((status) => (
                                                <Button 
                                                    style={getStatusButtonStyle()}
                                                    color={getStatusButtonColor(status)} 
                                                    type='button' 
                                                    key={status} 
                                                    onClick={() => handleStatusClick(item.id, status)}>
                                                    <span>{status}</span>
                                                </Button>
                                            ))}
                                            </>
                                        ) : ''}
                                    </Table.Cell>

                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
            </div>
            <br />
            {renderPaginationButtons()}
        </div>
        <ToastContainer />
    </div>
  )
}

export default Order