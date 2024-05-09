import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react';
import "../assets/category.css"
import { getProducts, getProductImage } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { url_web } from '../api/service'
import axios from 'axios';


function ProductImage() {

    const [iamgeProduct, setImageProduct ] = useState([])
    const [product, setProduct] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const updateFormRef = useRef(null);
    const addFormRef = useRef(null);
    const [productId, setProductId] = useState('');
    const [images, setImages] = useState('');

    const formData = new FormData();

    const fetchData = async () => {
        try {
            const response = await getProductImage()
            setImageProduct(response)
            
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProduct = async () => {
        try {
            const response = await getProducts()
            setProduct(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const data = {
          product: productId,
          urls: images,
        };
        const formData = new FormData()
        formData.append('product', productId);
        formData.append('urls', images);
        const token = localStorage.getItem('accessToken');
      
        try {
          const response = await axios.post(`${url_web}/api/product_image/admin`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200) {
            console.log('Successfully uploaded image:', response.data);
            fetchData();
            setShowAddForm(false);
            localStorage.setItem('productImage', (iamgeProduct));
            toast.success('add item successfully!');
          } else {
            console.error('Error Found:', response.data);
            toast.error('add item successfully!');
          }
        } catch (error) {
          console.error('Error adding product image:', error);
          toast.error('Error adding product image!');
        }
      };

    const handleProductChange = (event) => {
        setProductId(event.target.value);
      };

    const handleImageChange = (event) => {
        setImages(event.target.files[0]);
      };

    useEffect (() => {
        fetchData()
        fetchProduct()
    },[])
    return (
        <div className='main-container'>
            <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
                <center>
                    <h2>Product list</h2>  
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
                            <Table.HeaderCell>Url</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {
                        iamgeProduct.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell>{item.product}</Table.Cell>
                                    <Table.Cell>{item.url}</Table.Cell>
                                    <Table.Cell>
                                        <Button primary > Update </Button>
                                        <Button color='red'> Delete </Button>
                                    </Table.Cell>
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
                <h2 className="text-center">Add Size</h2>
                </center>
                <Form onSubmit={handleSubmit} style={{ width: '400px' }} encType="multipart/form-data">
                <Form.Field>
                    <label>Product</label>
                    <Form.Select
                        options={product.map(item => ({
                            key: item.id,
                            value: item.id,
                            text: item.name
                        }))}
                        onChange={(e, { value }) => {
                            setProductId(value)
                        }}
                        required
                    />
                </Form.Field>
                {/* <Form.Field>
                    <label>URL</label>
                    <Input
                        type="file"
                        name="urls"
                        
                        onChange={(e) => {
                            setImages(e.target.value)
                        }} 
                    />
                </Form.Field> */}
                <Form.Field>
                <label>URL</label>
                <Input
                    type="file"
                    name="urls"
                    onChange={(e) => {
                    handleImageChange(e)
                    }}
                />
                </Form.Field>

                <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button primary type="submit" onClick={handleSubmit}>
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
    )
}

export default ProductImage
