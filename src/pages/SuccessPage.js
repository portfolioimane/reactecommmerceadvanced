import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import { Table, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipping, setShipping] = useState(0);
  const { orderId } = useParams(); // Extract orderId from URL params

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`api/order-details/${orderId}`);
        setOrderDetails(response.data.order);
        setShipping(response.data.shipping);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="text-center"><Spinner animation="border" /> Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="my-4">Order Confirmation</h1>
      {orderDetails ? (
        <div>
          <Row className="mb-4">
            <Col md={6}>
              <h4>Order Summary</h4>
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
              <p><strong>Total Amount:</strong> ${orderDetails.total_amount}</p>
              <p><strong>Payment Method:</strong> {orderDetails.payment_method}</p>
              <p><strong>Status:</strong> {orderDetails.status}</p>
              <p><strong>Shipping Cost:</strong> ${shipping}</p> {/* Display shipping cost */}
            </Col>
          </Row>
          <h2>Order Items</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.order_items && orderDetails.order_items.length > 0 ? (
                orderDetails.order_items.map(item => {
                  // Calculate the total price for each item
                  const total = item.quantity * item.price;

                  return (
                    <tr key={item.product_id}>
                      <td>
                        <img
                          src={`http://localhost/storage/images/${item.product.image}`}
                          alt={item.product.name}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td> {/* Format price to two decimal places */}
                      <td>${total}</td> {/* Display total price */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">No items in this order.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <p>No order details available.</p>
      )}
    </Container>
  );
};

export default SuccessPage;
