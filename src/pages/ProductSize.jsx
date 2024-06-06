import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react'
import { getProductSize, getProduct, getSize, addProductSize, searchProductSize } from '../api/service'
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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentProductSize = filteredProductSize.slice(indexOfFirstItem, indexOfLastItem)

  const fetchProductSize = async (page = currentPage, limit = itemsPerPage, keyword = searchKeyword) => {
    try {
        const productSizeData = await searchProductSize(keyword, page, limit)
        setProductSize(productSizeData.items)
        setFilteredProductSize(productSizeData.items)
        setTotalPages(productSizeData.totalPages)
        localStorage.setItem("productSize", JSON.stringify(productSizeData.items));
      } catch (error) {
        console.log(error)
      }
  }

  const fetchProduct = async () => {
    try {
      const productData = await getProduct()
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
        toast.success("Thêm thành công!")
    } catch (error) {
        console.log(error)
    }
  }
 
  useEffect( () => {
    fetchProductSize(currentPage,itemsPerPage,searchKeyword)
    fetchProduct()
    getSizes()
  }, [currentPage])

  const handleSearch = async () => {
    const keyword = searchKeyword.toLowerCase()

    const filtered = await searchProductSize(keyword, currentPage, itemsPerPage);
    setFilteredProductSize(filtered.items)
    setTotalPages(filtered.totalPages)
  }
  const goToPreviousPage = () => {
    if (currentPage > 1) {
        const newPage = currentPage - 1
        setCurrentPage(newPage)
        fetchProductSize(newPage, itemsPerPage, searchKeyword)
    }
}

const goToNextPage = () => {
if (currentPage < totalPages) {
  const newPage = currentPage + 1
  setCurrentPage(newPage)
  fetchProductSize(newPage, itemsPerPage, searchKeyword)
}
}

const goToPage = (pageNumber) => {
setCurrentPage(pageNumber)
fetchProductSize(pageNumber, itemsPerPage, searchKeyword)
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
)
}
  

  return (
    <div className='main-container'>
        <div className={`main-container ${showUpdateForm || showAddForm ? 'blur-background' : ''}`}>
            <center>
                <h2>Quản lí số lượng sản phẩm</h2>  
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
                    <Button primary onClick={() => setShowAddForm(true)}>Thêm size sản phẩm</Button>
                </div>
            </div>
            <br />
            <div>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Sản Phẩm</Table.HeaderCell>
                            <Table.HeaderCell>Số lượng </Table.HeaderCell>
                            <Table.HeaderCell>Số lượng bán </Table.HeaderCell>
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
                <h2 className="text-center">Thêm size sản phẩm</h2>
                </center>
                <Form onSubmit={handleFormAdd} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Sản phẩm</label>
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
                    <label>Số lượng</label>
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
                        Thêm 
                    </Button>
                    <Button color='red'onClick={() => setShowAddForm(false)}>
                        Hủy bỏ
                    </Button>
                </Form.Field>
                </Form>
            </div>
            )} 
    </div>
  )
}

export default ProductSize
