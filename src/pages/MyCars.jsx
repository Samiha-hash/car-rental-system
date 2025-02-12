import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { BsPencil, BsTrash } from "react-icons/bs";
import Dropzone from "react-dropzone";
import { HashLoader } from "react-spinners";

const MyCars = ({ user, fetchCars = async () => { }, myCars = [], updateCar = async () => { }, deleteCar = async () => { } }) => {
    const [loading, setLoading] = useState(true);
    const [editingCar, setEditingCar] = useState(null); // Car being edited
    const [editedFields, setEditedFields] = useState({}); // Editable fields
    const [newImages, setNewImages] = useState([]); // Uploaded images for editing
    const [deletingCar, setDeletingCar] = useState(null); // Car being deleted
    const [tempCars, setTempCars] = useState(myCars);
    const [filter, setFilter] = useState({ field: "dateAdded", order: "desc" });

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login?next=%2fmy-cars%2f");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) {
            toast.error("User not logged in");
            return;
        }
        (async () => {
            await fetchCars();
            setLoading(false);
        })();
    }, [user]);

    useEffect(() => {
        // Sort cars based on the selected filter
        const sortedCars = [...myCars].sort((a, b) => {
            if (filter.field === "dateAdded") {
                return filter.order === "desc"
                    ? new Date(b.dateAdded) - new Date(a.dateAdded)
                    : new Date(a.dateAdded) - new Date(b.dateAdded);
            }
            if (filter.field === "dailyRentalPrice") {
                return filter.order === "asc"
                    ? a.dailyRentalPrice - b.dailyRentalPrice
                    : b.dailyRentalPrice - a.dailyRentalPrice;
            }
            return 0;
        });
        setTempCars(sortedCars);
    }, [myCars, filter]);

    const updateFilter = (field, order) => {
        setFilter({ field, order });
    };


    const handleEdit = (car) => {
        setEditingCar(car);
        setEditedFields({ ...car });
        setNewImages([]);
    };

    const handleSave = async () => {
        const updatedCar = {
            ...editedFields,
            newImages,
        };

        const success = await updateCar(editingCar._id, updatedCar);
        if (success) {
            toast.success("Car updated successfully!");
            setEditingCar(null);
            await fetchCars();
        } else {
            toast.error("Failed to update car.");
        }
    };

    const handleDelete = async () => {
        const success = await deleteCar(deletingCar._id);
        if (success) {
            toast.success("Car deleted successfully!");
            setDeletingCar(null);
            await fetchCars();
        } else {
            toast.error("Failed to delete car.");
        }
    };

    if (loading) return (<div className="flex justify-center items-center h-[70vh]">
        <div className="grid items-center space-x-4">
            <div className="p-4">
                <HashLoader color="#f97316" className="mx-auto" />
            </div>
            <div>
                <div className="text-2xl font-semibold">Loading My Cars...</div>
            </div>
        </div>
    </div>);

    if (tempCars.length === 0) {
        return (
            <div className="text-center py-12">
                No cars found for your account. <Link to="/add-car" className="text-orange-500 underline">Add a car</Link>.
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 pb-32 w-10/12">

            {/* Filter Options */}
            <div className="flex justify-between mb-4 mt-6">
                <h1 className="text-2xl font-bold">My Cars</h1>
                <label className="flex items-center space-x-2">
                    <span>Sort By:</span>
                    <select
                        onChange={(e) => {
                            const [field, order] = e.target.value.split("-");
                            updateFilter(field, order);
                        }}
                        value={`${filter.field}-${filter.order}`}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                        <option value="dateAdded-desc">Newest Date First</option>
                        <option value="dateAdded-asc">Oldest Date First</option>
                        <option value="dailyRentalPrice-desc">Highest Price First</option>
                        <option value="dailyRentalPrice-asc">Lowest Price First</option>
                    </select>
                </label>
            </div>


            {/* cars list in table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Image</th>
                            <th className="border border-gray-300 p-2">Brand</th>
                            <th className="border border-gray-300 p-2">Model</th>
                            <th className="border border-gray-300 p-2">Price/Day</th>
                            <th className="border border-gray-300 p-2">Availability</th>
                            <th className="border border-gray-300 p-2">Added Time</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tempCars.map((car) => {
                            return (
                                <tr key={car._id} className="border">
                                    <td className="border border-gray-300 p-2">
                                        <Link to={`/car/${car._id}`}>
                                            <img
                                                src={car.images && car.images[0]}
                                                alt={car.carModel}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </Link>
                                    </td>
                                    <td className="border border-gray-300 p-2">{car.carBrand}</td>
                                    <td className="border border-gray-300 p-2">{car.carModel}</td>
                                    <td className="border border-gray-300 p-2">BDT {car.dailyRentalPrice}</td>
                                    <td className="border border-gray-300 p-2">
                                        {car.availability ? "Available" : "Not Available"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {new Date(car.dateAdded).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 p-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(car)}
                                            className="text-orange-500 hover:underline"
                                        >
                                            <BsPencil />
                                        </button>
                                        <button
                                            onClick={() => setDeletingCar(car)}
                                            className="text-red-500 hover:underline"
                                        >
                                            <BsTrash />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingCar && (
                <div className="fixed inset-0  bg-black  backdrop-blur-sm dark:bg-opacity-50 bg-opacity-25 flex items-center justify-center">
                    <div className="dark:bg-inherit bg-white mt-16 p-8 backdrop-blur-sm rounded shadow-lg max-w-lg w-full max-h-[400px] overflow-x-hidden overflow-y-scroll">
                        <h2 className="text-lg font-bold mb-4">Edit Car</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block mb-2">Car Brand</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.carBrand}
                                    onChange={(e) =>
                                        setEditedFields({ ...editedFields, carBrand: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Car Model</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.carModel}
                                    onChange={(e) =>
                                        setEditedFields({ ...editedFields, carModel: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Daily Rental Price (BDT)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.dailyRentalPrice}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            dailyRentalPrice: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Availability</label>
                                <select
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.availability}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            availability: e.target.value === "true",
                                        })
                                    }
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Vehicle Registration Number</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.registrationNumber}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            registrationNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Features (comma-separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.features.join(", ")}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            features: e.target.value.split(",").map((f) => f.trim()),
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    value={editedFields.location}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            location: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded bg-inherit text-inherit"
                                    rows={3}
                                    value={editedFields.description}
                                    onChange={(e) =>
                                        setEditedFields({
                                            ...editedFields,
                                            description: e.target.value,
                                        })
                                    }
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Upload New Images</label>
                                <Dropzone
                                    onDrop={(acceptedFiles) => setNewImages(acceptedFiles)}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div
                                            {...getRootProps()}
                                            className="p-4 border-dashed border rounded text-center"
                                        >
                                            <input {...getInputProps()} />
                                            <p>Drag & drop some files here, or click to select files</p>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingCar(null)}
                                    className="bg-gray-300  mr-2 text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:gray-orange-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-orange-600  bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {deletingCar && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="dark:bg-inherit  bg-white  backdrop-blur-sm p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Delete Car</h2>
                        <p>Are you sure you want to delete this car?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setDeletingCar(null)}
                                className="bg-gray-300  mr-2  bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCars;
