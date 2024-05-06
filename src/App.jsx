import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import { useState, useEffect  } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom'
import Promotion from './pages/Promotion'
import 'semantic-ui-css/semantic.min.css'
import "react-toastify/dist/ReactToastify.css"
import Category from './pages/Category'
import Size from './pages/Size'
import Product from './pages/Product'
import ProductSize from './pages/ProductSize'
import LoginForm from './pages/Login'
import { login } from './api/service'
import { checkAuth } from './utils/auth'; 
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  
  const OpenSideBar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleLogin = async (data, navigate) => {
    try {
      const response = await login(data)
      console.log(response)
      localStorage.setItem('accessToken', response['access_token']);
      setIsLoggedIn(true);
      navigate('/home');
      toast.success("login successfully!")
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("login failed!")
    }
  }
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    toast.success("logout successfully!")
  };

  useEffect(() => {
    const isAuthenticated = checkAuth();
    setIsLoggedIn(isAuthenticated);
  }, []);

  return (
    <Router>
      {/* <div className='grid-container'>
          <Header OpenSideBar={OpenSideBar}/>
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSideBar={OpenSideBar}/>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/product" element={<Product />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/category" element={<Category />} />
                <Route path="/size" element={<Size />} />
                <Route path="/quantityProduct" element={<ProductSize />} />
                <Route path="/login" element={<LoginForm />} />
              </Routes>
      </div> */}
        {isLoggedIn ? (
          <>
            <div className='grid-container'>
              <Header OpenSideBar={OpenSideBar}  onLogout={handleLogout} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSideBar={OpenSideBar} />
              <Routes>
                <Route  path="/home" element={<Home />} />
                <Route exact path="/product" element={<Product />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/category" element={<Category />} />
                <Route path="/size" element={<Size />} />
                <Route path="/quantityProduct" element={<ProductSize />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
              <Route exact path="/" element={<LoginForm onLogin={handleLogin}/>} />
          </Routes>
        )}
        <ToastContainer />
    </Router> 
  )
}

export default App
