import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { Link, Links, useNavigate } from "react-router-dom";
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, Bar, Scatter, CartesianGrid, ResponsiveContainer, Line } from "recharts";

const MyBookings = ({ user, fetchMyBookings = async () => [], handleModifyBookingFromApp = async () => false, handleCancelBookingFromApp = async () => false }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [newEndDate, setNewEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [currentPopupCarPrice, setCurrentPopupCarPrice] = useState(0);
    const [updatingData, setUpdatingData] = useState(false);
    const [removingBooking, setRemovingBooking] = useState(false);
    const [confirmingBooking, setConfirmingBooking] = useState(false);
    const [myBookings, setMyBookings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [statsData, setStatsData] = useState(null);



    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login?next=%2fmy-bookings%2f");
        }
    }, [user]);
    if (!user) {
        navigate("/login?next=%2fmy-bookings%2f");
    }


    useEffect(() => {
        if (user && "_id" in user) {
            setMyBookings(bookings.filter(item => {
                return item.bookBy._id == user._id;
            }));
            setMyOrders(bookings.filter(item => {
                return item.carOwner._id == user._id;
            }));
        }

    }, [user, bookings]);


    useEffect(() => {
        if (myOrders.length > 0) {
            let tempData = [];
            myOrders.forEach(item => {
                if (!tempData.some(data => data._id === item.car._id)) {
                    tempData.push({
                        _id: item.car._id,
                        name: item.car.carModel,
                        price: item.car.dailyRentalPrice,
                        "total revenue": item.car.dailyRentalPrice * item.car.bookingCount,
                        numberOfBooking: item.car.bookingCount,
                    });
                }
            });
            setStatsData(tempData);
        } else {
            setStatsData(null);
        }
    }, [myOrders]);
    



    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchMyBookings();
                setBookings(data);
            } catch (error) {
                toast.error("Failed to fetch bookings");
            } finally {
                setIsLoading(false);
            }
        };
        loadBookings();
    }, [fetchMyBookings]);

    useEffect(() => {
        if (!selectedBooking) return;
        setTotalCostForPopup(newStartDate, newEndDate, selectedBooking.car.dailyRentalPrice);
    }, [newStartDate, newEndDate]);

    useEffect(() => {
        if (!selectedBooking) return;

        const updatedStartDate = new Date(selectedBooking.startDate).toISOString().split("T")[0];
        const updatedEndDate = new Date(selectedBooking.endDate).toISOString().split("T")[0];

        setNewStartDate(updatedStartDate);
        setNewEndDate(updatedEndDate);

        setTotalCostForPopup(updatedStartDate, updatedEndDate, selectedBooking.car.dailyRentalPrice);
    }, [selectedBooking]);


    const setTotalCostForPopup = (start, end, pricePerDay) => {

        setCurrentPopupCarPrice(calculateTotalCost(start, end, pricePerDay));
    };

    const calculateTotalCost = (start, end, pricePerDay) => {
        if (start && end && pricePerDay) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);
            if (endDateObj >= startDateObj) {
                const diffInTime = endDateObj.getTime() - startDateObj.getTime();
                const diffInDays = diffInTime / (1000 * 3600 * 24) + 1;
                const price = pricePerDay * diffInDays;
                const tax = price * 0.15;
                return price + tax;
            } else {
                toast.error("End Date should be greater than Start Date");
            }
        }
        return 0;
    };

    const handleStartDateChange = (e) => {
        setNewStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setNewEndDate(e.target.value);
    };


    const handleModifyBooking = async () => {
        if (new Date(newStartDate) == new Date(selectedBooking.startDate) && new Date(newEndDate == selectedBooking.endDate)) {
            toast.warning("No changes made!");
            return;
        }
        setUpdatingData(true);
        let res = await handleModifyBookingFromApp(selectedBooking._id, newStartDate, newEndDate);
        setUpdatingData(false);
        if (res) {
            toast.success("Booking modified successfully");
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === selectedBooking._id
                        ? { ...b, startDate: newStartDate, endDate: newEndDate } // Update only the dates
                        : b
                )
            );
            setShowModal(false);
            setNewStartDate(new Date().toISOString().split("T")[0]);
            setNewEndDate(new Date().toISOString().split("T")[0]);
        }
    };


    const handleCancelBooking = async () => {
        let res = await handleCancelBookingFromApp(selectedBooking._id, "cancelled");
        if (res) {
            setRemovingBooking(false);
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === selectedBooking._id
                        ? { ...b, bookingStatus: "cancelled" }
                        : b
                )
            );
            toast.success("Booking canceled successfully");
        }
    };


    const handleConfirmButton = async () => {
        let res = await handleCancelBookingFromApp(selectedBooking._id, "confirmed");
        if (res) {
            setConfirmingBooking(false);
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === selectedBooking._id
                        ? { ...b, bookingStatus: "confirmed" }
                        : b
                )
            );
            toast.success("Booking confirmed successfully");
        }
    };


    const TableUiForBookings = ({ bookings }) => {
        return (bookings.length > 0 ?
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 overflow-x-scroll">
                    <thead>
                        <tr className="">
                            <th className="border px-4 py-2">Car Image</th>
                            <th className="border px-4 py-2">Brand</th>
                            <th className="border px-4 py-2">Model</th>
                            <th className="border px-4 py-2">Booking Date</th>
                            <th className="border px-4 py-2">Total Price</th>
                            <th className="border px-4 py-2">Booking Status</th>
                            <th className="border px-4 py-2">Users (Booker/Owner)</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr
                                key={booking._id}
                                className={` ${booking.bookingStatus === "Canceled" ? "opacity-50" : ""
                                    }`}
                            >
                                <td className="border px-4 py-2">
                                    <Link to={`/car/${booking.car._id}`}>
                                        <img
                                            src={booking.car.images[0]}
                                            alt="Car"
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">{booking.car.carBrand || "unknown"}</td>
                                <td className="border px-4 py-2">{booking.car.carModel}</td>
                                <td className="border px-4 py-2">
                                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                                    {new Date(booking.endDate).toLocaleDateString()}
                                </td>
                                <td className="border px-4 py-2">
                                    $
                                    {calculateTotalCost(
                                        booking.startDate,
                                        booking.endDate,
                                        booking.car.dailyRentalPrice
                                    ).toFixed(2)}
                                </td>
                                <td className="border px-4 py-2">
                                    <font color={booking.bookingStatus == "cancelled" ? "gray" : booking.bookingStatus == "pending" ? "#ff980f" : booking.bookingStatus == "confirmed" ? "green" : "white"}>{booking.bookingStatus}</font>
                                </td>
                                <td className="border px-4 py-2">
                                    <div>
                                        {user._id != booking.carOwner._id && <div>
                                            <div className="text-xs">
                                                <span>Owned by:</span>
                                            </div>
                                            <div className="flex items-center center rounded-lg p-2 min-w-max  mb-0">
                                                <img
                                                    src={booking.carOwner.avatar}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover mr-1 border"
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-600">{booking.carOwner.name}</div>
                                                    <p className="text-xs text-gray-500">{user ? booking.carOwner.email : ((new String(booking.carOwner.email)).slice(0, 3) + "######@" + (new String(booking.carOwner.email)).split("@")[1])}</p>

                                                </div>
                                            </div>
                                        </div>}
                                        {user._id != booking.bookBy._id && <div>
                                            <div className="text-xs">
                                                <span>Booked by:</span>
                                            </div>
                                            <div className="flex items-center center  rounded-lg p-2 min-w-max  mb-0">
                                                <img
                                                    src={booking.bookBy.avatar}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover mr-1 border"
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-600">{booking.bookBy.name}</div>
                                                    <p className="text-xs text-gray-500">{user ? booking.bookBy.email : ((new String(booking.bookBy.email)).slice(0, 3) + "######@" + (new String(booking.bookBy.email)).split("@")[1])}</p>

                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                </td>
                                <td className="border p-2  w-[120px]">
                                    <div className="space-y-2 inline-grid items-center justify-center ">
                                        {((booking.bookingStatus == "pending")) &&
                                            <button
                                                className="cancel-btn bg-red-500 text-white px-4 py-2 rounded block items-center justify-center w-[120px] mx-auto "
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setRemovingBooking(true);
                                                }}
                                            >
                                                <div className="inline-flex items-center w-full ">
                                                    <FaTrashAlt className="mr-2" />
                                                    <span>Cancel</span>
                                                </div>
                                            </button>}
                                        {(user._id == booking.bookBy._id && booking.bookingStatus == "pending") &&
                                            <button
                                                className=" success-btn bg-orange-500 text-white px-4 py-2 rounded block items-center justify-center w-[120px] mx-auto"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <div className="inline-flex items-center w-full">
                                                    <FaCalendarAlt className="mr-2" />
                                                    <span>Modify</span>
                                                </div>
                                            </button>}
                                        {(user._id == booking.carOwner._id && booking.bookingStatus == "pending") &&
                                            <button
                                                className="success-btn bg-orange-700 text-white px-4 py-2 rounded block items-center justify-center w-[120px] mx-auto"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setConfirmingBooking(true);
                                                }}
                                            >
                                                <div className="inline-flex items-center w-full">
                                                    <FaCalendarAlt className="mr-2" />
                                                    <span>Confirm</span>
                                                </div>
                                            </button>}
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-sm">
                    * You can update date of booking only if the status is pending, you can cancel any booking if the status is pending or confirmed and you can confirm a booking if the car is yours or added by you.
                </div>
            </div>
            : "No booked your car yet. A table with booked car and one statistic of rechar will appear if user started to book your cars.")
    }



    if (isLoading) return (<div className="flex justify-center items-center h-[70vh]">
        <div className="grid items-center space-x-4">
            <div className="p-4">
                <HashLoader className="mx-auto " color="#f97316" />
            </div>
            <div>
                <div className="text-2xl font-semibold">Loading Bookings...</div>
            </div>
        </div>
    </div>);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 mt-8">My Orders</h1>
            <TableUiForBookings bookings={myOrders} />
            <h1 className="text-3xl font-bold mb-6 mt-8">My Bookings</h1>
            <TableUiForBookings bookings={myBookings} />


            {statsData != null && <div className="w-full">
                <div className="text-3xl font-bold mb-6 mt-8">
                    <span>My Orders Statistics</span>
                </div>
                <div className=" mx-auto">
                    <ResponsiveContainer height={400}>
                        <ComposedChart data={statsData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="name" fontSize={9} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="total revenue" fill="#8884d8" stroke="#8884d8" activeDot={{ r: 8 }}/>
                            <Line dataKey="price" barSize={10} fill="#413ea0" activeDot={{ r: 8 }}/>
                            <Scatter dataKey="numberOfBooking" fill="#ff7300" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>}
            
            <br /><br /><br /><br />


            {showModal && (
                <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50">
                    <div className="dark:bg-inherit bg-white p-8 rounded-lg w-96">
                        <h3 className="text-2xl font-semibold">Select Dates</h3>
                        <div className="mt-4">
                            <label htmlFor="startDate" className="block text-sm">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={newStartDate}
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
                                value={newEndDate}
                                onChange={handleEndDateChange}
                                min={newStartDate}
                                className="mt-2 p-2 border rounded w-full bg-inherit"
                            />
                        </div>
                        <div className="mt-4">
                            <p className="text-lg">Total Cost (with 15% tax): ${currentPopupCarPrice.toFixed(2)}</p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            {updatingData ? (<HashLoader color="green" />) :
                                (<><button
                                    className="px-6 py-2 bg-gray-400 text-white rounded-lg cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                    <button
                                        className="px-6 py-2 bg-orange-600 text-white rounded-lg success-btn"
                                        onClick={handleModifyBooking}
                                    >
                                        Update Booking
                                    </button></>)}
                        </div>
                    </div>
                </div>
            )}



            {removingBooking && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="dark:bg-inherit  bg-white  backdrop-blur-sm p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Cancel booking</h2>
                        <p>Are you sure you want to cancel this booking?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setRemovingBooking(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2  cancel-btn"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                className="px-4 py-2 bg-red-600 text-white rounded success-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmingBooking && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="dark:bg-inherit  bg-white  backdrop-blur-sm p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirm booking</h2>
                        <p>Are you sure you want to confirm this booking?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setConfirmingBooking(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2 cancel-btn"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleConfirmButton}
                                className="px-4 py-2 bg-red-600 text-white rounded success-btn"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default MyBookings;
