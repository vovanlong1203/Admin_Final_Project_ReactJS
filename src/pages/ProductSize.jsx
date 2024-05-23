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
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filteredProductSize, setFilteredProductSize] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [newProductSize, setNewProductSize] = useState({
        product: "",
        quantity: 1,
        size: "",
    })
  const updateFormRef = useRef(null)
  const addFormRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số mục trên mỗi trang

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentProductSize = filteredProductSize.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProductSize.length / itemsPerPage)

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

  const fetchProductSize = async () => {
    try {
        const productSizeData = await getProductSize()
        setProductSize(productSizeData)
        setFilteredProductSize(productSizeData)
      } catch (error) {
        console.log(error)
      }
  }

  const fetchProduct = async () => {
    try {
      const productData = await getProducts()
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

  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase()

    const filtered = productSize.filter((pro) =>
        pro.product.toLowerCase().includes(keyword)    
    )

    setFilteredProductSize(filtered)
  }
  

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2>Product Size List</h2>  
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
                    >Search</Button>
                </div>
                <div className="row">
                    <Button primary onClick={() => setShowAddForm(true)}>Add Product</Button>
                </div>
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
                            currentProductSize.map((item) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell className="break-word">{item.product}</Table.Cell>
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
            <br />
            {renderPaginationButtons()}
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
                    <Button primary type="button" onClick={handleFormAdd}>
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
