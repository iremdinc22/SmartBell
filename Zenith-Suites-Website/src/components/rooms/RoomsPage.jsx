const RoomsPage = () => {
  const roomTypes = [
    {
      id: 1,
      name: "Deluxe Room",
      description: "Elegant room with a king-size bed, marble bathroom, and city views.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2VrJ46QUw2hTJ8cvw-FZ6PQ6_mQ4dewko9im5no9zRZRGvXQK6GsDF5XdI0YcSxb4GpAkhZLF4_8VBDIlCbHTtntt8Iq0PyZLEJjSLi5d18lExAvmAIYlLbolNl4S3MWFFqAmu5ufj9uPbOeo0lNHMTckuIk8IhpBExjLyhwblLuYyqfvZWcc3oHsSgB5NFLty9eafaxggBK0AjoYY5LPU_7idKgD_Ns0Kti7AmFIs4cKVx08aHBmB3UFHW3_y7Z6V5yc8X-uMMo"
    },
    {
      id: 2,
      name: "Superior Room",
      description: "Spacious room with a king-size bed, sitting area, and garden views.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD5SmSnbeey9VQfSzcpx_FwkHzvQ1RVwxqOYsuwRM5JbX1erGGwPHOwRFDK8wGdQbQP6gYsPR14mq2XwB2-rI0O5VOCdHASRE7npfEqC1g4Kw-RRAoT9cVPyLjMgpQd4MSShhnn54vu4r7llXHnndkDNyW0AVaQQxyYuOaTfPzGAVd9MqoofKsbG6e3okaH4LXJFAxy5o5pnYISNSzlZgwGI53hTRuGCiQvjeiCnBzULlftV1EL122iZMwNbt1gFpC417WiWnS3jM"
    },
    {
      id: 3,
      name: "Executive Room",
      description: "Luxurious room with a king-size bed, separate living area, and balcony.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCoKqJROPLWx0hWrkl_PlfNSpZFrFzMivuKLveeeKuKx2EwPTNnf5M3KzipYcySg8ehmPGXlDlVDksLVEp_oh-_6J2dwHB98Mu-ZRzZyZO2RQE9GIEyLSRYSHnsbhjfPLhuSOWsEb_XmVQ58087XxLtW-IatEwExCHy29cUQVlOkFTbdMSn5eu_W3rPb4toI3jLSkrNlq3imRe_yKhBPFSPwSBYlJbEgSKQsxWIam6EaisYDNxvghJaJBzBGvKmXP0a8uEv84nOic"
    },
    {
      id: 4,
      name: "Junior Suite",
      description: "Stylish suite with a king-size bed, living room, and private terrace.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJRNwdLHNnpXR1RfYqmKyYjxXfoifZAKNMmkchG_3JmdbAUoe50ex_92ToKwaDe97PIy_MxVQASYKeY7ZhUH_GYmlNmpm_EDxGIkXUXzRb07YsspuUoa1lgwxc4DTw3mEMuxUr4ESlQw2XCbt3aKWjSTinXsKDdNnY-KAFgkROygMyPGVpABA5hCyXrhV-a1fMTmfdlXp_B1j8CaCMVrzxLdKaB7rcitRiWYRHSi_5lLWZyRYls_jZKnPBTPXBopXTIlqMYxgECqg"
    },
    {
      id: 5,
      name: "Prestige Suite",
      description: "Opulent suite with a king-size bed, dining area, and panoramic views.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoHdAyDk9HTVTvSRINVMSQ7-gOABbDMCfPvndiWxvLjacW6C7U1u4fR6NYaJKEbdiQV2TPnsSrqrE9vynmuJY9n4YZBOn2kATu4iipyYCkqMbTy-x0wRvFj828n3syaZNXFxhweY2XcG1Ew8Mzt0Fkvtj06VNnxIwhxGkPliRE3j_kJ57C87eI3VFu-CGYimVUVeS4ckv7nzbxE8qQCoRT9UqrUK-4Yw2PC7bJTq0CWUdYCjPFuYTOqN7J-kJvqGfXJ9MozSiIFOM"
    },
    {
      id: 6,
      name: "Presidential Suite",
      description: "Exclusive suite with a king-size bed, grand living room, and private butler service.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtBI9wS7Hmxun_rnlQzpwwWW0zFXB3yGSXFJOQiXuvS8aRiqbZaDKjM2m14RGp3JeuCGESlAN4W-gPmUuyHJOVDa02CcWLS7uO3kaot8KlPq1cbFb0SB6YeidViFnRR_vzI3qKXxSFx7QLsrOuca8yo1friWyxgjcXhHmGvZEOpLRjQRtTaqzYwY4XPfkBAr5YlCzNs55xaYwbQp4h81jRnEAISiLjViiZ0b1Q5oBHkPHebBH2FdnHyv8cJZTtrbwCA_iQ7yfYXKI"
    }
  ];

  const amenities = [
    {
      id: 7,
      name: "Marble Bathrooms",
      description: "Luxurious marble bathrooms with soaking tubs and separate showers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCW8CQM0-mQ5cnXRMzvszr84K-sPGhTeefVrFcT-yZ6nt952Wq7sI1AXbTDOtI3yefLYOBWkGN6vFmwKKayLmGNEpxd0fHJuM4H_vQgCo89A4_VABvYbo6Am_mwd7EotO7IY0vIdcRMA0Gm1jIn2R_tY-qh3CKoWL5W2Fgzj4UECDFSnP4QP3n77T9qCzqoKVflaynHN0lrfHhObpEJKBCOrjV7n_MCTtdHEjcYmkJCNTTH15LVS0EI_222iQMywzj89hqXhNBdcU"
    },
    {
      id: 8,
      name: "City Views",
      description: "Breathtaking views of the city skyline from every room.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx6GyypBMhsj137IsMigYRXNM2VGSZMELhcByjY7b5xg1ZJzLkwjl-i-JV5tvgpi1E3_vd1jBoBFCdY0WZYiXnAkHy0opTZBuyZhYA1eg7o1TLI82BkC1b8ka0QRp2KH2-4rKPukhbSeptFrqx9M1YnubUb-9VtdGpJp_D5L5L1EEuK1J6pUQVnb3KHiILFHoampYUAdcdgj6jm-h76_nRMRf2uN1nDF1qlCbcA-ZHoxf5sE4kRtbY8-KdHfU99g9n_JMJvReqUhM"
    },
    {
      id: 9,
      name: "Private Balconies",
      description: "Private balconies offering a serene escape with outdoor seating.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhemTFpkh4J9iuIztJPnA2k74o1mX6RxCn3lZselDvmb8QotP9jJX7YUjsji7cwXRJHGom3tenBulAvtz7GxXuJOChkRWMYn3uiBYgLu6-BGc6KYWM-9aoyUwC80WRN1BUWL3VGDxkYPEBQg-G-Kvbknc68TmwAsxov944M7TYj6HJLcZ3QXeqO56Q2wUUVrLfCdUARxb21K2r0wrP3urnUZERDUmFjeWlqqWjvmDX_iD40dtPtyi6SXi9KDKVFFooiU3G9f6hgQc"
    }
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-4">
            Rooms & Suites
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our collection of elegantly designed rooms and suites, 
            each offering a unique blend of luxury and comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {roomTypes.map((room) => (
            <div key={room.id} className="group">
              <div className="overflow-hidden mb-4">
                <div 
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 filter grayscale"
                  style={{ backgroundImage: `url("${room.image}")` }}
                />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-black mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-500 text-sm font-light">
                  {room.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
              Premium Amenities
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Every detail has been carefully crafted to ensure your stay is nothing short of extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="group">
                <div className="overflow-hidden mb-4">
                  <div 
                    className="w-full aspect-square bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 filter grayscale"
                    style={{ backgroundImage: `url("${amenity.image}")` }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold text-black mb-2">
                    {amenity.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-light">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;