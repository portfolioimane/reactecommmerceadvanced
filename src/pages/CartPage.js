import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust path if necessary
import { Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { fetchCartItemCount } from '../store/cartSlice'; // Import the fetchCartItemCount action

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch(); // Initialize useDispatch

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get('api/cart'); // Adjust the endpoint as needed
                setItems(response.data.items);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const removeFromCart = async (itemId) => {
        try {
            await axiosInstance.delete(`api/cart/remove/${itemId}`); // Adjust the endpoint as needed
            setItems(items.filter(item => item.id !== itemId));
            
            // Dispatch fetchCartItemCount after successful removal
            dispatch(fetchCartItemCount());
        } catch (error) {
            console.error('Error removing item from cart:', error);
            setError(error);
        }
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) {
        return <Alert variant="info">Loading...</Alert>;
    }

    if (error) {
        return <Alert variant="danger">Error loading cart: {error.message}</Alert>;
    }

    return (
        <Container className="py-5">
            <h1 className="display-4 mb-4">Your Cart</h1>

            {items.length === 0 ? (
                <Alert variant="info">Your cart is currently empty.</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <img
                                            src={`/storage/${item.product.image}`} // Adjust the path as needed
                                            className="img-thumbnail"
                                            alt={item.product.name}
                                            style={{ width: '100px' }}
                                        />
                                        {item.product.name}
                                    </td>
                                    <td>{item.price} MAD</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity)} MAD</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Total and Checkout Button */}
                    <Row className="mt-4">
                        <Col>
                            <h3 className="mb-0">Total: {calculateTotal()} MAD</h3>
                        </Col>
                        <Col className="text-right">
                            <Button href="/checkout" variant="success" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default CartPage;
