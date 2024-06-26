import axios from 'axios';

const URL = "http://192.168.1.20:5000"
export const url_web = "http://192.168.1.20:5000"

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

export const searchUserAdmin = async (keyword, page, limit) => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get(`${URL}/api/admin/users?keyword=${keyword}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.error(error)
    console.log("error: ", error)
    throw error
  }
}

export const lockUser = async (id) => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.put(`${URL}/api/admin/users/${id}`, null , {
      headers: {
        'Authorization': `Bearer ${token}` 
    }
    })
    return response
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
    throw error;
  }
}

export const getCountUser = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/users/count`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

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


export const getCountCategory = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/category/count`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add JWT token to Authorization header
    }
    })
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}


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

export const getProduct = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/product`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

// export const getProducts = async (page, limit) => {
//   const token = localStorage.getItem('accessToken');
//   try {
//     const response = await axios.get(`${URL}/api/admin/products?page=${page}&limit=${limit}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log("error: ", error);
//     throw error; 
//   }
// };

export const searchProducts = async (keyword, page, limit) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/search_products_admin?keyword=${keyword}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

export const getCountProduct = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/product/count`, {
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

export const searchProductSize = async (keyword, page, limit) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/product_size/admin/search-product-size-admin?keyword=${keyword}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

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

export const searchProductImage = async (keyword, page, limit) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/search-image-admin?keyword=${keyword}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

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

export const searchOrder = async (keyword, page, limit) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/search_orders_admin?keyword=${keyword}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

export const getOrderByMonthYear = async (month, year) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/get-order-month-year?month=${month}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
}

export const getOrderStatusByMonthYear = async (month, year) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${URL}/api/admin/get-status-month-year?month=${month}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error; 
  }
};

export const getCountOrder = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${URL}/api/admin/orders/count`, {
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

export const getOrderItemDetail = async (id) => {
  try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${URL}/api/admin/order-items/${id}`, {
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
