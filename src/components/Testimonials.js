// src/components/Testimonials.js
import React from 'react';
// You will create this CSS file for custom styling

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            text: "Great service! Highly recommend.",
            author: "John Doe"
        },
        {
            id: 2,
            text: "Fantastic products and fast shipping.",
            author: "Jane Smith"
        },
        {
            id: 3,
            text: "I love shopping here. Always a great experience.",
            author: "Michael Johnson"
        }
    ];

    return (
        <section className="testimonials py-5">
            <div className="container">
                <div className="row">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="col-md-4 mb-4">
                            <div className="testimonial-card p-4 border rounded shadow-sm">
                                <p className="testimonial-text">{testimonial.text}</p>
                                <footer className="blockquote-footer mt-3">
                                    {testimonial.author}
                                </footer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

