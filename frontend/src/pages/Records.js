import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Records({ addToCart }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/records')
      .then((response) => {
        setRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching records:', error);
        setLoading(false);
      });
  }, []);

  const filteredRecords = records.filter((record) =>
    record.artist.toLowerCase().includes(search.toLowerCase()) ||
    record.title.toLowerCase().includes(search.toLowerCase()) ||
    record.genre.toLowerCase().includes(search.toLowerCase())
  );

  const openPopup = (record) => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedRecord(record);
    // Auto close after 30 seconds
    timerRef.current = setTimeout(() => {
      setSelectedRecord(null);
    }, 30000);
  };

  const closePopup = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedRecord(null);
  };

  const handleAddToCart = (record) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedRecord(null);
    addToCart(record);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Our Records</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by artist, title or genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-blue-500"
      />

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-blue-900 font-medium">Loading records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <p className="text-gray-500">No records found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-3 text-left">Artist</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Genre</th>
              <th className="p-3 text-left">Size</th>
              <th className="p-3 text-left">Price (₹)</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{record.artist}</td>
                <td
                  className="p-3 text-blue-600 font-medium cursor-pointer hover:underline"
                  onClick={() => openPopup(record)}
                >
                  {record.title}
                </td>
                <td className="p-3">{record.genre}</td>
                <td className="p-3">{record.size}</td>
                <td className="p-3">₹{record.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => addToCart(record)}
                    className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Music Popup */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark overlay with background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.92), rgba(0,0,0,0.92)), url(${selectedRecord.bg_image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Popup Box */}
          <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full mx-4 border border-white border-opacity-20 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-4">
              <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                🎵 Now Playing
              </span>
              <h2 className="text-white text-2xl font-bold mt-3">
                {selectedRecord.title}
              </h2>
              <p className="text-pink-300 font-medium">{selectedRecord.artist}</p>
            </div>

            {selectedRecord.youtube_url ? (
              <div className="rounded-xl overflow-hidden mb-4 relative">
                <iframe
                  key={selectedRecord.id}
                  width="100%"
                  height="250"
                  src={`${selectedRecord.youtube_url}?autoplay=1&start=${selectedRecord.start_time}&end=${selectedRecord.start_time + 30}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                  title={selectedRecord.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                {/* Cover bottom buttons */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '60px',
                    background: 'rgba(0,0,0,0.85)',
                  }}
                />
                {/* Cover top bar */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: '45px',
                    background: 'rgba(0,0,0,0.85)',
                  }}
                />
              </div>
            ) : (
              <div className="bg-white bg-opacity-10 rounded-xl p-8 mb-4 text-center">
                <p className="text-gray-300">🎵 No video available for this record.</p>
              </div>
            )}

            {/* Record Info */}
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-white">
                <span>Genre: <span className="text-pink-300">{selectedRecord.genre}</span></span>
                <span>Size: <span className="text-pink-300">{selectedRecord.size}</span></span>
                <span>Price: <span className="text-pink-300">₹{selectedRecord.price}</span></span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAddToCart(selectedRecord)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={closePopup}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;