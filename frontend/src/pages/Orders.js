import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/orders/${user.id}`)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching orders:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className="text-3xl font-bold text-blue-900 mb-6">📦 My Orders</h1>

      {!user ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Please login first!
          </h2>
          <Link
            to="/login"
            className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-blue-900 font-medium">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet!</h2>
          <p className="text-gray-500 mb-6">
            You have not placed any orders yet.
          </p>
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
                <th className="p-4 text-left">Order Code</th>
                <th className="p-4 text-left">Total (₹)</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-900">
                    {order.order_code}
                  </td>
                  <td className="p-4 font-medium">₹{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        order.status === 'pending'
                          ? 'bg-orange-400'
                          : order.status === 'shipped'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {order.status === 'pending'
                        ? '⏳ Pending'
                        : order.status === 'shipped'
                        ? '🚚 Shipped'
                        : '✅ Delivered'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}{' '}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;