import React, { useState } from 'react';
import { Button, Form, Grid, Segment, Label } from 'semantic-ui-react';
import { login } from '../api/service';
import { useNavigate } from 'react-router-dom';
function LoginForm({onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Gọi hàm onLogin và truyền username và password
        try {
            await onLogin({ username, password }, navigate);
        } catch (error) {
            console.error('Error during login:', error);
        }
      };

  return (
    <div className='main-container'>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
            <center> 
                <h1>Form Login </h1>    
            </center>
            <br />
            <br />
            <Form size='large' onSubmit={handleSubmit}>
            <Segment stacked>
                <Form.Input 
                    fluid 
                    icon='user' 
                    iconPosition='left' 
                    placeholder='Username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button color='teal' fluid size='large'>
                Login
                </Button>
            </Segment>
            </Form>
        </Grid.Column>
        </Grid>
    </div>
  );
}

export default LoginForm;
