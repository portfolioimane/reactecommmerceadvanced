// src/components/LatestProducts.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './LatestProducts.css';

const LatestProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosInstance.get('api/latest-products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="latest-products">
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <img src={`http://localhost/storage/images/${product.image}`} className="card-img-top" alt={product.name} style={{ height: '250px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-muted">{product.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="text-primary">{product.price} MAD</h6>
                                    <a href={`/product/${product.id}`} className="btn btn-primary">View Product</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestProducts;
