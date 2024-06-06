import React, { useState } from 'react';
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import { Button , Modal } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';

function Header({OpenSideBar, onLogout}) {
  const navigate = useNavigate()
  const [openConfirmation, setOpenConfirmation] = useState(false)

  
  const handleLogout = () => {
    setOpenConfirmation(true);
  }

  const confirmLogout = () => {
    onLogout();
    navigate('/');
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
                <Button color='red' onClick={handleLogout}>Đăng xuất</Button>

            <Modal
              open={openConfirmation}
              onClose={() => setOpenConfirmation(false)}
              size='tiny'
              closeIcon
            >
              <Modal.Header>Xác nhận đăng xuất</Modal.Header>
              <Modal.Content>
                <p>Bạn có chắc chắn bạn muốn thoát?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={() => setOpenConfirmation(false)}>No</Button>
                <Button positive onClick={confirmLogout}>Yes</Button>
              </Modal.Actions>
            </Modal>
            </div>
        </header>
  )
}

export default Header
