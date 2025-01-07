import React, { useState, useEffect } from "react";
import Rectangle95 from './../../assets/Rectangle95.png'
import Rectangle99 from './../../assets/Rectangle99.png'
import Rectangle96 from './../../assets/Rectangle96.avif'
import Rectangle97 from './../../assets/Rectangle97.jpg'

const ImageSlider = () => {
  const images = [
    Rectangle95,
    Rectangle99,
    Rectangle96,
    Rectangle97
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="w-[550px] h-[500px] rounded-2xl shadow-2xl"
      />
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div> */}
    </div>
  );
};

export default ImageSlider;
