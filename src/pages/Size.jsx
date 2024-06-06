import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Popup } from 'semantic-ui-react'
import { getSize, addSize, updateSize, deleteSize } from '../api/service';
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "../assets/category.css"
import { IoSettingsOutline } from "react-icons/io5"
import { MdDelete } from "react-icons/md";

function Size() {
    const [categories, setCategories] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });
    const updateFormRef = useRef(null)
    const addFormRef = useRef(null)

    const [openPopup, setOpenPopup] = useState(false)
    const [popupProductId, setPopupProductId] = useState(null)
    
    const handleActionClick = (id) => {
        setPopupProductId(id)
        setOpenPopup(!openPopup)
      }

    const fetchSize = async () => {
        try {
            const categoryData = await getSize()
            setCategories(categoryData)
            console.log(categoryData)
        } catch (error) {
            console.log(error)
        }
    };

    const handleAddFormSubmit = async () => {
        try {
            console.log('Form add submitted')
            await addSize(newCategory)
            fetchSize()
            setShowAddForm(false)
            localStorage.setItem('sizes', JSON.stringify(categories))
            toast.success("Thêm thành công!")
        } catch(error) {
            console.error('Error updating promotion:', error)
            toast.success(error)
        }  
    }

    const handleUpdate = (id) => {
        try {
            const selected = categories.find((item) => item.id === id)
            setSelectedCategory(selected)
            setShowUpdateForm(true)
            setOpenPopup(false)
        } catch (e) {
            console.error('Error :', error)
            toast.success(error)
        }
    }

    const handleUpdateSubmit = async () => {
        try {
            const data = {
                "name" : selectedCategory.name,
                "description" : selectedCategory.description
            }

            await updateSize(selectedCategory.id, data)
            setShowUpdateForm(false);
            setSelectedCategory(null);

            fetchSize()
            localStorage.setItem('sizes', JSON.stringify(categories))
            toast.success("Cập nhật thành công!")
        } catch (e) {
            console.error('Error updating category:', error)
            toast.success(error)            
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteSize(id)
            fetchSize()
            localStorage.setItem('sizes', JSON.stringify(categories))
            toast.success("Xóa thành công!")
            setOpenPopup(false)
        } catch (error) {
            console.log("error: ", error)
            toast.success(error)
        }
    }
    useEffect(() => {
        fetchSize();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addFormRef.current && !addFormRef.current.contains(event.target)) {
                setShowAddForm(false);
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
                    <h2 className="text-center">Quản li size</h2>
                </center>
                <div className="row">
                    <Button primary onClick={() => setShowAddForm(true)}>Add Size</Button>
                </div>
                <br />
                <div className="row">
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Id</Table.HeaderCell>
                                <Table.HeaderCell>Tên</Table.HeaderCell>
                                <Table.HeaderCell>Mô tả</Table.HeaderCell>
                                <Table.HeaderCell>Hành động</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {categories.map((category) => (
                                <Table.Row key={category.id}>
                                    <Table.Cell>{category.id}</Table.Cell>
                                    <Table.Cell>{category.name}</Table.Cell>
                                    <Table.Cell>{category.description}</Table.Cell>
                                    <Table.Cell>
                                    <Popup
                                        trigger={<Button color='orange' onClick={() => handleActionClick(category.id)}> <IoSettingsOutline /> Hành động</Button>}
                                        content={
                                            <div>
                                                <Button primary onClick={() => handleUpdate(category.id)}>Cập nhật</Button>
                                                <Button color='red' onClick={() => handleDelete(category.id)}>Xóa</Button>
                                            </div>
                                            }
                                            on='click'
                                            open={popupProductId === category.id && openPopup}
                                            onClose={() => setOpenPopup(false)}
                                            position='bottom left'
                                    />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            {showUpdateForm && selectedCategory && (
                <div ref={updateFormRef} className="update-form-container">
                    <center>
                        <h2 className="text-center">Cập nhật size</h2>
                    </center>
                    <Form onSubmit={() => handleUpdateSubmit()} style={{ width: '400px' }}>
                        <Form.Field>
                            <label>Tên</label>
                            <Input
                                type="text"
                                value={selectedCategory.name}
                                onChange={(e) =>
                                    setSelectedCategory({
                                        ...selectedCategory,
                                        name: e.target.value,
                                    })
                                } required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Mô tả</label>
                            <Input
                                type="text"
                                value={selectedCategory.description}
                                onChange={(e) =>
                                    setSelectedCategory({
                                        ...selectedCategory,
                                        description: e.target.value,
                                    })
                                } required
                            />
                        </Form.Field>
                        <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button primary type="submit" >
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
                <h2 className="text-center">Thêm Size</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Tên</label>
                    <Input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                        setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Mô tả</label>
                    <Input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) =>
                        setNewCategory({
                            ...newCategory,
                            description: e.target.value,
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
    )
}

export default Size
