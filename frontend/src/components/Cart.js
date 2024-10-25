import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
    const { user } = useContext(AuthContext);
    // Fetch and display user's cart items from the API
    return (
        <div>
            <h2>Your Cart</h2>
            {/* Display cart items here */}
        </div>
    );
};

export default Cart;
