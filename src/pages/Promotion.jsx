import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input } from 'semantic-ui-react';
import { getPromotions, addPromotion, updatePromotions, deletePromtion } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import '../assets/promotion.css';


function Promotion() {
    const [promotion, setPromotion] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedPromotion, setSelectedPromotion] = useState(null)
    const updateFormRef = useRef(null)
    const addFormRef = useRef(null)


    const fetchPromotion = async () => {
        try {
            const PromotionData = await getPromotions()
            setPromotion(PromotionData)
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchPromotion();
    }, []);

    const [newPromotion, setNewPromotion] = useState({
        name: "",
        description: "",
        is_active: false,
        discount_value: 0,
        start_at: "",
        end_at: ""
      });

    const handleUpdate = (id) => {
        const selected = promotion.find((pro) => pro.id === id)
        console.log("selected: ", selected)
        setSelectedPromotion(selected)
        setShowUpdateForm(true)
    }

    const handleAddFormSubmit = async () => {
        try {
            console.log('Form add submitted')
            await addPromotion(newPromotion)
            fetchPromotion()
            setShowAddForm(false)
            localStorage.setItem('promotions', JSON.stringify(promotion));
            toast.success("add item successfully!")
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
            console.log('Promotion updated successfully!');
    
            // Reset form and hide update form
            setShowUpdateForm(false);
            setSelectedPromotion(null);
            
            const updatedPromotionList = promotion.map(promo => {
                if (promo.id === selectedPromotion.id) {
                    return selectedPromotion;
                }
                return promo;
            });
    
            setPromotion(updatedPromotionList);
            fetchPromotion()
            localStorage.setItem('promotions', JSON.stringify(promotion));
            toast.success("update successfully!")
        } catch(error) {
            console.error('Error updating promotion:', error);
            toast.error(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deletePromtion(id)
            fetchPromotion()
            localStorage.setItem('promotions', JSON.stringify(promotion));
            toast.success("delete successfully!")
        } catch (error) {
            console.log("error: ", error)
            toast.success(error)
        }
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addFormRef.current && !addFormRef.current.contains(event.target)) {
                setShowAddForm(false);
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
                    <h2 className="text-center">Promotion List</h2>
                </center>
                <div className="row">
                    <Button primary onClick={() => setShowAddForm(true)}>Add Promotion</Button>
                </div>
                <br />
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Id</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>Is_active</Table.HeaderCell>
                                <Table.HeaderCell>Discount_value</Table.HeaderCell>
                                <Table.HeaderCell>Start_at</Table.HeaderCell>
                                <Table.HeaderCell>End_at</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {promotion.map((pro) => {
                                return (
                                    <Table.Row key={pro.id}>
                                        <Table.Cell>{pro.id}</Table.Cell>
                                        <Table.Cell>{pro.name}</Table.Cell>
                                        <Table.Cell>{pro.description}</Table.Cell>
                                        <Table.Cell>{pro.is_active ? "True" : "False"}</Table.Cell>
                                        <Table.Cell>{pro.discount_value}</Table.Cell>
                                        <Table.Cell>{new Date(pro.start_at).toISOString().slice(0, 16)}</Table.Cell>
                                        <Table.Cell>{new Date(pro.end_at).toISOString().slice(0, 16)}</Table.Cell>
                                        <Table.Cell>
                                            <Button primary onClick={() => handleUpdate(pro.id)}>
                                                Update
                                            </Button>
                                            <Button color="red" onClick={() => handleDelete(pro.id)}>Delete</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            {showUpdateForm && selectedPromotion && (
                <div ref={updateFormRef} className="update-form-container">
                    <center>
                        <h2 className="text-center">Update Promotion</h2>
                    </center>
                    <Form style={{ width: '400px' }}>
                        <Form.Field>
                            <label>Name</label>
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
                            <label>Description</label>
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
                            <label>Is_active</label>
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
                            <label>Discount value</label>
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
                            <label>Start at</label>
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
                            <label>End at</label>
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
                                Save
                            </Button>
                            <Button color='red' onClick={() => setShowUpdateForm(false)}>
                                Cancel
                            </Button>
                        </Form.Field>
                    </Form>
                </div>
            )}

            {showAddForm && (
            <div ref={addFormRef} className="add-form-container">
                <center>
                <h2 className="text-center">Add Promotion</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Name</label>
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
                    <label>Description</label>
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
                    <label>Is_active</label>
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
                    <label>Discount value</label>
                    <Input
                        type="number"
                        value={newPromotion.discount_value}
                        onChange={(e) =>
                            setNewPromotion({
                                ...newPromotion,
                                discount_value: e.target.value,
                            })
                        }
                    /> required
                </Form.Field>
                <Form.Field>
                    <label>Start at</label>
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
                    <label>End at</label>
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
                    Add
                    </Button>
                    <Button color='red' onClick={() => setShowAddForm(false)}>
                    Cancel
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
