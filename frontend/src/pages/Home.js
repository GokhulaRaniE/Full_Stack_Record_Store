import React, { useState, useEffect } from 'react';

function Home() {
  // Swapped to universally accessible music-themed placeholder assets
  const carouselImages = [
    "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600",
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1600",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600"
];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full m-0 p-0">
      {/* Hero Window Section */}
      <div className="relative h-screen w-full bg-neutral-900 overflow-hidden block">
        
        {/* Underlay Image Loop Engine */}
        <div className="absolute inset-0 w-full h-full">
          {carouselImages.map((imageSrc, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: currentIndex === index ? 1 : 0,
                zIndex: currentIndex === index ? 1 : 0
              }}
            >
              {/* Solid dark shade tint cover layer to guarantee text readability */}
              <div className="absolute inset-0 bg-black/60" />
              <img 
                src={imageSrc} 
                alt="Record Store Atmosphere"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Foreground Content Stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-md">🎵 Welcome to Record Store</h1>
            <p className="text-xl mb-2 text-gray-200 drop-shadow-md">
              Browse our collection of vinyl records, CDs and LPs
            </p>
            <p className="text-gray-300 mb-8 drop-shadow-md">
              Discover music from all genres — Pop, Rock, Folk and more!
            </p>
            
            <div className="flex gap-4 justify-center">
              <a href="/records" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition">
                Browse Records
              </a>
              <a href="/register" className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-3 rounded-lg font-medium text-lg transition">
                Register Now
              </a>
            </div>
          </div>
        </div>

        {/* Direct Left Toggle Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white w-12 h-12 flex items-center justify-center rounded-full z-20 text-3xl font-light transition-all"
        >
          ‹
        </button>

        {/* Direct Right Toggle Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white w-12 h-12 flex items-center justify-center rounded-full z-20 text-3xl font-light transition-all"
        >
          ›
        </button>

        {/* Tracker Progress Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-7 bg-blue-600' : 'w-2.5 bg-white/40 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      {/* Info Features Block */}
      <div className="py-16 px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-xl font-bold text-blue-900 mb-2"> Wide Collection </h3>
            <p className="text-gray-500"> Browse hundreds of vinyl records, CDs and LPs from all genres </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-blue-900 mb-2"> Easy Shopping </h3>
            <p className="text-gray-500"> Add records to cart and place orders in just a few clicks </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-blue-900 mb-2"> Order Tracking </h3>
            <p className="text-gray-500"> Track your orders from pending to delivered in real time </p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-blue-900 text-white text-center py-6 mt-auto w-full">
        <p className="text-gray-300"> © 2027 Record Store — Built with React and Node.js </p>
      </div>
    </div>
  );
}

export default Home;
