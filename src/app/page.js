"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, Row, Table, Button, Modal } from "react-bootstrap";
import Login from "./login";
import "./globals.css";

const Home = () => {
  const [quantity, setQuantity] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cashTendered, setCashTendered] = useState(0);
  const [change, setChange] = useState(0);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [salesReport, setSalesReport] = useState({
    totalSales: 0,
    totalTransactions: 0
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCashTendered, setShowCashTendered] = useState(false);  

  const quantityRef = useRef(null);
  const barcodeRef = useRef(null);

  const products = useRef([
    { barcode: "1001", productName: "Bulad", price: 10.0, category: "Dried Goods" },
    { barcode: "1002", productName: "Oil", price: 30.0, category: "Groceries" },
    { barcode: "1003", productName: "Noodles", price: 20.0, category: "Groceries" },
    { barcode: "1004", productName: "Soap", price: 35.0, category: "Personal Care" },
    { barcode: "1006", productName: "Bugas", price: 58.0, category: "Groceries" },
    { barcode: "1007", productName: "San Marino", price: 42.0, category: "Can Goods" },
    { barcode: "1008", productName: "Century Tuna", price: 38.0, category: "Can Goods" },
    { barcode: "1009", productName: "Coke 1L", price: 45.0, category: "Beverages" },
    { barcode: "1010", productName: "Royal", price: 45.0, category: "Beverages" },
  ]);

  const getTotalPrice = useCallback(() => {
    setTotalPrice(items.reduce((total, item) => total + item.price * item.quantity, 0));
  }, [items]);

  const computeAmount = () => {
    if (cashTendered < totalPrice) {
      alert('Insufficient cash. Please enter a larger amount.');
      setChange(0);
    } else {
      setChange(cashTendered - totalPrice);
      setShowReceipt(false);
      
      setSalesReport(prevReport => ({
        totalSales: prevReport.totalSales + totalPrice,
        totalTransactions: prevReport.totalTransactions + 1
      }));
    }
  };

  useEffect(() => {
    getTotalPrice();
  }, [getTotalPrice]);

  useEffect(() => {
    computeAmount();
  }, [cashTendered, totalPrice]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'q') {
        quantityRef.current?.focus();
      } else if (event.ctrlKey && event.key === 'b') {
        barcodeRef.current?.focus();
      } else if (event.ctrlKey && event.key === 'c') {
        setShowCatalog(true);
      } else if (event.ctrlKey && event.key === 'i') {
        const instructions = document.getElementById('key-bindings');
        if (instructions) {
          instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
        }
      } else if (event.ctrlKey && event.key === 'p') {
        setShowReceipt(true);
      } else if (event.ctrlKey && event.key === 'y') {
        setShowSalesReport(true);
      } else if (event.ctrlKey && event.key === 'm') {
        handleVoid();
      } else if (event.ctrlKey && event.key === 'e') { 
        setShowCashTendered(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [cashTendered, totalPrice]);

  const handleBarcodeChange = (e) => {
    const barcodeValue = e.target.value;
    setBarcode(barcodeValue);
    const product = products.current.find((p) => p.barcode === barcodeValue);
    if (product) {
      setProductName(product.productName);
      setPrice(product.price);
      if (quantity > 0) {
        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.productName === product.productName);
          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity = quantity;
            return updatedItems;
          } else {
            return [...prevItems, { productName: product.productName, quantity, price: product.price }];
          }
        });
        setQuantity(1);
        setBarcode("");
      }
    } else {
      setProductName("");
      setPrice(0);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(newQuantity);
    if (barcode) {
      const product = products.current.find((p) => p.barcode === barcode);
      if (product) {
        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.productName === product.productName);
          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity = newQuantity;
            return updatedItems;
          } else {
            return [...prevItems, { productName: product.productName, quantity: newQuantity, price: product.price }];
          }
        });
      }
    }
  };

  const handleCashTenderedChange = (e) => {
    setCashTendered(parseFloat(e.target.value) || 0);
  };

  const handleVoid = () => {
    setItems([]);
    setTotalPrice(0);
    setCashTendered(0);
    setChange(0);
    setShowReceipt(false);
  };

  const groupedProducts = products.current.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleCloseCatalog = () => setShowCatalog(false);
  const handleCloseReceipt = () => setShowReceipt(false);
  const handleCloseSalesReport = () => setShowSalesReport(false);
  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Container className="my-4">
      {isLoggedIn ? (
        <>
          <Card style={{ backgroundColor: 'var(--card-background-color)'}} text="white" className="shadow-lg">
            <Card.Body>
              <Row className="text-center mb-4">
                <Col>
                  <h1 className="display-4" style={{ color: 'var(--button-color)' }}>John's Grocery</h1>
                </Col>
              </Row>
              <Row className="text-end mb-4">
                <Col>
                  <h3>Total Amount Due: <span className="text-warning">₱{totalPrice.toFixed(2)}</span></h3>
                </Col>
              </Row>
              <Row className="mb-5">
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label><b style={{ color: 'var(--button-color)' }}>Quantity:</b></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="form-control-lg"
                        ref={quantityRef}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><b style={{ color: 'var(--button-color)' }}>Barcode:</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter barcode"
                        value={barcode}
                        onChange={handleBarcodeChange}
                        className="form-control-lg"
                        ref={barcodeRef}
                      />
                    </Form.Group>
                    <div className="mt-5" id="key-bindings">
                      <Card style={{ backgroundColor: '#333'}} text="light">
                        <Card.Body>
                          <h5 style={{ color: 'var(--button-color)' }} >Key Bindings:</h5>
                          <ul>
                            <li><strong>Ctrl + Q:</strong> Focus on Quantity input</li>
                            <li><strong>Ctrl + B:</strong> Focus on Barcode input</li>
                            <li><strong>Ctrl + C:</strong> Show Product Catalog</li>
                            <li><strong>Ctrl + P:</strong> Print Receipt</li>
                            <li><strong>Ctrl + Y:</strong> Show Sales Report</li>
                            <li><strong>Ctrl + M:</strong> Void Transaction</li>
                            <li><strong>Ctrl + E:</strong> Toggle Cash Tendered Field</li> 
                          </ul>
                        </Card.Body>
                      </Card>
                    </div>
                  </Form>
                </Col>
                <Col md={6}>
                  <Table bordered hover variant="light" className="text-center">
                    <thead className="table-primary">
                      <tr>
                        <th>Quantity</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.quantity}</td>
                          <td>{item.productName}</td>
                          <td>₱{item.price.toFixed(2)}</td>
                          <td>₱{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Col xs={12} sm={6} md={4}>
                  <Form>
                    {showCashTendered && ( 
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label><b style={{ color: 'var(--button-color)' }}>Cash Tendered</b></Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter cash tendered"
                            value={cashTendered}
                            onChange={handleCashTenderedChange}
                            className="form-control-lg"
                          />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Label><b style={{ color: 'var(--button-color)' }}>Change:</b></Form.Label>
                          <Form.Control
                            type="text"
                            value={`₱${change.toFixed(2)}`}
                            readOnly
                            className="form-control-lg bg-light"
                          />
                        </Form.Group>
                      </>
                    )}
                  </Form>
                </Col>
              </Row><br></br>
            </Card.Body>
          </Card>

          <Modal show={showCatalog} onHide={handleCloseCatalog}>
            <Modal.Header style={{ backgroundColor: 'var(--card-background-color)'}}>
              <Modal.Title style={{ color: 'var(--button-color)' }} >Product Catalog</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'var(--card-background-color)'}}>
              {Object.keys(groupedProducts).map((category) => (
                <div key={category} className={`category-${category.toLowerCase().replace(' ', '-')}`}>
                  <h5 style={{ textTransform: 'capitalize', color: 'var(--button-color)' }}>{category}</h5>
                  <Table bordered hover variant="light" className="text-center mb-4">
                    <thead className="table-primary">
                      <tr>
                        <th>Barcode</th>
                        <th>Product Name</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedProducts[category].map((product) => (
                        <tr key={product.barcode}>
                          <td>{product.barcode}</td>
                          <td>{product.productName}</td>
                          <td>₱{product.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            </Modal.Body>
          </Modal>

          <Modal show={showReceipt} onHide={handleCloseReceipt}>
            <Modal.Header style={{ backgroundColor: 'var(--card-background-color)'}}>
              <Modal.Title style={{ color: 'var(--button-color)' }} >Receipt</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'var(--card-background-color)'}}>
              <Table bordered hover variant="light" className="text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Quantity</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.quantity}</td>
                      <td>{item.productName}</td>
                      <td>₱{item.price.toFixed(2)}</td>
                      <td>₱{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3"><strong>Total Amount:</strong></td>
                    <td><strong>₱{totalPrice.toFixed(2)}</strong></td>
                  </tr>
                  {showCashTendered && ( 
                    <tr>
                      <td colSpan="3"><strong>Cash Tendered:</strong></td>
                      <td><strong>₱{cashTendered.toFixed(2)}</strong></td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3"><strong>Change:</strong></td>
                    <td><strong>₱{change.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>

          <Modal show={showSalesReport} onHide={handleCloseSalesReport}>
            <Modal.Header style={{ backgroundColor: 'var(--card-background-color)'}}>
              <Modal.Title style={{ color: 'var(--button-color)' }} >Sales Report</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'var(--card-background-color)'}}>
              <Table bordered hover variant="light" className="text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Total Sales</th>
                    <th>Total Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>₱{salesReport.totalSales.toFixed(2)}</td>
                    <td>{salesReport.totalTransactions}</td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Container>
  );
};

export default Home;
