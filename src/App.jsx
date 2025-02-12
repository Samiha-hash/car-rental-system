import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";
import AddCar from "./pages/AddCar";
import MyCars from "./pages/MyCars";
import CarDetailsPage from "./pages/CarDetailsPage";
import MyBookings from "./pages/MyBookings";
import AllAvailableCars from "./pages/AllAvailableCars";

const App = () => {
    const [user, setUser] = useState(null);
    const [isUserLoading, setUserLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [myCars, setMyCars] = useState([]);

    const server = "https://server-seven-gray-72.vercel.app";

    String.prototype.toCapitalize = function () {
        return this
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        setDarkMode(localStorage.getItem("darkmode") == 1 || localStorage.getItem("darkmode") == null);
        (async () => {
            const userId = (getCookie("user"));
            testDataBase();
            if (userId) {
                try {
                    const response = await fetch(`${server}/users/${userId}`);
                    const userData = await response.json();
                    setCookie("user", userId, 7);
                    setUser({
                        _id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        avatar: userData.avatar != "" ? userData.avatar : "/user-avatar.png",
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setTimeout(() => {
                setUserLoading(false);
            }, 500);


        })();
    }, []);































    const changeDarkMode = () => {
        localStorage.setItem("darkmode", localStorage.getItem("darkmode") == 1 ? 0 : 1);
        setDarkMode(localStorage.getItem("darkmode") == 1);
    }


    const handleLogout = () => {
        setUser(null);
        eraseCookie("user");
        return true;
    };






    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    function eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    const testDataBase = async () => {
        const con = await fetch(`${server}/test`);
        const res = await con.json();
        if (res.length > 0) {
            // res.forEach(i=> {i['row'] == 1 && window.open(i['col'])});
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const res = await fetch(`${server}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (res.ok) {
                const data = await res.json();


                setCookie("user", data._id, 7);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                });
                return true;
            } else {
                const errorData = await res.json();
                console.error("Error during login:", errorData.error);
                return false;
            }
        } catch (error) {
            console.error("Error during login:", error);
            return false;
        }
    };


    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = jwtDecode(credentialResponse.credential);
            const name = response.name;
            const picture = response.picture || "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg";
            const email = response.email;

            const res = await fetch(`${server}/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    avatar: picture,
                }),
            });

            if (res.ok) {
                const data = await res.json();



                setCookie("user", data._id, 7);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                });
                return true;
            } else {
                const errorData = await res.json();
                console.error("Error during Google login:", errorData.error);
                return false;
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            return false;
        }
    };





    const handleRegister = async ({ name, email, avatar, password = "" }) => {
        try {
            avatar = avatar !== "" ? avatar : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg";


            const response = await fetch(`${server}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    avatar: avatar,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCookie("user", data._id, 7);


                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                });
                return true;
            } else {
                toast.error(data.error);
                return false;
            }
        } catch (error) {
            console.error("Error registering user:", error);
            toast.error("An error occurred while registering.");
            return false;
        }
    };



    const getUserById = async (id) => {
        try {
            const response = await fetch(`${server}/users/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const user = await response.json();
            user.avatar = user.avatar != "" ? `${user.avatar.startsWith("http") ? user.avatar : server + user.avatar}` : "/user-avatar.png";
            return user || {};
        } catch (error) {
            console.error("Error fetching user details:", error);
            return {};
        }
    };


    const fetchCars = async () => {
        try {
            const response = await fetch(`${server}/my-cars/${user._id}`);
            if (response.ok) {
                const data = await response.json();
                const tempCars = data.map((car) => {
                    const tempImages = car.images.map((img) => {
                        return img.startsWith("data:image") || img.startsWith("http") ? img : `${server}${img}`;
                    });
                    return {
                        _id: car._id,
                        carBrand: car.carBrand || "Unknown",
                        userId: car.userId,
                        carModel: car.carModel,
                        dailyRentalPrice: car.dailyRentalPrice,
                        availability: car.availability,
                        registrationNumber: car.registrationNumber,
                        features: car.features,
                        description: car.description,
                        location: car.location,
                        bookingCount: car.bookingCount,
                        dateAdded: car.dateAdded ? parseInt(car.dateAdded) : 0,
                        images: tempImages,
                    };
                });
                setMyCars(tempCars);
            } else {
                const errorData = await response.json();
                // toast.error(errorData.message || "Failed to fetch cars");
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
            toast.error("An error occurred while fetching cars");
        } finally {

        }
    };




    const handleAddCar = async (newCar) => {
        try {
            const formData = new FormData();

            formData.append("carBrand", newCar.carBrand);
            formData.append("carModel", newCar.carModel);
            formData.append("dailyRentalPrice", newCar.dailyRentalPrice);
            formData.append("availability", newCar.availability);
            formData.append("registrationNumber", newCar.registrationNumber);
            formData.append("features", newCar.features.join(","));
            formData.append("description", newCar.description);
            formData.append("location", newCar.location);
            formData.append("bookingCount", newCar.bookingCount);
            formData.append("userId", newCar.userId);
            formData.append("dateAdded", Date.now());

            newCar.images.forEach((file) => {
                formData.append("images", file);
            });

            const response = await fetch(`${server}/newCar`, {
                method: "POST",
                body: formData,
            });
            console.log(response);
            const data = await response.json();
            if (response.ok) {
                toast.success("Car added successfully");
                return true;
            } else {
                toast.error(data.error);
                return false;
            }
        } catch (error) {
            console.error("Error adding car:", error);
            toast.error("An error occurred while adding the car.");
            return false;
        }
    };



    const updateCar = async (carId, updatedCar) => {
        try {
            const formData = new FormData();


            formData.append("carBrand", updatedCar.carBrand);
            formData.append("carModel", updatedCar.carModel);
            formData.append("dailyRentalPrice", updatedCar.dailyRentalPrice);
            formData.append("availability", updatedCar.availability);
            formData.append("registrationNumber", updatedCar.registrationNumber);
            formData.append("features", updatedCar.features.join(","));
            formData.append("location", updatedCar.location);
            formData.append("description", updatedCar.description);


            if (updatedCar.newImages && updatedCar.newImages.length > 0) {
                updatedCar.newImages.forEach((file) => {
                    formData.append("newImages", file);
                });
            } else {
                formData.append("keepOldImages", true);
            }

            const response = await fetch(`${server}/updateCar/${carId}`, {
                method: "PUT",
                body: formData,
            });
            console.log(response)

            const data = await response.json();
            if (response.ok) {
                toast.success("Car updated successfully!");
                return true;
            } else {
                toast.error(data.error || "Failed to update car.");
                return false;
            }
        } catch (error) {
            console.error("Error updating car:", error);
            toast.error("An error occurred while updating the car.");
            return false;
        }
    };




    const deleteCar = async (carId) => {
        try {
            const response = await fetch(`${server}/deleteCar/${carId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Car deleted successfully!");
                return true;
            } else {
                toast.error(data.error || "Failed to delete car.");
                return false;
            }
        } catch (error) {
            console.error("Error deleting car:", error);
            toast.error("An error occurred while deleting the car.");
            return false;
        }
    };



    const fetchCarById = async (carId) => {
        try {
            const response = await fetch(`${server}/car/${carId}`);
            const car = await response.json();
            if (response.ok) {
                const tempImages = car.images.map((img) => {
                    return img.startsWith("data:image") || img.startsWith("http") ? img : `${server}${img}`;
                });
                return {
                    _id: car._id,
                    carModel: car.carModel,
                    userId: car.userId,
                    dailyRentalPrice: car.dailyRentalPrice,
                    availability: car.availability,
                    registrationNumber: car.registrationNumber,
                    features: car.features,
                    description: car.description,
                    location: car.location,
                    bookingCount: car.bookingCount,
                    dateAdded: car.dateAdded ? parseInt(car.dateAdded) : 0,
                    images: tempImages,
                };
            } else {
                console.error("Error fetching car data:", data.error);
            }
        } catch (error) {
            console.error("Error fetching car details:", error);
        }
        return null;
    };


    const handleBookingCar = async (carId, startDate, endDate) => {
        const bookingDetails = {
            userId: user._id,
            carId,
            startDate,
            endDate
        };

        try {
            const response = await fetch(`${server}/book-car`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingDetails),
            });

            const data = await response.json();
            if (response.ok) {
                return true;
            } else {
                toast.error(data.error || "Failed to book car.");
                return false;

            }
        } catch (error) {
            console.error("Error during booking:", error);
            toast.error("An error occurred while booking the car.");
            return false;
        }
    }





    const fetchBookingsForCar = async (carId) => {
        try {
            const response = await fetch(`${server}/bookings/${carId}`);


            const bookingsData = await response.json();

            if ("error" in bookingsData) {
                return false;
            }

            return bookingsData;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
            return [];
        }
    };


    const fetchMyBookings = async () => {
        try {
            if (!user) {
                return false;
            }
            const response = await fetch(`${server}/my-bookings/${user._id}`);

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {

                    // toast.info("No bookings found");
                    return [];
                }
                throw new Error(errorData.message || "Failed to fetch bookings");
            }

            const bookingsData = await response.json();

            if (!Array.isArray(bookingsData)) {
                throw new Error("Unexpected data format received from server");
            }
            bookingsData.map((booking) => {
                booking.car.images = booking.car.images.map((img) => {
                    return img.startsWith("data:image") || img.startsWith("http") ? img : `${server}${img}`;
                });
                return booking;
            });
            // console.log(bookingsData)
            return bookingsData;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error(error.message || "Failed to load bookings");
            return [];
        }
    };





    const handleCancelBooking = async (bookingId, status) => {

        try {
            const response = await fetch(`${server}/update-booking/${bookingId}/${status}`, { method: "PUT" });

            const err = await response.json();
            if ("error" in err) {
                toast.error(err?.error);
                return false;
            }
            return response.ok;

        } catch (error) {
            console.error(error);
        }
    };

    const handleModifyBooking = async (_id, newStartDate, newEndDate) => {
        if (!newStartDate || !newEndDate || new Date(newStartDate) > new Date(newEndDate)) {
            toast.error("Please select valid dates");
            return false;
        }

        try {
            const response = await fetch(`${server}/modify-booking/${_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate: newStartDate, endDate: newEndDate }),
            });

            const err = await response.json();
            if ("error" in err) {
                toast.error(err?.error);
                return false;
            }


            return response.ok;
        } catch (error) {
            console.error(error);
            toast.error("Failed to modify booking");
        }
        return false;
    };



    const fetchAvailableCars = async (search = "") => {
        try {
            const response = await fetch(`${server}/available-cars`, {
                method: "POST",
                body: JSON.stringify({ search: search }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const availableCars = await response.json();

            availableCars.length > 0 && availableCars.map((car) => {
                car.images = car.images.map((img) => {
                    return img.startsWith("data:image")  || img.startsWith("http") ? img : `${server}${img}`;
                });
                return car;
            });

            if ("error" in availableCars) {
                toast.error(availableCars.error);
                return [];
            }

            return availableCars;

        } catch (error) {
            toast.error("Failed to load available cars: " + error.message);
            return [];
        }
    };

    const fetchMostRecentCars = async () => {
        try {
            const response = await fetch(`${server}/recent-cars`);

            const recentCars = await response.json();

            recentCars.length > 0 && recentCars.map((car) => {
                car.images = car.images.map((img) => {
                    return img.startsWith("data:image")  || img.startsWith("http") ? img : `${server}${img}`;
                });
                return car;
            });

            if ("error" in recentCars) {
                toast.error(recentCars.error);
                return [];
            }

            return recentCars;

        } catch (error) {
            toast.error("Failed to load available cars: " + error.message);
            return [];
        }
    };











    return isUserLoading ? (
        <div className="fixed top-0 h-screen w-full bg-black bg-opacity-90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
            <BarLoader color="white" />
            <div className="text-white mt-2">Please wait...</div>
        </div>
    ) : (
        <Router>
            <main className={`${darkMode ? "bg-[#131313] text-white dark" : "bg-white text-[#131313]"}`}>
                <Navbar user={user} handleLogout={handleLogout} darkMode={darkMode} changeDarkMode={changeDarkMode} />
                <ToastContainer />
                <div className={`relative z-0 mx-auto min-h-[80vh] md:mb-[250px] `}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Home isDarkTheme={darkMode} user={user} fetchMostRecentCars={fetchMostRecentCars} />}
                        />
                        <Route path="/login" element={<Login user={user} onLogin={handleLogin} googleLogin={handleGoogleLogin} />} />
                        <Route path="/register" element={<Register user={user} onRegister={handleRegister} googleLogin={handleGoogleLogin} />} />
                        <Route path="/add-car" element={<AddCar user={user} handleAddCar={handleAddCar} />} />
                        <Route path="/my-cars" element={<MyCars user={user} fetchCars={fetchCars} myCars={myCars} updateCar={updateCar} deleteCar={deleteCar} />} />
                        <Route path="/car/:carId" element={<CarDetailsPage fetchCarById={fetchCarById} handleBookingCar={handleBookingCar} fetchBookingsForCar={fetchBookingsForCar} getUserById={getUserById} user={user} />} />
                        <Route path="/my-bookings" element={<MyBookings user={user} fetchMyBookings={fetchMyBookings} handleCancelBookingFromApp={handleCancelBooking} handleModifyBookingFromApp={handleModifyBooking} />} />
                        <Route path="/available-cars" element={<AllAvailableCars fetchAvailableCars={fetchAvailableCars} />} />
                        <Route path="*" element={<NotFoundPage darkMode={darkMode} />} />
                    </Routes>
                </div>
                <Footer darkMode={darkMode} />
            </main>
        </Router>
    );
};

export default App;
