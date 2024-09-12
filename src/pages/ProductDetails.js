import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust the import as needed
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch to access Redux
import { fetchCartItemCount } from '../store/cartSlice'; // Import the fetchCartItemCount action

const ProductDetails = () => {
    const { id } = useParams(); // Extract the product ID from the URL
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1); // State for quantity input
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    // Access the Redux state
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch(); // Initialize useDispatch for dispatching actions

    useEffect(() => {
        console.log('Product ID:', id); // Log the product ID

        axiosInstance.get(`api/product/${id}`) // Fetch product details using the ID
            .then(response => {
                // Log the full response for debugging
                console.log('Full response:', response);

                // Log the product details
                console.log('Product details:', response.data.product);

                // Log the related products
                console.log('Related products:', response.data.relatedProducts);

                // Set the product and related products to state
                setProduct(response.data.product);
                setRelatedProducts(response.data.relatedProducts);
            })
            .catch(error => console.error('Error fetching product details:', error));
    }, [id]);

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!isAuthenticated) {
            // Redirect to login page with return URL if not authenticated
            navigate(`/login?returnTo=/product/${id}`);
            return;
        }

        try {
            console.log('Is Authenticated:', isAuthenticated);

            // Proceed with adding to cart if authenticated
            const response = await axiosInstance.post('api/cart/add', {
                product_id: id,
                quantity
            });

            console.log('Response from adding to cart:', response);

            // After successfully adding to cart, fetch the cart item count
            dispatch(fetchCartItemCount());

            // Redirect to the cart page
            console.log('Redirecting to cart page.');
            navigate('/cart'); // Use navigate for redirection
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError('Failed to add item to cart.');
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    {/* Product Image and Details */}
                    <div className="col-md-6">
                        <img
                            src={`http://localhost/storage/images/${product.image}`}
                            className="img-fluid"
                            alt={product.name}
                        />
                    </div>
                    <div className="col-md-6">
                        <h1 className="display-4">{product.name}</h1>
                        <p className="lead">{product.description}</p>
                        <h3 className="text-primary">{product.price} MAD</h3>

                        {/* Form to add product to cart with quantity input */}
                        <form onSubmit={handleAddToCart}>
                            <div className="form-group mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    className="form-control"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Add to Cart</button>
                        </form>

                        {error && <p className="text-danger mt-3">{error}</p>}

                        {/* Recommendations or Related Products */}
                        <div className="mt-5">
                            <h4 className="mb-4">You might also like:</h4>
                            <div className="row">
                                {relatedProducts.map(relatedProduct => (
                                    <div key={relatedProduct.id} className="col-md-4 mb-4">
                                        <div className="card border-0 shadow-sm">
                                            <img
                                                src={`http://localhost/storage/images/${relatedProduct.image}`}
                                                className="card-img-top"
                                                alt={relatedProduct.name}
                                                style={{ height: '250px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{relatedProduct.name}</h5>
                                                <p className="card-text text-muted">{relatedProduct.price} MAD</p>
                                                <a href={`/product/${relatedProduct.id}`} className="btn btn-primary">View Product</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;
