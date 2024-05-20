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
    const [updateStatus, setUpdateStatus] = useState({
        'status' : ''
    })
    const specialStatuses = ['CANCELLED', 'CONFIRMED', 'DELIVERED', 'IN_TRANSIT', 'PACKAGING', 'REFUNDED', 'RETURN_EXCHANGE', 'UNCONFIRMED']
    const items = [
        { name: 'UNCONFIRMED', status: 'UNCONFIRMED' },
        { name: 'CONFIRMED', status: 'CONFIRMED' },
        { name: 'PACKAGING', status: 'PACKAGING' },
        { name: 'IN_TRANSIT', status: 'IN_TRANSIT' },
        { name: 'DELIVERED', status: 'DELIVERED' }
      ];
    const nextStatuses = {
        UNCONFIRMED: ['CONFIRMED'],
        CONFIRMED: ['PACKAGING'],
        PACKAGING: ['IN_TRANSIT'],
        IN_TRANSIT: ['DELIVERED'],
        DELIVERED: ['DELIVERED'],
    };

    const fetchOrder = async () => {
        try {
            const orderData = await getOrder()
            setOrder(orderData)
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

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2 className="text-center">Order List</h2>
            </center>

            <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Id</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Phone_number</Table.HeaderCell>
                    <Table.HeaderCell>Shipping_address</Table.HeaderCell>
                    <Table.HeaderCell>Payment_method</Table.HeaderCell>
                    <Table.HeaderCell>Total_amount</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                <Table.Body>
                    {
                        order.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell>{item.customer}</Table.Cell>
                                    <Table.Cell>{item.phone_number}</Table.Cell>
                                    <Table.Cell>{item.total_amount}</Table.Cell>
                                    <Table.Cell>{item.payment_method}</Table.Cell>
                                    <Table.Cell>{item.shipping_address}</Table.Cell>
                                    <Table.Cell>{item.status}</Table.Cell>
                                    
                                    {/* <Table.Cell>
                                        {nextStatuses[item.status].length > 0 && (
                                            <>
                                            {nextStatuses[item.status].map((status) => (
                                                <button type='button' key={status} onClick={() => handleStatusClick(item.id, status)}>
                                                <li>{status}</li>
                                                </button>
                                            ))}
                                            </>
                                        )}
                                    </Table.Cell> */}
                                    <Table.Cell>
                                        {nextStatuses[item.status].length > 0 &&  nextStatuses[item.status] != item.status ? (
                                            <>
                                            {nextStatuses[item.status].map((status) => (
                                                <button type='button' key={status} onClick={() => handleStatusClick(item.id, status)}>
                                                <span>{status}</span>
                                                </button>
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
        </div>
        <ToastContainer />
    </div>
  )
}

export default Order