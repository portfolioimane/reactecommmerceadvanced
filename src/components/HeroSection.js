// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero d-flex align-items-center text-white text-center">
            <div className="hero-content container">
                <h1 className="display-4">Welcome to Our Store</h1>
                <p className="lead">Discover the latest trends and best deals on your favorite products.</p>
                <a href="/shop" className="btn btn-light btn-lg">Shop Now</a>
            </div>
        </section>
    );
};

export default HeroSection;

