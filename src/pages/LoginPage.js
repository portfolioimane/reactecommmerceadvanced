import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust import as needed
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { loginSuccess } from '../store/authSlice'; // Import loginSuccess action

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const location = useLocation(); // Initialize useLocation to access the query parameters
    const dispatch = useDispatch(); // Initialize useDispatch to dispatch actions

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axiosInstance.post('api/login', {
                email,
                password
            });

            // Store authentication token and user info in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Dispatch loginSuccess action to update Redux store
            dispatch(loginSuccess({
                user: response.data.user,
                token: response.data.token
            }));

            // Get the return URL from query parameters or default to home page
            const queryParams = new URLSearchParams(location.search);
            const returnTo = queryParams.get('returnTo') || '/';
            
            // Redirect to the return URL or home page after successful login
            navigate(returnTo);
        } catch (err) {
            setError('Invalid email or password.');
            console.error('Error during login:', err);
        }
    };

    return (
        <section className="py-5">
            <div className="container">
                <h1 className="display-4 mb-4">Login</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>

                {error && <p className="text-danger mt-3">{error}</p>}
            </div>
        </section>
    );
};

export default LoginPage;
