import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input } from 'semantic-ui-react'
import { getVoucher, addVoucher, deleteVoucher} from '../api/service';
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "../assets/category.css"
import { MdOutlineDelete } from "react-icons/md";

function Voucher() {

    const [voucher, setVoucher] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filterVoucher, setFilterVoucher] = useState([])
    const updateFormRef = useRef(null)
    const addFormRef = useRef(null)
    const [newVoucher, setNewVoucher] = useState({
        minimum_purchase_amount: 0,
        usage_count: 0,
        usage_limit: 0,
        voucher_value: 0,
        start_at: "",
        end_at: "",
        code: "",
        discount_type: "",
        voucher_type: "",
        active: 0,
        maxDiscountValue: 0
      });

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage, setItemsPerPage] = useState(10); // Số mục trên mỗi trang

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentVoucher = filterVoucher.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filterVoucher.length / itemsPerPage)

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

    const fecthVoucher = async () => {
        try {
            const voucherData = await getVoucher()
            setVoucher(voucherData)
            setFilterVoucher(voucherData)
        }catch (error) {
            console.log("error: ",error)
        }
    }

    useEffect(() => {
        fecthVoucher();
    }, [])

    const handleAddFormSubmit = async () => {
        try {
            const response = await addVoucher(newVoucher)
            
            if (response.status === 200) {
                fecthVoucher()
                setShowAddForm(false)
                localStorage.setItem('vouchers', voucher);
                toast.success("add voucher successfully!")
            } 
        } catch (error) {
            console.error('Error add voucher:', error);
            toast.success(error)
        }
    }

    const handleDeleteVoucher = async (id) => {
        try {
            const response = await deleteVoucher(id)

            if (response.status === 200) {
                fecthVoucher()
                localStorage.setItem('vouchers', voucher);
                toast.success("add delete successfully!")
            }
        } catch (error) {
            console.error('Error delete voucher:', error);
            toast.success(error)
        }
    }

    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase()

        const filtered = voucher.filter((pro) => 
            pro.code.toLowerCase().includes(keyword) ||
            pro.voucher_type.toLowerCase().includes(keyword) || 
            pro.discount_type.toLowerCase().includes(keyword) ||
            (pro.maxDiscountValue == keyword)
        )

        setFilterVoucher(filtered)
    }

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2 className="text-center">Quản lý voucher</h2>
            </center>  
            <div style={{ display: 'flex' ,justifyContent : 'space-between'}}>
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
                <div className="row">
                    <Button primary onClick={() => setShowAddForm(true)}>Thêm Voucher</Button>
                </div>
            </div>
            <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell >ID</Table.HeaderCell>
                        <Table.HeaderCell className="break-word">Số tiền mua tối thiểu</Table.HeaderCell>
                        <Table.HeaderCell >Số lượng sử dụng</Table.HeaderCell>
                        <Table.HeaderCell >Giới hạn sử dụng</Table.HeaderCell>
                        <Table.HeaderCell className="break-word">Giá trị giảm giá</Table.HeaderCell>
                        <Table.HeaderCell className="break-word">Ngày bắt đầu</Table.HeaderCell>
                        <Table.HeaderCell className="break-word">Ngày kết thúc</Table.HeaderCell>
                        <Table.HeaderCell className="break-word">Code</Table.HeaderCell>
                        <Table.HeaderCell>Thể loại giảm</Table.HeaderCell>
                        <Table.HeaderCell>Thể loại voucher</Table.HeaderCell>
                        <Table.HeaderCell>MaxDiscountValue</Table.HeaderCell>
                        <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                        <Table.HeaderCell>Xóa</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        currentVoucher.map((pro) => {
                            return (
                                <Table.Row key={pro.id}>
                                    <Table.Cell>{pro.id}</Table.Cell>
                                    <Table.Cell>{pro.minimum_purchase_amount}</Table.Cell>
                                    <Table.Cell>{pro.usage_count}</Table.Cell>
                                    <Table.Cell>{pro.usage_limit}</Table.Cell>
                                    <Table.Cell>{pro.voucher_value}</Table.Cell>
                                    <Table.Cell>{new Date(pro.start_at).toISOString().slice(0, 16)}</Table.Cell>
                                    <Table.Cell>{new Date(pro.end_at).toISOString().slice(0, 16)}</Table.Cell>
                                    <Table.Cell>{pro.code}</Table.Cell>
                                    <Table.Cell>{pro.discount_type}</Table.Cell>
                                    <Table.Cell>{pro.voucher_type}</Table.Cell>
                                    <Table.Cell>{pro.maxDiscountValue}</Table.Cell>
                                    <Table.Cell>{pro.active}</Table.Cell>
                                    <Table.Cell>
                                        <Button color='red' onClick={() => handleDelete(pro.id)}><MdOutlineDelete style={{fontSize: '20px'}}/></Button>
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

        {showAddForm && (
            <div ref={addFormRef} className="add-form-container">
                <center>
                <h2 className="text-center">Thêm voucher</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px', height: '600px' }}>
                <Form.Field>
                    <label>Số tiền mua tối thiểu</label>
                    <Input
                    type="number"
                    step="0.1"
                    value={newVoucher.minimum_purchase_amount}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            minimum_purchase_amount: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Số lượng sử dụng</label>
                    <Input
                    type="number"
                    value={newVoucher.usage_count}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            usage_count: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>giới hạn sử dụng</label>
                    <Input
                    type="number"
                    value={newVoucher.usage_limit}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            usage_limit: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>giá trị giảm giá</label>
                    <Input
                    type="number"
                    value={newVoucher.voucher_value}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            voucher_value: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Code</label>
                    <Input
                    type="text"
                    value={newVoucher.code}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            code: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Ngày bắt đầu</label>
                    <Input
                    type="datetime-local"
                    value={newVoucher.start_at ? new Date(newVoucher.start_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            start_at: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Ngày kết thúc</label>
                    <Input
                    type="datetime-local"
                    value={newVoucher.end_at ? new Date(newVoucher.end_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            end_at: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>

                <Form.Field>
                    <label>Thể loại giảm</label>
                    <Form.Select
                    options={[
                        { key: 'AMOUNT', value: 'AMOUNT', text: 'AMOUNT' },
                        { key: 'PERCENTAGE', value: 'PERCENTAGE', text: 'PERCENTAGE' },
                    ]}
                    onChange={(e, { value }) =>
                        setNewVoucher({
                            ...newVoucher,
                            discount_type: value,
                        })
                    } required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>Thể loại voucher</label>
                    <Form.Select
                    options={[
                        { key: 'PURCHASE', value: 'PURCHASE', text: 'PURCHASE' },
                        { key: 'FREE_SHIP', value: 'FREE_SHIP', text: 'FREE_SHIP' },
                    ]}
                    onChange={(e, { value }) =>
                        setNewVoucher({
                            ...newVoucher,
                            voucher_type: value,
                        })
                    } required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>maxDiscountValue</label>
                    <Input
                    type="number"
                    value={newVoucher.maxDiscountValue}
                    onChange={(e) =>
                        setNewVoucher({
                            ...newVoucher,
                            maxDiscountValue: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Trạng thái</label>
                    <Form.Select
                    options={[
                        { key: 0, value: 0, text: 0 },
                        { key: 1, value: 1, text: 1 },
                    ]}
                    onChange={(e, { value }) =>
                        setNewVoucher({
                            ...newVoucher,
                            active: value,
                        })
                    } required
                    /> 
                </Form.Field>

                <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button primary type="submit">
                    Add
                    </Button>
                    <Button color='red' onClick={() => setShowAddForm(false)}>
                    Cancel
                    </Button>
                </Form.Field>
                </Form>
            </div>
            )}
    </div>
  )
}

export default Voucher
