import React from "react";

// Fotoğraf dosyalarının GÖRECELİ yollarla içe aktarılması
// gallery.jsx (src/components/gallery) -> assets (src/assets)
// İki nokta (..) bir üst klasöre çık demektir.

import bar from "../../assets/bar.png";
import beach from "../../assets/beach.png";
import cafe from "../../assets/cafe.png";
import commonpool from "../../assets/commonpool.png"; // commonpool için de yolu düzelttim
import entrance1 from "../../assets/entrance1.png";
import entrance2 from "../../assets/entrance2.png";
import food from "../../assets/food.png";
import golf from "../../assets/golf.png";
import gym from "../../assets/gym.png";
import jacuzi from "../../assets/jacuzi.png";
import pilatesroom from "../../assets/pilatesroom.png";
import privatepool1 from "../../assets/privatepool1.png";
import privatepool2 from "../../assets/privatepool2.png";
import restaurant1 from "../../assets/restaurant1.png";
import restaurant2 from "../../assets/restaurant2.png";
import spa1 from "../../assets/spa1.png";
import spa2 from "../../assets/spa2.png";
import tennis from "../../assets/tennis.png";

const images = [
  // ... (Geri kalan kodunuz aynı kalabilir)
  { src: bar, alt: "Bar" },
  { src: beach, alt: "Beach" },
  { src: cafe, alt: "Cafe" },
  { src: commonpool, alt: "Common Pool" },
  { src: entrance1, alt: "Entrance 1" },
  { src: entrance2, alt: "Entrance 2" },
  { src: food, alt: "Food" },
  { src: golf, alt: "Golf" },
  { src: gym, alt: "Gym" },
  { src: jacuzi, alt: "Jacuzzi" },
  { src: pilatesroom, alt: "Pilates Room" },
  { src: privatepool1, alt: "Private Pool 1" },
  { src: privatepool2, alt: "Private Pool 2" },
  { src: restaurant1, alt: "Restaurant 1" },
  { src: restaurant2, alt: "Restaurant 2" },
  { src: spa1, alt: "Spa 1" },
  { src: spa2, alt: "Spa 2" },
  { src: tennis, alt: "Tennis" },
];

const Gallery = () => {
  // ... (Geri kalan kodunuz aynı kalacaktır)
  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <h1 className="text-5xl font-serif text-center mb-12">Zenith Suites Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg shadow-lg bg-white">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <p className="text-center text-gray-700 p-2">{img.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;