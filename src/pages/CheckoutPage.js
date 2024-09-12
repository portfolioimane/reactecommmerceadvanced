import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Button, Card, Form, Table, Alert } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaStripe, FaPaypal, FaMoneyBill } from 'react-icons/fa';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeForm = ({ handlePaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error('Error creating payment method:', error);
            return;
        }

        // Get the clientSecret from your backend
        const { data } = await axiosInstance.post('api/process-payment', {
            payment_method_id: paymentMethod.id,
            payment_method: 'stripe',
        });

        if (data.error) {
            console.error('Error from backend:', data.error);
            return;
        }

        // Use the clientSecret to confirm the payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.client_secret);

        if (confirmError) {
            console.error('Error confirming payment:', confirmError);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            console.log('Payment successful!');
            const { order_id } = data; // Ensure your backend response includes the order_id
            window.location.href = `/success/${order_id}`; // Redirect to success page
        }
    } catch (error) {
        console.error('Payment error:', error);
    }
};


  return (
    <Form onSubmit={handleSubmit} id="stripe-payment-form">
      <CardElement className="mb-4" />
      <Button type="submit" className="btn btn-primary btn-lg" disabled={!stripe}>
        Place Order
      </Button>
    </Form>
  );
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('api/checkout');
        setCartItems(response.data.cartItems);
        setTotal(response.data.total);
        setShipping(response.data.shipping);
      } catch (err) {
        setError('Failed to load cart items.');
      }
    };

    fetchCartItems();
  }, []);

  const handlePaymentSuccess = async (method) => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (method === 'stripe') {
        // Stripe payment handled in StripeForm
      } else if (method === 'cod') {
        response = await axiosInstance.post('api/checkout/cash-on-delivery');
      } else if (method === 'paypal') {
        response = await axiosInstance.post('api/create-payment', { payment_method: 'paypal' });
        window.location.href = response.data.redirect_url;
      }
       const { order_id } = response.data;
    window.location.href = `/success/${order_id}`;
    //  if (response && response.data.redirect_url) {
     //   window.location.href = response.data.redirect_url;
      //}
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      if (paymentMethod === 'cod') {
        await handlePaymentSuccess('cod');
      }
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h1 className="text-primary mb-4">Checkout</h1>

        <Card className="mb-4">
          <Card.Header>
            <h2 className="mb-0">Cart Summary</h2>
          </Card.Header>
          <Card.Body>
            {cartItems.length > 0 ? (
              <Table bordered>
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={`http://localhost/storage/images/${item.product.image}`}
                          alt={item.product.name}
                          className="img-fluid"
                          style={{ maxWidth: '100px', height: 'auto' }}
                        />
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.price} MAD</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity)} MAD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Total:</td>
                    <td className="fw-bold">{total} MAD</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Shipping:</td>
                    <td className="fw-bold">{shipping} MAD</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Grand Total:</td>
                    <td className="fw-bold">{(total + shipping)} MAD</td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <p className="text-center">Your cart is empty.</p>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h2 className="mb-0">Select Payment Method</h2>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Check
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                label={<><FaStripe className="me-2" /> Pay with Stripe</>}
                onChange={(e) => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'stripe'}
              />
              <Form.Check
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                label={<><FaPaypal className="me-2" /> Pay with PayPal</>}
                onChange={(e) => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'paypal'}
              />
              <Form.Check
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                label={<><FaMoneyBill className="me-2" /> Cash on Delivery</>}
                onChange={(e) => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'cod'}
              />
            </Form>
          </Card.Body>
        </Card>

        {paymentMethod === 'stripe' ? (
          <Elements stripe={stripePromise}>
            <StripeForm handlePaymentSuccess={handlePaymentSuccess} />
          </Elements>
        ) : (
          <Button
            id="place-order-button"
            className="btn btn-primary btn-lg"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        )}

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </div>
    </section>
  );
};

export default CheckoutPage;
