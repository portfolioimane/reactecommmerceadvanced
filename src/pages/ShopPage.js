// src/pages/ShopPage.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust the import as needed

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        description: '',
        min_price: '',
        max_price: '',
        sort: 'price_asc'
    });

    useEffect(() => {
        // Fetch categories (you need an endpoint for this)
        axiosInstance.get('/api/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    useEffect(() => {
        // Fetch products based on filters
        axiosInstance.get('/api/products', { params: filters })
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        setFilters({ ...filters, sort: e.target.value });
    };

    return (
        <div className="shop-page container py-5">
            <h1 className="text-center mb-4">Shop</h1>

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="filters">
                        <h4>Filters</h4>

                        {/* Category Filter */}
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                className="form-control"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description Filter */}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="form-control"
                                value={filters.description}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {/* Price Filter */}
                        <div className="form-group">
                            <label htmlFor="min_price">Min Price</label>
                            <input
                                type="number"
                                id="min_price"
                                name="min_price"
                                className="form-control"
                                value={filters.min_price}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="max_price">Max Price</label>
                            <input
                                type="number"
                                id="max_price"
                                name="max_price"
                                className="form-control"
                                value={filters.max_price}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {/* Sort Options */}
                        <div className="form-group">
                            <label htmlFor="sort">Sort By</label>
                            <select
                                id="sort"
                                className="form-control"
                                value={filters.sort}
                                onChange={handleSortChange}
                            >
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="row">
                        {products.map(product => (
                            <div key={product.id} className="col-md-4 mb-4">
                                <div className="card border-0 shadow-sm">
                                    <img
                                        src={`http://localhost/storage/images/${product.image}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text text-muted">{product.description}</p>
                                        <h6 className="text-primary">{product.price} MAD</h6>
                                        <a href={`/product/${product.id}`} className="btn btn-primary">View Product</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
