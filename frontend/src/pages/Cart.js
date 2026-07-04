import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart({ cart, setCart }) {

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/orders', {
        user_id: user.id,
        cart: cart,
        total: getTotal()
      });

      alert('Order placed! Your order code is: ' + response.data.order_code);
      setCart([]);
      window.location.href = '/orders';

    } catch (error) {
      alert('Something went wrong!');
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className="text-3xl font-bold text-blue-900 mb-6">🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">Add some records to your cart first.</p>
          <Link
            to="/records"
            className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Browse Records
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-4 text-left">Artist</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Genre</th>
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">Price (₹)</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.artist}</td>
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">{item.genre}</td>
                  <td className="p-4">{item.size}</td>
                  <td className="p-4 font-medium text-blue-900">₹{item.price}</td>
                  <td className="p-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Items: {cart.length}</p>
              <h2 className="text-2xl font-bold text-blue-900">
                Total: ₹{getTotal()}
              </h2>
            </div>
            <button
              onClick={placeOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
            >
              Place Order ✅
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;