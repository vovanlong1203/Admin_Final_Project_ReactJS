import React from 'react'
import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import { AiOutlineGift } from "react-icons/ai"
 import { MdOutlineConfirmationNumber } from "react-icons/md"
 import { BiCategory } from "react-icons/bi"
 import { LuFileInput } from "react-icons/lu"
 import { FaImage } from "react-icons/fa"
 import { Link, NavLink } from 'react-router-dom'
 import { FaUser } from "react-icons/fa"


function Sidebar({openSidebarToggle, OpenSideBar}) {
  return (
    <aside id='sidebar' className={openSidebarToggle ? 'sidebar-responsive' : ''}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3 className='icon_header' /> SHOP
            </div>
            <span className='icon close_icon' onClick={OpenSideBar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <Link to="/home">
                <li className='sidebar-list-item'>
                        <BsGrid1X2Fill className='icon' /> Tổng quan
                </li>
            </Link>
            <Link to="/user">
                <li className='sidebar-list-item'>
                        <FaUser  className='icon'/> Khách hàng
                </li>
            </Link>
            <Link to="/product">
                <li className='sidebar-list-item'>
                        <BsFillArchiveFill className='icon'/> Sản phẩm
                </li>
            </Link>
            <Link to="/promotion">
                <li className='sidebar-list-item'>
                        <MdOutlineConfirmationNumber className='icon'/> Khuyến mãi
                </li>
            </Link>
            <Link to="/category">
                <li className='sidebar-list-item'>
                        <BiCategory className='icon'/> Danh mục
                </li>
            </Link>
            <Link to="/size">
                <li className='sidebar-list-item'>
                        <LuFileInput className='icon'/> Size
                </li>
            </Link>
            <Link to="/quantityProduct">
                <li className='sidebar-list-item'>
                        <BsListCheck className='icon'/> Số lượng sản phẩm
                </li>
            </Link>
            <Link to="/productImage">
                <li className='sidebar-list-item'>
                        <FaImage className='icon'/> Ảnh sản phẩm
                </li>
            </Link>
            <Link to="/voucher">
                <li className='sidebar-list-item'>
                        <AiOutlineGift className='icon'/> Voucher
                </li>
            </Link>
            <Link to="/order">
                <li className='sidebar-list-item'>
                        <BsMenuButtonWideFill className='icon'/> Đơn hàng
                </li>
            </Link>
            <Link to="/statistic">
                <li className='sidebar-list-item'>
                        <BsFillGearFill className='icon'/> Thống kê
                </li>
            </Link>
        </ul>

    </aside>
  )
}

export default Sidebar
