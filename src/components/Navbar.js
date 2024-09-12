// src/components/NavBar.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { fetchCartItemCount } from '../store/cartSlice';

const NavBar = () => {
    const cartItemCount = useSelector((state) => state.cart.itemCount);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCartItemCount());
    }, [isAuthenticated, dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/path-to-your-logo.png"
                        alt="Your E-Commerce Site"
                        style={{ height: '40px' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/shop" className="nav-link-custom">Shop</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="nav-link-custom">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/cart" className="nav-link-custom position-relative">
                            <FaShoppingCart style={{ fontSize: '1.25rem' }} />
                            {cartItemCount > 0 && (
                                <Badge bg="warning" text="dark" className="ms-2">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Nav.Link>
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link-custom">Register</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link href="#!" onClick={handleLogout} className="nav-link-custom">Logout</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
