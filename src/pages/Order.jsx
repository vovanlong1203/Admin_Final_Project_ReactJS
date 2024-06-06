import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Modal, Popup } from 'semantic-ui-react'
import { getOrder, updateStatusOrder, searchOrder, getOrderItemDetail} from '../api/service';
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "../assets/category.css"
import { RiMoneyDollarCircleFill } from "react-icons/ri"
import { FaRegCreditCard } from "react-icons/fa"
import { generateInvoice } from './GenerateInvoice'
import { IoSettingsOutline } from "react-icons/io5";

function Order() {

    const [order, setOrder] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filterOrder, setFilterOrder] = useState([])
    const [open, setOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderItems, setOrderItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) 
    const [totalPages, setTotalPages] = useState(0)
    const [openPopup, setOpenPopup] = useState(false)
    const [popupProductId, setPopupProductId] = useState(null)
  
    const handleActionClick = (id) => {
      setPopupProductId(id)
      setOpenPopup(!openPopup)
    }


    const nextStatuses = {
        UNCONFIRMED: ['CONFIRMED'],
        CONFIRMED: ['IN_TRANSIT'],
        IN_TRANSIT: ['DELIVERED'],
        DELIVERED: ['DELIVERED'],
    };
    
    const handleClose = () => {
        setOpen(false)
        setSelectedOrder(null)
    }

    const handleViewDetails = async (order) => {
        try {
            setOpen(true)
            const response = await getOrderItemDetail(order.id)
            setSelectedOrder(order)
            setOrderItems(response)
            setOpenPopup(false)
        } catch (error) {
            console.log(error)
            setSelectedOrder([]);
        }
    }


    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchOrder(newPage, itemsPerPage, searchKeyword)
          }
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) {
          const newPage = currentPage + 1
          setCurrentPage(newPage)
          fetchOrder(newPage, itemsPerPage, searchKeyword)
        }
      }

      const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber)
        fetchOrder(pageNumber, itemsPerPage, searchKeyword)
      }
    

    const renderPaginationButtons = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i)
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

    const fetchOrder = async (page = currentPage, limit = itemsPerPage, keyword = searchKeyword) => {
        try {
            const orderData = await searchOrder(keyword, page, limit)
            console.log(orderData)
            setFilterOrder(orderData.items)
            setTotalPages(orderData.totalPages)
            localStorage.setItem("orders", JSON.stringify(orderData.items))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrder(currentPage,itemsPerPage,searchKeyword)
    }, [currentPage])


    const handleStatusClick = async (id, status) => {
        const data = {
            'status' : status
        }
        const response = await updateStatusOrder(id, data)
        if (response.status == 200) {
            await fetchOrder(currentPage, itemsPerPage, searchKeyword);
            toast.success(`câp nhật trạng thái đơn hàng thành công!`)
        } else {
            toast.error("câp nhật trạng thái đơn hàng thất bại!")
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
                return 'grey'; 
        }
    }

    const getStatusButtonStyle = () => {
        return {
            width: '100px', 
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    };

    const handleSearch = async () => {
        try {
            const keyword = searchKeyword.toLowerCase()
            const filtered = await searchOrder(keyword, currentPage, itemsPerPage);
            setFilterOrder(filtered.items)
            setTotalPages(filtered.totalPages)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2 className="text-center">Quản lí đơn hàng</h2>
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
                >Tìm kiếm</Button>
            </div>

            <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Khách hàng</Table.HeaderCell>
                    <Table.HeaderCell>Sô điện thoại</Table.HeaderCell>
                    <Table.HeaderCell>Tổng tiền</Table.HeaderCell>
                    <Table.HeaderCell className="break-word">Phương thức thanh toán</Table.HeaderCell>
                    <Table.HeaderCell>Địa chỉ </Table.HeaderCell>
                    <Table.HeaderCell>Ngày đặt hàng</Table.HeaderCell>
                    <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                    <Table.HeaderCell>Cập nhật trạng thái</Table.HeaderCell>
                    <Table.HeaderCell>Hành động</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                <Table.Body>
                    {
                        filterOrder.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell>{item.customer}</Table.Cell>
                                    <Table.Cell>{item.phone_number}</Table.Cell>
                                    <Table.Cell>{item.total_amount}</Table.Cell>
                                    <Table.Cell className="break-word">
                                        {item.payment_method === 'CASH' ? <RiMoneyDollarCircleFill style={{ fontSize: '40px' }}/> : <FaRegCreditCard  style={{ fontSize: '40px' }}/>}
                                    </Table.Cell>
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
                                    <Table.Cell>
                                        <Popup
                                            trigger={<Button color='orange' onClick={() => handleActionClick(item.id)}><IoSettingsOutline /> Hành động</Button>}
                                            content={
                                            <div>
                                                <Button color='green' onClick={() => handleViewDetails(item)}>Chi tiết</Button>
                                                <Button color='google plus' onClick={() => generateInvoice(item)}>Hóa đơn</Button>
                                            </div>
                                            }
                                            on='click'
                                            open={popupProductId === item.id && openPopup}
                                            onClose={() => setOpenPopup(false)}
                                            position='bottom left'
                                        />
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
        {selectedOrder && (
                <Modal open={open} onClose={handleClose}>
                    <Modal.Header >Chi tiết đặt hàng</Modal.Header>
                    <Modal.Content>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Sản phẩm</Table.HeaderCell>
                                    <Table.HeaderCell>Giá</Table.HeaderCell>
                                    <Table.HeaderCell>Số lượng</Table.HeaderCell>
                                    <Table.HeaderCell>Size</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                    {
                                        orderItems.map((item) => (
                                            <Table.Row>
                                                <Table.Cell>{item.product}</Table.Cell>
                                                <Table.Cell>{item.price}</Table.Cell>
                                                <Table.Cell>{item.quantity}</Table.Cell>
                                                <Table.Cell>{item.size}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                            </Table.Body>
                        </Table>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleClose}>Đóng</Button>
                    </Modal.Actions>
                </Modal>
            )}
    </div>
  )
}

export default Order