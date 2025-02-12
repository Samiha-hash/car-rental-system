import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const AddCar = ({ user, handleAddCar = async () => { } }) => {
    const [carModel, setCarModel] = useState("");
    const [carBrand, setCarBrand] = useState("");
    const [dailyRentalPrice, setDailyRentalPrice] = useState("");
    const [availability, setAvailability] = useState(true);
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [features, setFeatures] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login?next=%2fadd-car%2f");
        }
    }, [user, navigate]);

    const handleDrop = (acceptedFiles) => {
        setImages(acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: handleDrop,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCar = {
            carModel,
            carBrand,
            dailyRentalPrice,
            availability,
            registrationNumber,
            features: features.split(",").map((feature) => feature.trim()),
            description,
            location,
            bookingCount: 0,
            images,
            userId: user._id,
        };


        const result = await handleAddCar(newCar);
        if (result) {
            //   setCarModel("");
            //   setDailyRentalPrice("");
            //   setAvailability(true);
            //   setRegistrationNumber("");
            //   setFeatures("");
            //   setDescription("");
            //   setLocation("");
            //   setImages([]);
            navigate("/my-cars");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md pb-32">
            <h2 className="text-center text-2xl mb-4">Add a New Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="carModel" className="block text-sm font-medium">
                        Car Brand
                    </label>
                    <input
                        type="text"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={carBrand}
                        onChange={(e) => setCarBrand(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="carModel" className="block text-sm font-medium">
                        Car Model
                    </label>
                    <input
                        type="text"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="dailyRentalPrice" className="block text-sm font-medium">
                        Daily Rental Price (BDT)
                    </label>
                    <input
                        type="number"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={dailyRentalPrice}
                        onChange={(e) => setDailyRentalPrice(e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="availability" className="block text-sm font-medium">
                        Availability
                    </label>
                    <select
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value === "true")}
                        required
                    >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-medium">
                        Vehicle Registration Number
                    </label>
                    <input
                        type="text"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="features" className="block text-sm font-medium">
                        Features (comma-separated)
                    </label>
                    <input
                        type="text"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="e.g., GPS, Air Conditioning, Bluetooth"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium">
                        Location
                    </label>
                    <input
                        type="text"
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        className="dark:bg-slate-700 w-full p-2 border border-gray-400 rounded mt-1 min-h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="images" className="block text-sm font-medium">
                        Upload Images
                    </label>
                    <div
                        {...getRootProps()}
                        className={`border-dashed border-2 rounded p-4 mt-1 text-center cursor-pointer ${isDragActive ? "border-orange-500" : "border-gray-400"
                            }`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop or click to select images</p>}
                    </div>
                    <div className="flex flex-wrap mt-4">
                        {images.map((file, index) => (
                            <img
                                key={index}
                                src={file.preview}
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded mr-2 mb-2"
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white py-2 mt-4 rounded hover:bg-orange-700 text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddCar;
