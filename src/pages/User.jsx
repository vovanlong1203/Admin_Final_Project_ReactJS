import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Input } from 'semantic-ui-react'
import "../assets/category.css"
import { searchUserAdmin, lockUser as lockUserService } from '../api/service'
import { toast, ToastContainer } from "react-toastify"
import { FaLock, FaLockOpen } from "react-icons/fa"

function User() {

    const [filteredUser, setFilteredUser] = useState([])
    const [searchKeyword, setSearchKeyword] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    const fetchData = async (page = currentPage, limit = itemsPerPage, keyword = searchKeyword) => {
        const response = await searchUserAdmin(keyword, page, limit)
        setFilteredUser(response.items)
        setTotalPages(response.totalPages)
        localStorage.setItem("users", JSON.stringify(response.items))
    }

    const lockUser = async (id) => {
        const response = await lockUserService(id);
        if (response.status === 200) {
            toast.success("Khóa tài khoản thành công!")
            fetchData(currentPage, itemsPerPage, searchKeyword)
        } else {
            toast.error("Khóa thất bại!")
        }
    }

    useEffect(() => {
        fetchData(currentPage, itemsPerPage, searchKeyword)
    }, [currentPage])

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            fetchData(newPage, itemsPerPage, searchKeyword)
        }
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            fetchData(newPage, itemsPerPage, searchKeyword)
        }
    }

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber)
        fetchData(pageNumber, itemsPerPage, searchKeyword)
    }

    const handleSearch = async () => {
        const keyword = searchKeyword.toLowerCase()
        const filtered = await searchUserAdmin(keyword, currentPage, itemsPerPage);
        setFilteredUser(filtered.items)
        setTotalPages(filtered.totalPages)
    }

    const handleSort = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
        setSortColumn(column)
        setSortDirection(direction)
        const sortedData = [...filteredUser].sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1
            return 0
        })
        setFilteredUser(sortedData)
    }

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
        )
    }

    return (
        <div className='main-container'>
            <div className={`main-container`}>
                <center>
                    <h2>Quản lí khách hàng</h2>  
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
                </div>
                <br />
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell onClick={() => handleSort('user_id')}>
                                    ID {sortColumn === 'user_id' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </Table.HeaderCell>
                                <Table.HeaderCell onClick={() => handleSort('full_name')}>
                                    Tên KH {sortColumn === 'full_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </Table.HeaderCell>
                                <Table.HeaderCell onClick={() => handleSort('gender')}>
                                    Giới Tính {sortColumn === 'gender' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </Table.HeaderCell>
                                <Table.HeaderCell onClick={() => handleSort('username')}>
                                    Tên TK {sortColumn === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </Table.HeaderCell>
                                <Table.HeaderCell onClick={() => handleSort('gmail')}>
                                    Email {sortColumn === 'gmail' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </Table.HeaderCell>
                                <Table.HeaderCell >
                                    Loại TK 
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Trạng thái 
                                </Table.HeaderCell>
                                <Table.HeaderCell>Khóa</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {filteredUser.map((item) => (
                                <Table.Row key={item.user_id}>
                                    <Table.Cell>{item.user_id}</Table.Cell>
                                    <Table.Cell className="break-word">{item.full_name}</Table.Cell>
                                    <Table.Cell className="break-word">{item.gender}</Table.Cell>
                                    <Table.Cell className="break-word">{item.username}</Table.Cell>
                                    <Table.Cell className="break-word">{item.gmail}</Table.Cell>
                                    <Table.Cell className="break-word">{item.account_provider}</Table.Cell>
                                    <Table.Cell className="break-word">
                                        {item.is_locked === 0 ? <FaLockOpen /> : <FaLock />}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.is_locked === 0 ? (
                                            <Button color='red' onClick={() => lockUser(item.user_id)}>
                                                <FaLock />
                                            </Button>
                                        ) : (
                                            <span>Đã bị khóa</span>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                <br />
                {renderPaginationButtons()}
            </div>
            <ToastContainer />
        </div>
    )
}

export default User
