import React, { useState, useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Zoom, Fade } from "react-slideshow-image";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

const CarDetailsPage = ({ user = {}, fetchCarById = async (carId) => { }, handleBookingCar = async (carId) => { }, fetchBookingsForCar = async (carId) => { return [] }, getUserById = async () => { } }) => {
    const { carId } = useParams();
    const [car, setCar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [totalCost, setTotalCost] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [reviewerData, setReviewerData] = useState({});
    const [canBook, setCanBook] = useState(false);
    const [myPost, setMyPost] = useState(false);
    const [myBooked, setMyBooked] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        fetchCarById(carId).then((data) => {
            setCar(data);
        });
    }, [carId]);

    useEffect(() => {
        fakeFetchingByCar();
    }, [user]);


    useEffect(() => {
        setCanBook(!myPost)
    }, [myPost, myBooked])


    useEffect(() => {
        if (car && "userId" in car) {
            (async () => {
                const reviewerData = await getUserById(car.userId);
                if (user && "_id" in user) {
                    setMyPost(reviewerData._id == user._id);
                }
                setReviewerData(reviewerData);
            })();
        }
    }, [car]);

    useEffect(() => {
        calculateTotalCost(startDate, endDate);
    }, [startDate, endDate]);


    const fakeFetchingByCar = () => {
        if (user && "_id" in user) {
            fetchBookingsForCar(carId).then((data) => {
                let flag = false;
                data.length > 0 && data.forEach(item => {
                    if (item.userId == user._id) {
                        flag = true;
                        return;
                    }
                });
                setMyBooked(flag);
                setBookings(data);
            });
        }
    }

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const calculateTotalCost = (start, end) => {
        if (start && end && car) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);
            if (endDateObj >= startDateObj) {
                const diffInTime = endDateObj.getTime() - startDateObj.getTime();
                const diffInDays = diffInTime / (1000 * 3600 * 24) + 1;
                const price = car.dailyRentalPrice * diffInDays;
                const tax = price * 0.15;
                setTotalCost(price + tax);
            } else {
                toast.error("End Date should be greater than Start Date");
                setTotalCost(0);
            }
        }
    };

    const handleBooking = async () => {
        if (!canBook) {
            return;
        }
        if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) {
            toast.error("Please select valid start and end dates.");
            return;
        } else {
            const result = await handleBookingCar(carId, startDate, endDate);
            if (result) {
                toast.success("Car Booked Successfully");
                fakeFetchingByCar();
                setShowModal(false);
                setMyBooked(true);
                navigate("/my-bookings");
            }
        }
    };

    if (!car) return (<div className="flex justify-center items-center h-[70vh]">
        <div className="grid items-center space-x-4">
            <div className="p-4">
                <HashLoader color="#f97316" className="mx-auto" />
            </div>
            <div>
                <div className="text-2xl font-semibold">Loading Car Details...</div>
            </div>
        </div>
    </div>);

    return (
        <div className="mx-auto">
            {/* Slideshow */}
            <section className="overflow-hidden mt-8 shadow-2xl w-10/12 mx-auto px-8">
                <Fade
                    prevArrow={
                        <button className="absolute left-4 mx-8 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/50 text-white hover:bg-black/70 transition-all duration-300 rounded-full">
                            <GrPrevious className="w-6 h-6" />
                        </button>
                    }
                    nextArrow={
                        <button className="absolute right-4 mx-8 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/50 text-white hover:bg-black/70 transition-all duration-300 rounded-full">
                            <GrNext className="w-6 h-6" />
                        </button>
                    }
                    duration={1000}
                >
                    {car.images.map((img, i) => (
                        <div key={i} className="relative h-[400px]">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg "
                                style={{ backgroundImage: `url('${img}')` }}
                            />
                        </div>
                    ))}
                </Fade>
            </section>

            {/* Car Details */}
            <div className="bg-inherit rounded-lg p-8 space-y-6 w-10/12 mx-auto pb-32">
                <h2 className="text-4xl font-bold">{car.carModel}</h2>
                <div className="flex items-center space-x-4">
                    <p className="text-2xl font-semibold text-orange-600">${car.dailyRentalPrice}/day</p>
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${car.availability ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                            }`}
                    >
                        {car.availability ? "Available" : "Not Available"}
                    </span>
                </div>
                {car.bookingCount > 0 && <div className="font-semibold">Booking Count: {car.bookingCount}</div>}
                {("avatar" in reviewerData ? (<div className="flex items-center center bg-white dark:bg-black rounded-lg p-2 max-w-max  mb-0">
                    <img
                        src={reviewerData.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover mr-1 border"
                    />
                    <div>
                        <div className="text-sm font-semibold text-gray-600">{reviewerData.name}</div>
                        <p className="text-xs text-gray-500">{user ? reviewerData.email : ((new String(reviewerData.email)).slice(0, 3) + "######@" + (new String(reviewerData.email)).split("@")[1])}</p>

                    </div>
                </div>
                ) : <HashLoader />)}
                
                <div>
                    <h3 className="text-2xl font-semibold mb-2 mt-8">Features</h3>
                    <ul className="grid grid-cols-2 gap-4">
                        {car.features.map((f, i) => (
                            <li key={i} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                <span className="text-gray-600 dark:text-slate-300">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full">
                    <h3 className="text-2xl font-semibold mb-2 mt-8">Description</h3>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-justify break-words">
                        {car.description}
                    </p>
                </div>

                {/* Show Bookings */}
                <div className="mt-8">
                    {bookings.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Already Book Dates</h3>
                            <ol className="space-y-4 list-decimal pl-4">
                                {bookings.map((booking, index) => (
                                    <li key={index} className="text-sm ">
                                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
                {(canBook && user && "_id" in user) &&
                    <button
                        className="w-full md:w-auto px-8 py-4 bg-orange-600 text-white  hover:bg-orange-700 transition-colors duration-300 transform hover:scale-105  bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm text-center mt-4 me-2 mb-4  inline-block"
                        onClick={() => {
                            if (canBook) {
                                setShowModal(true)
                            }
                        }}
                    >
                        Book Now
                    </button>}
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50">
                    <div className="dark:bg-inherit bg-white p-8 rounded-lg w-96">
                        <h3 className="text-2xl font-semibold">Select Dates</h3>
                        <div className="mt-4">
                            <label htmlFor="startDate" className="block text-sm">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={handleStartDateChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="mt-2 p-2 border rounded w-full bg-inherit"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="endDate" className="block text-sm">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={handleEndDateChange}
                                min={startDate}
                                className="mt-2 p-2 border rounded w-full bg-inherit"
                            />
                        </div>
                        <div className="mt-4">
                            <p className="text-lg">Total Cost (with 15% tax): ${totalCost.toFixed(2)}</p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg"
                                onClick={handleBooking}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetailsPage;
