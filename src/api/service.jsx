import axios from 'axios';

const URL = "https://deploy-api-s8u1.onrender.com"
export const url_web = "https://deploy-api-s8u1.onrender.com"

// const token = localStorage.getItem('accessToken')
/* api login */
 export const login = async (data) => {
  try {
    const response = await axios.post(`${URL}/admin/login`, data);
    localStorage.setItem("accessToken", response.data.access_token)
    console.log("accessToken: ", response.data.access_token)
    return response.data; 
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
 }

/*end api login */

/* api user */

export const get_all_user = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/user`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
    throw error;
  }
};

/*end api user */


/* api promotion */

export const getPromotions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${URL}/api/promotion`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
      }
      }); 
      return response.data;
    } catch (error) {
      console.error(error);
      console.log("error: ", error)
      throw error;
    }
  };

  export const getPromotionsValid = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${URL}/api/promotion/valid`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
      }
      }); 
      return response.data;
    } catch (error) {
      console.error(error);
      console.log("error: ", error)
      throw error;
    }
  };

export const updatePromotions = async (promotionId, data) => {
    console.info("data send server: ", data)

    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`${URL}/api/promotion/${promotionId}`, data, {
          headers: {
            'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
        }
        })
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const addPromotion = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/promotion`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const deletePromtion = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/promotion/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api promotion */

/*  api category */
export const getCategory = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/category`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
};

export const addCategory = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/admin/category`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateCateogry = async (categoryId, data) => {
    console.info("data send server: ", data)
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`${URL}/api/admin/category/${categoryId}`, data, {
          headers: {
            'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
        }
        })
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/admin/category/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api category */

/*  api size */
export const getSize = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/size`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
};

export const addSize = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/size`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateSize = async (sizeId, data) => {
    console.info("data send server: ", data)
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`${URL}/api/size/${sizeId}`, data, {
          headers: {
            'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
        }
        })
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const deleteSize = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/size/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api size */

/*  api product */
export const getProducts = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/product`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const addProduct = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/admin/product`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateProduct = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${URL}/api/admin/product`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/admin/product/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    }); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}
/* End api product */

/*  api product size */
export const getProductSize = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/product_size/admin`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const addProductSize = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/product_size/admin`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api product size */

/*  api product image */
export const getProductImage = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/product_image`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
   
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

// export const addProductImage = async (data) => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     const response = await axios.post(`${URL}/api/admin/product_image`, data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
//     }
//     })
   
//     return response.data
//   } catch (error) {
//     console.log("error: ", error)
//   }
// }

export const deleteProductImage = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/admin/product_image/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response
  } catch (error) {
    console.log(error);
  }
}

/* End api product image */


/*  api voucher */

export const getVoucher = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/voucher`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })

    return response.data
  } catch (error) {
    console.log(error);
  }
}


export const addVoucher = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${URL}/api/admin/voucher`, data, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response
  } catch (error) {
    console.log(error);
  }
}

export const deleteVoucher = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${URL}/api/admin/voucher/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response
  } catch (error) {
    console.log(error);
  }
}

/* End api voucher */

/*  api order */
export const getOrder = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log(error);
  }
}


export const updateStatusOrder = async (id, data) => {
  console.info("data send server: ", data)

  try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`${URL}/api/admin/orders/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
      }
      })
      console.info("result data: ", response)    
      return response
  } catch (error) {
      console.log("error: ", error)
      throw error;
  }
}

export const revenueStatisticYear = async (year) => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get(`${URL}/api/admin/orders/revenue?year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
    throw error;
  }
}

export const getStatusOrder = async (year) => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get(`${URL}/api/admin/orders/status?year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
    throw error;
  }
}

export const getYearOrder = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get(`${URL}/api/admin/orders/year`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
    throw error;
  }
}

/* End api order */
