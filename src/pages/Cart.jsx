import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Simulate API call
        setTimeout(() => {
            clearCart();
            setOrderPlaced(true);
        }, 1000);
    };

    if (orderPlaced) {
        return (
            <div className="empty-cart">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ color: '#16a34a' }}>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. We'll send you an email confirmation shortly.</p>
                <Link to="/">
                    <button className="continue-shopping">Continue Shopping</button>
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop">
                    <button className="continue-shopping">Start Shopping</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>

            <div className="cart-grid">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.images[0]} alt={item.title} className="cart-item-image" />

                            <div className="cart-content">
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{item.title}</h3>
                                    <span className="cart-item-price">${item.price}</span>
                                </div>

                                <div className="cart-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${getCartTotal()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${getCartTotal()}</span>
                    </div>
                    <button onClick={handleCheckout} className="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
