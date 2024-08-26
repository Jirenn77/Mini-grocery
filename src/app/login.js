import React, { useState } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import "./globals.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'password123') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ backgroundColor: 'var(--card-background-color)', color: 'var(--text-color)', width: '400px' }} className="p-4">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: 'var(--button-color)' }}>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="custom-placeholder"
                style={{ backgroundColor: '#333', color: 'var(--text-color)', border: 'none', borderRadius: '0' }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="custom-placeholder"
                style={{ backgroundColor: '#333', color: 'var(--text-color)', border: 'none', borderRadius: '0' }}
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">
              
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;