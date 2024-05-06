import React from 'react'
import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Form, Input, Tab } from 'semantic-ui-react';
import "../assets/category.css"
import { getProducts } from '../api/service';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function ProductImage() {

    const [iamgeProduct, setImageProduct ] = useState([])
    const [product, setProduct] = useState([])
    const updateFormRef = useRef(null);
    const addFormRef = useRef(null);

    return (
        <div className='main-container'>
        
        </div>
    )
}

export default ProductImage
