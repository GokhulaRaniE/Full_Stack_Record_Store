import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [records, setRecords] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('records');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({
    artist: '', title: '', genre: '', size: '', price: ''
  });

  useEffect(() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // If not logged in
  if (!savedUser || !token) {
    window.location.href = '/login';
    return;
  }

  const parsedUser = JSON.parse(savedUser);

  // If logged in but not admin
  if (parsedUser.role !== 'admin') {
    alert('You are not authorized!');
    window.location.href = '/';
    return;
  }

  // If admin fetch data
  fetchRecords();
  fetchOrders();
}, []);

  const fetchRecords = () => {
    axios.get('http://localhost:5000/records')
      .then(res => setRecords(res.data))
      .catch(err => console.log(err));
  };

  const fetchOrders = () => {
    axios.get('http://localhost:5000/orders/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  const handleAddRecord = () => {
    if (!newRecord.artist || !newRecord.title || !newRecord.price) {
      alert('Please fill all fields!');
      return;
    }
    axios.post('http://localhost:5000/records', newRecord, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        alert('Record added!');
        setShowAddForm(false);
        setNewRecord({ artist: '', title: '', genre: '', size: '', price: '' });
        fetchRecords();
      })
      .catch(err => console.log(err));
  };

  const handleDeleteRecord = (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    axios.delete(`http://localhost:5000/records/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        alert('Record deleted!');
        fetchRecords();
      })
      .catch(err => console.log(err));
  };

  const handleEditRecord = (record) => {
    setEditRecord(record);
  };

  const handleUpdateRecord = () => {
    axios.put(`http://localhost:5000/records/${editRecord.id}`, editRecord, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        alert('Record updated!');
        setEditRecord(null);
        fetchRecords();
      })
      .catch(err => console.log(err));
  };

  const handleStatusChange = (order_id, status) => {
    axios.put(`http://localhost:5000/orders/${order_id}`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        alert('Order status updated!');
        fetchOrders();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        ⚙️ Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === 'records'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          📀 Records
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === 'orders'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          📦 Orders
        </button>
      </div>

      {/* ── RECORDS TAB ── */}
      {activeTab === 'records' && (
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
          >
            + Add New Record
          </button>

          {/* Add Record Form */}
          {showAddForm && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4 max-w-lg">
              <h2 className="text-lg font-bold mb-3 text-blue-900">
                Add New Record
              </h2>
              {['artist', 'title', 'genre', 'size', 'price'].map((field) => (
                <input
                  key={field}
                  type={field === 'price' ? 'number' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newRecord[field]}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, [field]: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                />
              ))}
              <button
                onClick={handleAddRecord}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg mr-2"
              >
                Add Record
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Edit Record Form */}
          {editRecord && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 max-w-lg border border-yellow-300">
              <h2 className="text-lg font-bold mb-3 text-blue-900">
                Edit Record
              </h2>
              {['artist', 'title', 'genre', 'size', 'price'].map((field) => (
                <input
                  key={field}
                  type={field === 'price' ? 'number' : 'text'}
                  value={editRecord[field]}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, [field]: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                />
              ))}
              <button
                onClick={handleUpdateRecord}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setEditRecord(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Records Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 text-left">Artist</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Genre</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Price (₹)</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.artist}</td>
                  <td className="p-3">{record.title}</td>
                  <td className="p-3">{record.genre}</td>
                  <td className="p-3">{record.size}</td>
                  <td className="p-3">₹{record.price}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEditRecord(record)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-bold text-blue-900 mb-4">All Orders</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 text-left">Order Code</th>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Total (₹)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date & Time</th>
                <th className="p-3 text-left">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{order.order_code}</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3">₹{order.total}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.status === 'pending'
                          ? 'bg-orange-400'
                          : order.status === 'shipped'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString()}{' '}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
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

export default Admin;