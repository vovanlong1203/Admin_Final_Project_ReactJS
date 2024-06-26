import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Popup } from 'semantic-ui-react';
import { getPromotions, addPromotion, updatePromotions, deletePromtion } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import '../assets/promotion.css';
import { IoSettingsOutline } from "react-icons/io5";

function Promotion() {
    const [promotion, setPromotion] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredPromotion, setFilteredPromotion] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedPromotion, setSelectedPromotion] = useState(null)
    const updateFormRef = useRef(null)
    const addFormRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) 

    const [openPopup, setOpenPopup] = useState(false)
    const [popupProductId, setPopupProductId] = useState(null)
    
    const handleActionClick = (id) => {
        setPopupProductId(id)
        setOpenPopup(!openPopup)
      }

      
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentPromotion = filteredPromotion.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredPromotion.length / itemsPerPage)

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
    }

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
    }

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber)
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

    const fetchPromotion = async () => {
        try {
            const PromotionData = await getPromotions()
            setPromotion(PromotionData)
            setFilteredPromotion(PromotionData)
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchPromotion()
    }, [])

    const [newPromotion, setNewPromotion] = useState({
        name: "",
        description: "",
        is_active: false,
        discount_value: 0,
        start_at: "",
        end_at: ""
      })

    const handleUpdate = (id) => {
        const selected = promotion.find((pro) => pro.id === id)
        console.log("selected: ", selected)
        setSelectedPromotion(selected)
        setShowUpdateForm(true)
        setOpenPopup(false)
    }

    const handleAddFormSubmit = async () => {
        try {
            console.log('Form add submitted')
            await addPromotion(newPromotion)
            fetchPromotion()
            setShowAddForm(false)
            localStorage.setItem('promotions', JSON.stringify(promotion));
            toast.success("Thêm thành công!")
        } catch(error) {
            console.error('Error updating promotion:', error);
            toast.success(error)
        }  
    }

    const handleUpdateFormSubmit = async () => {
        try {
            const data = {
                name: selectedPromotion.name,
                description: selectedPromotion.description,
                is_active: selectedPromotion.is_active,
                discount_value: selectedPromotion.discount_value,
                start_at: selectedPromotion.start_at,
                end_at: selectedPromotion.end_at,
            }
    
            console.info("data : ", data)
            console.info("selectedPromotion.id: ", selectedPromotion.id)
            await updatePromotions(selectedPromotion.id, data)
            console.log('Promotion updated successfully!')
    
            setShowUpdateForm(false);
            setSelectedPromotion(null);
            
            const updatedPromotionList = promotion.map(promo => {
                if (promo.id === selectedPromotion.id) {
                    return selectedPromotion
                }
                return promo
            });
    
            setPromotion(updatedPromotionList);
            fetchPromotion()
            localStorage.setItem('promotions', JSON.stringify(promotion));
            toast.success("cập nhật thành công!")
        } catch(error) {
            console.error('Error updating promotion:', error);
            toast.error(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deletePromtion(id)
            fetchPromotion()
            localStorage.setItem('promotions', JSON.stringify(promotion))
            setOpenPopup(false)
            toast.success("xóa thành công!")
        } catch (error) {
            console.log("error: ", error)
            toast.success(error)
        }
    }

    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase()
        const filtered = promotion.filter((pro) =>
            pro.name.toLowerCase().includes(keyword) ||
            pro.description.toLowerCase().includes(keyword)
        );
        setFilteredPromotion(filtered)
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addFormRef.current && !addFormRef.current.contains(event.target)) {
                setShowAddForm(false)
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (updateFormRef.current && !updateFormRef.current.contains(event.target)) {
                setShowUpdateForm(false)
                setSelectedPromotion(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className='main-container'>
            <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
                <center>
                    <h2 className="text-center">Quản lý khuyến mãi</h2>
                </center>
                <br />
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
                        >Tim kiếm</Button>
                    </div>

                    <div className="row">
                        <Button primary onClick={() => setShowAddForm(true)}>Thêm khuyến mãi</Button>
                    </div>
                </div>
                <br />
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Tên khuyến mãi</Table.HeaderCell>
                                <Table.HeaderCell>Mô tả</Table.HeaderCell>
                                <Table.HeaderCell>Hoạt động</Table.HeaderCell>
                                <Table.HeaderCell>Giảm giá</Table.HeaderCell>
                                <Table.HeaderCell>Ngày bắt đầu </Table.HeaderCell>
                                <Table.HeaderCell>Ngày kết thúc</Table.HeaderCell>
                                <Table.HeaderCell>Hành động</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {currentPromotion.map((pro) => {
                                return (
                                    <Table.Row key={pro.id}>
                                        <Table.Cell>{pro.id}</Table.Cell>
                                        <Table.Cell className="break-word">{pro.name}</Table.Cell>
                                        <Table.Cell className="break-word">{pro.description}</Table.Cell>
                                        <Table.Cell>{pro.is_active ? "Hiển thi" : "Không hiển thị"}</Table.Cell>
                                        <Table.Cell>{pro.discount_value}</Table.Cell>
                                        <Table.Cell>{new Date(pro.start_at).toISOString().slice(0, 16)}</Table.Cell>
                                        <Table.Cell>{new Date(pro.end_at).toISOString().slice(0, 16)}</Table.Cell>
                                        <Table.Cell>
                                        <Popup
                                            trigger={<Button color='orange' onClick={() => handleActionClick(pro.id)}> <IoSettingsOutline /> Action</Button>}
                                            content={
                                                <div>
                                                  <Button primary onClick={() => handleUpdate(pro.id)}>Cập nhật </Button>
                                                  <Button color='red' onClick={() => handleDelete(pro.id)}>Xóa</Button>
                                                </div>
                                              }
                                              on='click'
                                              open={popupProductId === pro.id && openPopup}
                                              onClose={() => setOpenPopup(false)}
                                              position='bottom left'
                                        />
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </div>
                <br />
                {renderPaginationButtons()}
            </div>

            {showUpdateForm && selectedPromotion && (
                <div ref={updateFormRef} className="update-form-container">
                    <center>
                        <h2 className="text-center">Cập nhật khuyến mãi</h2>
                    </center>
                    <Form style={{ width: '400px' }}>
                        <Form.Field>
                            <label>Tên khuyễn mãi</label>
                            <Input
                                type="text"
                                value={selectedPromotion.name}
                                onChange={(e) =>
                                    setSelectedPromotion({
                                        ...selectedPromotion,
                                        name: e.target.value,
                                    })
                                } required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Mô tả</label>
                            <Input
                                type="text"
                                value={selectedPromotion.description}
                                onChange={(e) =>
                                    setSelectedPromotion({
                                        ...selectedPromotion,
                                        description: e.target.value,
                                    })
                                } required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Trạng thái</label>
                            <Form.Select
                            options={[
                                { key: 1, value: true, text: 'True' },
                                { key: 0, value: false, text: 'False' },
                            ]}
                            value={selectedPromotion.is_active ?  true : false}
                            onChange={(e, { value }) =>
                                setSelectedPromotion({
                                ...selectedPromotion,
                                is_active: value,
                                })
                            } required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Giảm giá</label>
                            <Input
                                type="number"
                                value={selectedPromotion.discount_value}
                                onChange={(e) =>
                                    setSelectedPromotion({
                                        ...selectedPromotion,
                                        discount_value: e.target.value,
                                    })
                                } required
                            /> 
                        </Form.Field>
                        <Form.Field>
                            <label>Ngày bắt đầu</label>
                            <input
                                type="datetime-local"
                                value={selectedPromotion.start_at ? new Date(selectedPromotion.start_at).toISOString().slice(0, 16) : ''}
                                onChange={(e) =>
                                    setSelectedPromotion({
                                        ...selectedPromotion,
                                        start_at: e.target.value,
                                    })
                                }
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Ngày kết thúc</label>
                            <input
                                type="datetime-local"
                                value={selectedPromotion.end_at ? new Date(selectedPromotion.end_at).toISOString().slice(0, 16) : ''}
                                onChange={(e) =>
                                    setSelectedPromotion({
                                        ...selectedPromotion,
                                        end_at: e.target.value,
                                    })
                                }
                            />
                        </Form.Field>
                        <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button primary type="button" onClick={handleUpdateFormSubmit}>
                                Cập nhật
                            </Button>
                            <Button color='red' onClick={() => setShowUpdateForm(false)}>
                                Hủy bỏ
                            </Button>
                        </Form.Field>
                    </Form>
                </div>
            )}

            {showAddForm && (
            <div ref={addFormRef} className="add-form-container">
                <center>
                <h2 className="text-center">Thêm khuyến mãi</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Tên khuyến mãi</label>
                    <Input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) =>
                        setNewPromotion({
                            ...newPromotion,
                            name: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Mô tả</label>
                    <Input
                    type="text"
                    value={newPromotion.description}
                    onChange={(e) =>
                        setNewPromotion({
                            ...newPromotion,
                            description: e.target.value,
                        })
                    } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Trạng thái</label>
                    <Form.Select
                    options={[
                        { key: 1, value: true, text: 'True' },
                        { key: 0, value: false, text: 'False' },
                    ]}
                    value={newPromotion.is_active ?  true : false}
                    onChange={(e, { value }) =>
                        setNewPromotion({
                            ...newPromotion,
                            is_active: value,
                        })
                    } required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>Giảm giá</label>
                    <Input
                        type="number"
                        value={newPromotion.discount_value}
                        onChange={(e) =>
                            setNewPromotion({
                                ...newPromotion,
                                discount_value: e.target.value,
                            })
                        }
                        required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>Ngày bắt đầu</label>
                    <input
                        type="datetime-local"
                        value={newPromotion.start_at ? new Date(newPromotion.start_at).toISOString().slice(0, 16) : ''}
                        onChange={(e) =>
                            setNewPromotion({
                                ...newPromotion,
                                start_at: e.target.value,
                            })
                        } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Ngày kết thúc</label>
                    <input
                        type="datetime-local"
                        value={newPromotion.end_at ? new Date(newPromotion.end_at).toISOString().slice(0, 16) : ''}
                        onChange={(e) =>
                            setNewPromotion({
                                ...newPromotion,
                                end_at: e.target.value,
                            })
                        } required
                    /> 
                </Form.Field>

                <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button primary type="submit">
                    Thêm
                    </Button>
                    <Button color='red' onClick={() => setShowAddForm(false)}>
                    Hủy bỏ
                    </Button>
                </Form.Field>
                </Form>
            </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Promotion;
