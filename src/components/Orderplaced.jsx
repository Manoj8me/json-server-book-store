import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./orderplaced.css";
function Orderplaced() {
    const navigate = useNavigate();

    const backToCart = () => {
        navigate("/cart");
    };

    const backToBookDisplay = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        sessionStorage.clear()
        navigate("/")
    }
    return (
        <div>
            <nav className='navbar'>
                <div className="navbar-brand">
                    <Link className='logo-design'>BookParadise</Link>
                </div>
                <ul className="navbar-links8">
                    <li>
                        <button onClick={handleLogout} className='cart-btn'>LogOut</button>
                    </li>
                </ul>
            </nav>
            <div className="orderplaced">
                <div className="order-placed-card">
                    <h5 className="order-placed-message">Your order has been placed successfully!</h5>
                    <p className="thank-you-message">Thank you for ordering from BookParadise. We hope you enjoy your books!</p>
                    <button className="back-cart-btn" onClick={backToCart}>Back to Cart</button>
                    <button className="back-home-btn" onClick={backToBookDisplay}>Back to HomePage</button>
                </div>
            </div>
        </div>
    );
}

export default Orderplaced;
