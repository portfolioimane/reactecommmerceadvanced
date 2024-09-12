// src/pages/ContactPage.js

import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust import if needed

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponseMessage('');

        try {
            const response = await axiosInstance.post('/api/contact', formData);
            setResponseMessage('Your message has been sent successfully.');
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (err) {
            setError('Failed to send your message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page container py-5">
            <h1 className="text-center mb-4">Contact Us</h1>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-control"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>

                    {responseMessage && <div className="alert alert-success mt-3">{responseMessage}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
