import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react';
import { getProducts, getCategory, getSize, getPromotionsValid, addProduct, updateProduct, deleteProduct } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "../assets/category.css"

function Product() {

  const [product, setProduct] = useState([])
  const [size, setSize] = useState([])
  const [categories, setCategories] = useState([]);
  const [promotionValid, setPromotionValid] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
      name: "",
      description: "",
      status: 1,
      price: 0,
      category: "",
      promotion: ""
  });
  const updateFormRef = useRef(null);
  const addFormRef = useRef(null);
  
  const fetchProduct = async () => {
    try {
      const productData = await getProducts()
      console.log("product: ", productData)
      setProduct(productData)
      localStorage.setItem("products", JSON.stringify(productData))
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPromotionValid = async () => {
    try {
      const promotionValidData = await getPromotionsValid()
      setPromotionValid(promotionValidData)
    } catch (error) {
      console.log(error)
    }
  }

  const getCateogries = async () => {
    try {
      const productData = await getCategory()
      console.log("getCateogries: ", productData)

      setCategories(productData)
      localStorage.setItem("categories", JSON.stringify(productData))
    } catch (error) {
      console.log(error)
    }
  }
  const getSizes = async () => {
    try {
      const sizeData = await getSize()
      console.log("getSizes: ", sizeData)
      setSize(sizeData)
      localStorage.setItem("sizes", JSON.stringify(sizeData))
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddFormSubmit = async () => {
    try {
      await addProduct(newProduct)
      fetchProduct()
      setShowAddForm(false)
      localStorage.setItem('products', JSON.stringify(product));
      toast.success("add item successfully!")
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = (id) => {
    const selected = product.find((pro) => pro.id === id);
    const selectedCategory = categories.find((category) => category.name === selected.category);
    const selectedPromotion = promotionValid.find((item) => item.description == selected.promotion);

    const categoryValue = selectedCategory ? selectedCategory.name : selected.category;
    const promotionValue = selectedPromotion ? selectedPromotion.name : selected.promotion;
    setSelectedProduct({
        ...selected,
        category: categoryValue,
        promotion: promotionValue
    });

    setShowUpdateForm(true)
    console.log("selectedProduct: ", selectedProduct)
  };

  const handleFormSubmitUpdate = async () => {
    try {
      
      await updateProduct(selectedProduct)
      fetchProduct()
      setShowUpdateForm(false)
      localStorage.setItem('products', JSON.stringify(product));
      toast.success("add item successfully!")
    } catch(error) {
        console.error('Error updating promotion:', error);
        toast.success(error)
    } 
  }

  const handleDelete = async (id) => {
    try {
        await deleteProduct(id)
        fetchProduct()
        localStorage.setItem('products', JSON.stringify(product));
        toast.success("delete successfully!")
    } catch (error) {
        console.log("error: ", error)
        toast.success(error)
    }
  }

  useEffect(() => {
    fetchProduct()
    getCateogries()
    getSizes()
    fetchPromotionValid()
  },[])

  useEffect(() => {
    console.log("selectedProduct: ", selectedProduct);
}, [selectedProduct]);

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
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Promotion</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                product.map((pro) => {
                  return (
                    <Table.Row key={pro.id}>
                      <Table.Cell>{pro.id}</Table.Cell>
                      <Table.Cell>{pro.name}</Table.Cell>
                      <Table.Cell>{pro.description}</Table.Cell>
                      <Table.Cell>{pro.status == 1 ? "True" : "False"}</Table.Cell>
                      <Table.Cell>{pro.price}</Table.Cell>
                      <Table.Cell>{pro.category}</Table.Cell>
                      <Table.Cell>{pro.promotion}</Table.Cell>
                      <Table.Cell>
                        <Button primary onClick={() => handleUpdate(pro.id)}> Update </Button>
                        <Button color='red' onClick={() =>  handleDelete(pro.id)}> Delete </Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>          
        </div>
      </div>

      {showUpdateForm && selectedProduct && (
        <div ref={updateFormRef} className="update-form-container">
            <center>
                <h2 className="text-center">Update Product</h2>
            </center>
            <Form style={{ width: '400px' }}>
                <Form.Field>
                    <label>Name</label>
                    <Input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) =>
                            setSelectedProduct({
                                ...selectedProduct,
                                name: e.target.value,
                            })
                        } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        type="text"
                        value={selectedProduct.description}
                        onChange={(e) =>
                          setSelectedProduct({
                                ...selectedProduct,
                                description: e.target.value,
                            })
                        } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Status</label>
                    <Form.Select
                    options={[
                        { key: 1, value: true, text: 'True' },
                        { key: 0, value: false, text: 'False' },
                    ]}
                    value={selectedProduct.status == 1 ?  true : false}
                    onChange={(e, { value }) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        status: value,
                        })
                    } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Price</label>
                    <Input
                        type="number"
                        value={selectedProduct.price}
                        onChange={(e) =>
                            setSelectedProduct({
                                ...selectedProduct,
                                price: e.target.value,
                            })
                        } required
                    /> 
                </Form.Field>
<Form.Field>
    <label>Category</label>
    <Form.Select
        options={categories.map(category => ({
            key: category.id,
            value: category.name,
            text: category.name,
        }))}
        value={selectedProduct.category}
        onChange={(e, { value }) => {
            const selectedCategory = categories.find(category => category.name === value);
            
            setSelectedProduct({
                ...selectedProduct,
                category: selectedCategory ? selectedCategory.name : null,
            })
            
        }}
        required
    />
</Form.Field>
<Form.Field>
    <label>Promotion</label>
    <Form.Select
        options={[
            { key: '', value: 'null', text: 'null' }, 
            ...promotionValid.map(promotion => ({
                key: promotion.id,
                value: promotion.name,
                text: promotion.name
            }))
        ]}
        value={selectedProduct.promotion}
        onChange={(e, { value }) => {
            const selectedPromotion = promotionValid.find(promotion => promotion.name === value);
            
            setSelectedProduct({
                ...selectedProduct,
                promotion: selectedPromotion ? selectedPromotion.name : null,
            });
            
        }} 
    />
</Form.Field>
                <Form.Field style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button primary type="button" onClick={handleFormSubmitUpdate}>
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
                <h2 className="text-center">Add Product</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Name</label>
                    <Input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct({
                            ...newProduct,
                            name: e.target.value,
                        })
                    } required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <Input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) =>
                        setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                        })
                    } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Status</label>
                    <Form.Select
                    options={[
                      { key: 1, value: true, text: 'True' },
                      { key: 0, value: false, text: 'False' },
                    ]}
                    value={newProduct.status ? true : false}
                    onChange={(e, { value }) =>
                        setNewProduct({
                            ...newProduct,
                            status: value,
                        })
                    } required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Price</label>
                    <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                            })
                        } required
                    /> 
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Form.Select
                    options={categories.map(category => ({
                      key: category.id,
                      value:category.id,
                      text: category.name
                    }))}
                    value={newProduct.category}
                    onChange={(e, { value }) =>
                        setNewProduct({
                            ...newProduct,
                            category: value,
                        })
                    } required
                    />
                </Form.Field>                
                <Form.Field>
                    <label>Promotion</label>
                    <Form.Select
                    options={[
                        { key: '', value: 'null', text: 'null' }, 
                        ...promotionValid.map(item => ({
                            key: item.id,
                            value: item.id,
                            text: item.name
                        }))
                    ]}
                    value={newProduct.promotion}
                    onChange={(e, { value }) =>
                        setNewProduct({
                            ...newProduct,
                            promotion: value,
                        })
                    } 
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
  )
}

export default Product
