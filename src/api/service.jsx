import axios from 'axios';

const URL = "http://192.168.1.22:5000"

/* api login */
 export const login = async (data) => {
  try {
    const response = await axios.post(`${URL}/admin/login`, data);
    return response.data; 
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
 }

/*end api login */


/* api promotion */

export const getPromotions = async () => {
    try {
      const response = await axios.get(`${URL}/api/promotion`); 
      return response.data;
    } catch (error) {
      console.error(error);
      console.log("error: ", error)
      throw error;
    }
  };

  export const getPromotionsValid = async () => {
    try {
      const response = await axios.get(`${URL}/api/promotion/valid`); 
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
        const response = await axios.put(`${URL}/api/promotion/${promotionId}`, data)
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const addPromotion = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/promotion`, data); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const deletePromtion = async (id) => {
  try {
    const response = await axios.delete(`${URL}/api/promotion/${id}`); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api promotion */

/*  api category */
export const getCategory = async () => {
  try {
    const response = await axios.get(`${URL}/api/category`); 
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
};

export const addCategory = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/category`, data); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateCateogry = async (categoryId, data) => {
    console.info("data send server: ", data)
    try {
        const response = await axios.put(`${URL}/api/category/${categoryId}`, data)
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${URL}/api/category/${id}`); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api category */

/*  api size */
export const getSize = async () => {
  try {
    const response = await axios.get(`${URL}/api/size`); 
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("error: ", error)
  }
};

export const addSize = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/size`, data); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateSize = async (sizeId, data) => {
    console.info("data send server: ", data)
    try {
        const response = await axios.put(`${URL}/api/size/${sizeId}`, data)
        console.info("result data: ", response.data)    
        return response.data
    } catch (error) {
        console.log("error: ", error)
        throw error;
    }
}

export const deleteSize = async (id) => {
  try {
    const response = await axios.delete(`${URL}/api/size/${id}`); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api size */

/*  api product */
export const getProducts = async () => {
  try {
    const response = await axios.get(`${URL}/api/product/admin`)
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const addProduct = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/product/admin`, data); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const updateProduct = async (data) => {
  try {
    const response = await axios.put(`${URL}/api/product/admin`, data); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${URL}/api/product/admin/${id}`); 
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}
/* End api product */

/*  api product size */
export const getProductSize = async () => {
  try {
    const response = await axios.get(`${URL}/api/product_size/admin`)
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

export const addProductSize = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/product_size/admin`, data)
    return response.data
  } catch (error) {
    console.log("error: ", error)
  }
}

/* End api product size */

/*  api product image */


/* End api product image */