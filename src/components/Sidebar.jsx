import React from 'react'
import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import { BsFillMegaphoneFill } from "react-icons/bs";
 import { Link, NavLink } from 'react-router-dom'


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
                        <BsGrid1X2Fill className='icon' /> Dashboard
                </li>
            </Link>
            <Link to="/product">
                <li className='sidebar-list-item'>
                        <BsFillArchiveFill className='icon'/> Products
                </li>
            </Link>
            <Link to="/promotion">
                <li className='sidebar-list-item'>
                        <BsFillMegaphoneFill className='icon'/> Promotion
                </li>
            </Link>
            <Link to="/category">
                <li className='sidebar-list-item'>
                        <BsFillGrid3X3GapFill className='icon'/> Categories
                </li>
            </Link>
            <Link to="/size">
                <li className='sidebar-list-item'>
                        <BsPeopleFill className='icon'/> Size
                </li>
            </Link>
            <Link to="/quantityProduct">
                <li className='sidebar-list-item'>
                        <BsListCheck className='icon'/> Quantity Product
                </li>
            </Link>
            <Link to="/login">
                <li className='sidebar-list-item'>
                        <BsMenuButtonWideFill className='icon'/> Reports
                </li>
            </Link>
            <Link href="">
                <li className='sidebar-list-item'>
                        <BsFillGearFill className='icon'/> Setting
                </li>
            </Link>
        </ul>

    </aside>
  )
}

export default Sidebar
