import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("priceAsc");

  useEffect(() => {
    // Fetch cars data from the backend (for now, using mock data)
    const fetchCars = async () => {
      // Replace with actual API call
      const fetchedCars = [
        { id: 1, model: "Toyota Camry 2023", price: 45, available: true, image: "/car1.jpg" },
        { id: 2, model: "BMW X5", price: 99, available: true, image: "/car2.jpg" },
        { id: 3, model: "Honda Accord 2022", price: 55, available: false, image: "/car3.jpg" },
        { id: 4, model: "Mercedes-Benz S-Class", price: 150, available: true, image: "/car4.jpg" },
      ];
      setCars(fetchedCars);
    };

    fetchCars();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredCars = cars
    .filter(
      (car) =>
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "priceAsc") {
        return a.price - b.price;
      } else if (sortOrder === "priceDesc") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Cars</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by car model"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Sorting Options */}
      <div className="mb-6 flex justify-between items-center">
        <select
          value={sortOrder}
          onChange={handleSort}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      {/* Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car.id}
              className="border rounded shadow-md overflow-hidden bg-white"
            >
              <img src={car.image} alt={car.model} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{car.model}</h3>
                <p className="text-gray-500">Price: ${car.price}/day</p>
                <p
                  className={`text-sm font-bold ${car.available ? "text-orange-600" : "text-red-600"}`}
                >
                  {car.available ? "Available" : "Not Available"}
                </p>
                <Link
                  to={`/car-details/${car.id}`}
                  className="block mt-4 text-orange-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-lg text-gray-500">No cars available</p>
        )}
      </div>
    </div>
  );
};

export default AvailableCars;
