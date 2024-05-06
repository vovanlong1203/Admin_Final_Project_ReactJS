import React from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import { Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';

function Header({OpenSideBar, onLogout}) {
  const navigate = useNavigate()
  const handleLogout = () => {
    onLogout();
    navigate('/')
  };

  return (
        <header className='header'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSideBar}/>
            </div>
            <div className='header-left'>
                <BsSearch className='icon' />
            </div>
            <div className='header-right'>
            <span style={{ marginRight: '8px' }}>Admin</span>
                <BsPersonCircle className='icon'/>
                <Button color='red' onClick={handleLogout}>Logout</Button>
            </div>
        </header>
  )
}

export default Header
