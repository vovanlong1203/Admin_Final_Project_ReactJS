import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Form, Input, Modal, Dropdown, Popup  } from 'semantic-ui-react'
import { getProduct, getCategory, getSize, getPromotionsValid, addProduct, updateProduct, deleteProduct, searchProducts } from '../api/service'
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "../assets/category.css"
import { IoSettingsOutline } from "react-icons/io5"

function Product() {

  const [product, setProduct] = useState([])
  const [size, setSize] = useState([])
  const [categories, setCategories] = useState([]);
  const [promotionValid, setPromotionValid] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filteredProduct, setFilteredProduct] = useState([])
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
  })
  const updateFormRef = useRef(null)
  const addFormRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [openPopup, setOpenPopup] = useState(false)
  const [popupProductId, setPopupProductId] = useState(null)

  const handleActionClick = (id) => {
    setPopupProductId(id)
    setOpenPopup(!openPopup)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentPromotion = filteredProduct.slice(indexOfFirstItem, indexOfLastItem)

  const fetchProduct = async (page = currentPage, limit = itemsPerPage, keyword = searchKeyword) => {
    try {
      const productData = await searchProducts(keyword, page, limit)
      setProduct(productData.items)
      setFilteredProduct(productData.items)
      setTotalPages(productData.totalPages)
      localStorage.setItem("products", JSON.stringify(productData.items))
    } catch (error) {
      console.log(error)
    }
  };

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
      localStorage.setItem('products', JSON.stringify(product))
      toast.success("Thêm mới thành công!")
    } catch (error) {
      console.log(error)
      toast.error("Thêm thất bại!")
    }
  }

  const handleUpdate = (id) => {
    const selected = product.find((pro) => pro.id === id)
    const selectedCategory = categories.find((category) => category.name === selected.category)
    const selectedPromotion = promotionValid.find((item) => item.description == selected.promotion)

    const categoryValue = selectedCategory ? selectedCategory.name : selected.category
    const promotionValue = selectedPromotion ? selectedPromotion.name : selected.promotion
    setSelectedProduct({
        ...selected,
        category: categoryValue,
        promotion: promotionValue
    });
    setOpenPopup(false)
    setShowUpdateForm(true)
    console.log("selectedProduct: ", selectedProduct)
  };

  const handleFormSubmitUpdate = async () => {
    try {
      
      await updateProduct(selectedProduct)
      fetchProduct()
      setShowUpdateForm(false)
      localStorage.setItem('products', JSON.stringify(product))
      toast.success("add item successfully!")
    } catch(error) {
        console.error('Error updating promotion:', error)
        toast.success(error)
    } 
  }

  const handleDelete = async (id) => {
    try {
        await deleteProduct(id)
        fetchProduct()
        localStorage.setItem('products', JSON.stringify(product))
        setOpenPopup(false)
        toast.success("xóa thành công!")
    } catch (error) {
        console.log("error: ", error)
        toast.error(error)
    }
  }

  const handleSearch = async () => {
    try {
      const keyword = searchKeyword.toLowerCase()

      const filtered = await searchProducts(keyword, currentPage, itemsPerPage)
      setFilteredProduct(filtered.items)
      setTotalPages(filtered.totalPages)
    } catch (error) {
      console.log(error);
    }
  };


  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      fetchProduct(newPage, itemsPerPage, searchKeyword)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      fetchProduct(newPage, itemsPerPage, searchKeyword)
    }
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    fetchProduct(pageNumber, itemsPerPage, searchKeyword)
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

  useEffect(() => {
    fetchProduct(currentPage, itemsPerPage,searchKeyword)
    getCateogries()
    getSizes()
    fetchPromotionValid()
  }, [currentPage]);

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
          <h2>Quản lý sản phẩm</h2>  
        </center>
        <div style={{ display: 'flex' ,justifyContent : 'space-between'}}>
          <div style={{marginBottom: '20px'}}>
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

          <div >
            <Button primary onClick={() => setShowAddForm(true)}>Thêm Sản Phẩm</Button>
          </div>
          
        </div>
        <br />
        <div>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Tên SP</Table.HeaderCell>
                <Table.HeaderCell>Mô Tả</Table.HeaderCell>
                <Table.HeaderCell>Trạng Thái</Table.HeaderCell>
                <Table.HeaderCell>Giá</Table.HeaderCell>
                <Table.HeaderCell>Loại</Table.HeaderCell>
                <Table.HeaderCell>Khuyến mãi</Table.HeaderCell>
                <Table.HeaderCell>Hành động</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

            <Table.Body>
              {
                filteredProduct.map((pro) => {
                  return (
                    <Table.Row key={pro.id}>
                      <Table.Cell>{pro.id}</Table.Cell>
                      <Table.Cell className="break-word">{pro.name}</Table.Cell>
                      <Table.Cell className="break-word">{pro.description}</Table.Cell>
                      <Table.Cell>{pro.status == 1 ? "Hiển thị" : "Ko hiển thị"}</Table.Cell>
                      <Table.Cell>{pro.price}</Table.Cell>
                      <Table.Cell>{pro.category}</Table.Cell>
                      <Table.Cell>{pro.promotion}</Table.Cell>
                      <Table.Cell>
                        <Popup
                            trigger={<Button color='orange' onClick={() => handleActionClick(pro.id)}> <IoSettingsOutline /> Hành động</Button>}
                            content={
                              <div>
                                <Button primary onClick={() => handleUpdate(pro.id)}>Cập nhật</Button>
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
                  )
                })
              }
            </Table.Body>
          </Table>          
        </div>
        <br />
        {renderPaginationButtons()}
      </div>

      {showUpdateForm && selectedProduct && (
        <div ref={updateFormRef} className="update-form-container">
            <center>
                <h2 className="text-center">Cập nhật sản phẩm</h2>
            </center>
            <Form style={{ width: '400px' }}>
                <Form.Field>
                    <label>Tên SP</label>
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
                    <label>Mô tả</label>
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
                    <label>Trạng thái</label>
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
                    <label>Giá </label>
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
                    <label>Loại</label>
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
                    <label>Khuyễn mãi</label>
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
                <h2 className="text-center">Thêm sản phẩm</h2>
                </center>
                <Form onSubmit={handleAddFormSubmit} style={{ width: '400px' }}>
                <Form.Field>
                    <label>Tên SP</label>
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
                    <label>Mô tả</label>
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
                    <label>Trạng thái</label>
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
                    <label>Giá</label>
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
                    <label>Loại</label>
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
                    <label>Khuyến mãi</label>
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

export default Product


