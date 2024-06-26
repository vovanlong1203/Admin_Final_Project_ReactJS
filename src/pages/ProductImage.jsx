import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react';
import "../assets/category.css"
import { getProduct, getProductImage, deleteProductImage, searchProductImage } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify"
import { url_web } from '../api/service'
import axios from 'axios'
import { MdOutlineDelete } from "react-icons/md";

function ProductImage() {

    const [iamgeProduct, setImageProduct ] = useState([])
    const [product, setProduct] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredProductImage, setFilteredProductImage] = useState([])
    const updateFormRef = useRef(null)
    const addFormRef = useRef(null)
    const [productId, setProductId] = useState('')
    const [images, setImages] = useState('')
    
    
    const formData = new FormData()

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) 
    const [totalPages, setTotalPages] = useState(0)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentProductImage = filteredProductImage.slice(indexOfFirstItem, indexOfLastItem)

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchData(newPage, itemsPerPage, searchKeyword)
          }
    };


    const goToNextPage = () => {
        if (currentPage < totalPages) {
          const newPage = currentPage + 1
          setCurrentPage(newPage)
          fetchData(newPage, itemsPerPage, searchKeyword)
        }
      };

      const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber)
        fetchData(pageNumber, itemsPerPage, searchKeyword)
      };

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

    const fetchData = async (page = currentPage, limit = itemsPerPage, keyword = searchKeyword) => {
        try {
            const response = await searchProductImage(keyword, page, limit)
            setImageProduct(response)
            setFilteredProductImage(response.items)
            setTotalPages(response.totalPages)
            localStorage.setItem("productImages", JSON.stringify(response.items))
            
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProduct = async () => {
        try {
            const response = await getProduct()
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
        formData.append('product', productId)
        formData.append('urls', images)
        const token = localStorage.getItem('accessToken')
      
        try {
          const response = await axios.post(`${url_web}/api/admin/product_image`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200) {
            console.log('Successfully uploaded image:', response.data)
            fetchData()
            setShowAddForm(false)
            localStorage.setItem('productImage', JSON.stringify(iamgeProduct))
            toast.success('thêm ảnh thành công!')
          } else {
            console.error('Error Found:', response.data)
            toast.error('thêm ảnh thất bại!')
          }
        } catch (error) {
          console.error('Error adding product image:', error)
          toast.error('lỗi thêm ảnh!')
        }
      }

    const handleDelete = async (id) => {
        try {
            await deleteProductImage(id)
            fetchData()
            localStorage.setItem('productImage', JSON.stringify(promotion))
            toast.success("Xóa thành công!")
        } catch (error) {
            console.log("error: ", error)
            toast.error(error)
        }
    }

    const handleProductChange = (event) => {
        setProductId(event.target.value);
      };

    const handleImageChange = (event) => {
        setImages(event.target.files[0]);
      };

    const handleSearch = async () => {
        const keyword = searchKeyword.toLowerCase()
        const filtered = await searchProductImage(keyword, currentPage, itemsPerPage);
        setFilteredProductImage(filtered.items)
        setTotalPages(filtered.totalPages)
    }

    useEffect (() => {
        fetchData(currentPage,itemsPerPage,searchKeyword)
        fetchProduct()
    },[currentPage])
    return (
        <div className='main-container'>
            <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
                <center>
                    <h2>Quản lý ảnh sản phẩm</h2>  
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
                        <Button primary onClick={() => setShowAddForm(true)}>Thêm ảnh</Button>
                    </div>
                </div>
                <br />
                <div>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Ảnh</Table.HeaderCell>
                            <Table.HeaderCell>Sản phẩm</Table.HeaderCell>
                            <Table.HeaderCell>Link</Table.HeaderCell>
                            <Table.HeaderCell>Xóa</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {
                        filteredProductImage.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell className="break-word">
                                        <img src={item.url} alt={item.product} style={{ width: '50px', height: '50px' }} />
                                    </Table.Cell>
                                    <Table.Cell className="break-word">{item.product}</Table.Cell>
                                    <Table.Cell className="break-word">{item.url}</Table.Cell>
                                    <Table.Cell>
                                        <Button color='red' onClick={() => handleDelete(item.id)}><MdOutlineDelete style={{fontSize: '20px'}}/></Button>
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
                <h2 className="text-center">Thêm ảnh</h2>
                </center>
                <Form onSubmit={handleSubmit} style={{ width: '400px' }} encType="multipart/form-data">
                <Form.Field>
                    <label>Sản phẩm</label>
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

export default ProductImage
