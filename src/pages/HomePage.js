// src/pages/HomePage.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import LatestProducts from '../components/LatestProducts';
import Testimonials from '../components/Testimonials';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <Container className="my-5">
                <Row>
                    <Col md={12}>
                        <h2 className="text-center mb-4">Featured Products</h2>
                        <LatestProducts />
                    </Col>
                </Row>
                <Row className="my-5">
                    <Col md={12}>
                        <h2 className="text-center mb-4">What Our Customers Say</h2>
                        <Testimonials />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;

