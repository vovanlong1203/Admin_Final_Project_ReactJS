import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react'
import { getProductSize, getProducts, getSize, addProductSize } from '../api/service'
import "../assets/category.css"
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
function ProductSize() {

  const [productSize, setProductSize] = useState([])
  const [product, setProduct] = useState([])
  const [size, setSize] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [newProductSize, setNewProductSize] = useState({
        product: "",
        quantity: 1,
        size: "",
    })
  const updateFormRef = useRef(null)
  const addFormRef = useRef(null)

  const fetchProductSize = async () => {
    try {
        const productSizeData = await getProductSize()
        setProductSize(productSizeData)
      } catch (error) {
        console.log(error)
      }
  }

  const fetchProduct = async () => {
    try {
      const productData = await getProducts()
      console.log("product: ", productData)
      setProduct(productData)
    } catch (error) {
      console.log(error)
    }
  }

  const getSizes = async () => {
    try {
      const sizeData = await getSize()
      setSize(sizeData)
    } catch (error) {
      console.log(error)
    }
  }

  const printNewProductSize = () => {
    console.log("data new ", newProductSize)
  }

  const handleFormAdd = async () => {
    try {
        await addProductSize(newProductSize)
        fetchProductSize()
        setShowAddForm(false)
        localStorage.setItem('product_size', JSON.stringify(product));
        toast.success("add item successfully!")
    } catch (error) {
        console.log(error)
    }
  }
 
  useEffect( () => {
    fetchProductSize()
    fetchProduct()
    getSizes()
  }, [])

  

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2>Product Size List</h2>  
            </center>
            <div className="row">
                <Button primary onClick={() => setShowAddForm(true)}>Add Product</Button>
            </div>
            <br />
            <div>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Quantity sold</Table.HeaderCell>
                            <Table.HeaderCell>Size</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            productSize.map((item) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.product}</Table.Cell>
                                        <Table.Cell>{item.quantity}</Table.Cell>
                                        <Table.Cell>{item.quantity_sold}</Table.Cell>
                                        <Table.Cell>{item.size}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </div>

        </div>

        {showAddForm && (
            <div ref={addFormRef} className="add-form-container">
                <center>
                <h2 className="text-center">Add Product size</h2>
                </center>
                <Form onSubmit={handleFormAdd} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Product</label>
                    <Form.Select
                        options={product.map(item => ({
                            key: item.id,
                            value: item.id,
                            text: item.name
                        }))}

                        value={newProductSize.product}
                        onChange={(e , {value}) => {
                            setNewProductSize({
                                ...newProductSize,
                                product: value
                            })
                        }} required
                    >

                    </Form.Select>
                </Form.Field>
                <Form.Field>
                    <label>Quantity</label>
                    <Input
                        type="number"
                        value={newProductSize.quantity}
                        onChange={(e) =>
                            setNewProductSize({
                                ...newProductSize,
                                quantity: e.target.value,
                            })
                        } required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>Size</label>
                    <Form.Select
                    options={size.map(item => ({
                      key: item.id,
                      value:item.id,
                      text: item.description
                    }))}
                    value={newProductSize.size}
                    onChange={(e, { value }) =>
                        setNewProductSize({
                            ...newProductSize,
                            size: value,
                        })
                    } required
                    />
                </Form.Field>                
                <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button primary type="submit" onClick={printNewProductSize}>
                        Add
                    </Button>
                    <Button color='red'onClick={() => setShowAddForm(false)}>
                        Cancel
                    </Button>
                </Form.Field>
                </Form>
            </div>
            )} 
    </div>
  )
}

export default ProductSize
