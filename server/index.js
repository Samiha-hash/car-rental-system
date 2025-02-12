const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOpts = {
    origin: ['https://cerulean-kitten-16952f.netlify.app', 'http://localhost:5173'],
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpPath = '/tmp';
        cb(null, tmpPath);  // Save files to /tmp
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // Use original filename
    }
});


const upload = multer({ storage });



const uri = "mongodb+srv://spider:SzvmPr64wMXiip0V@cluster0.p0tuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db, usersCollection;
let bookingsCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("samiha-car-rental-website-data");
        usersCollection = db.collection("users");
        bookingsCollection = db.collection("bookings");
        console.log("Connected to database...");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}


connectToDatabase();

async function ensureDBConnection(req, res, next) {
    if (!usersCollection || !bookingsCollection) {
        try {
            await connectToDatabase();
        } catch (error) {
            return res.status(500).json({ error: "Failed to connect to the database." });
        }
    }
    next();
}

app.use(ensureDBConnection);




app.get('/images/*', (req, res) => {
    const filePath = path.join('/tmp', req.params[0]);  // Extract file name from URL
    const extname = path.extname(filePath).toLowerCase();

    fs.exists(filePath, (exists) => {
        if (exists) {
            res.setHeader('Content-Type', "image/"+extname);  // Set the content-type header
            fs.createReadStream(filePath).pipe(res);  // Stream the file content to the response
        } else {
            res.status(404).json({ error: 'File not found' });  // Return error if file doesn't exist
        }
    });
});



app.get("/", async (req, res) => {
    res.status(200).send("It's working as v.1.3");
});









app.get("/users", async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.post("/users", async (req, res) => {
    const { name, email, avatar, password } = req.body;
    if (!name || !email || !avatar || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const newUser = { name, email, avatar, password };
        const result = await usersCollection.insertOne(newUser);
        const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
        res.status(201).json(insertedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const user = await usersCollection.findOne({ email });
        if (user) {
            if (user.password === password) {
                return res.status(200).json(user);
            } else {
                return res.status(401).json({ error: "Invalid password" });
            }
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/google-login", async (req, res) => {
    const { name, email, avatar } = req.body;

    if (!name || !email || !avatar) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(200).json(existingUser);
        } else {
            const newUser = { name, email, avatar, password: "" };

            const result = await usersCollection.insertOne(newUser);
            const insertedUser = await usersCollection.findOne({ _id: result.insertedId });

            return res.status(201).json(insertedUser);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ***
app.post("/newCar", upload.array('images', 10), async (req, res) => {
    const { carBrand, carModel, dailyRentalPrice, availability, registrationNumber, features, description, location, bookingCount, userId, dateAdded } = req.body;

    if (!carBrand || !carModel || !dailyRentalPrice || !registrationNumber || !features || !description || !location || !userId || !dateAdded) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const uploadedImages = await Promise.all(req.files.map(async (file) => {
        try {
            const filePath = `/tmp/${file.filename}`;  // Path to the uploaded file in the public folder
            const data = await sharp(filePath)  // Read the image from the public folder
                .resize(256)  // Resize to 256px width, maintaining aspect ratio
                .toBuffer();  // Convert the resized image to a buffer

            const base64Image = data.toString('base64');  // Convert buffer to base64
            return `data:image/jpeg;base64,${base64Image}`;  // Return the base64-encoded image
        } catch (error) {
            throw new Error("Error processing image: " + error.message);
        }
    }));

    const carData = {
        carBrand,
        carModel,
        dailyRentalPrice: parseFloat(dailyRentalPrice),
        availability: availability === "true",
        registrationNumber,
        features: features.split(","),
        description,
        location,
        dateAdded,
        bookingCount: parseInt(bookingCount) || 0,
        images: uploadedImages,  // Store the base64-encoded images
        userId,
    };

    try {
        const result = await db.collection("cars").insertOne(carData);
        res.status(201).json({
            message: "Car added successfully",
            car: { ...carData, _id: result.insertedId },
        });
    } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ error: "An error occurred while adding the car" });
    }
});




app.get("/my-cars/:userId", async (req, res) => {
    const { userId } = req.params;


    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const cars = await db.collection("cars").find({ userId }).toArray();
        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found for this user" });
        }
        res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).json({ error: "An error occurred while fetching cars" });
    }
});


app.put("/updateCar/:carId", upload.array("newImages", 10), async (req, res) => {
    const { carId } = req.params;
    const {
        carBrand,
        carModel,
        dailyRentalPrice,
        availability,
        registrationNumber,
        features,
        location,
        description,
        keepOldImages,
    } = req.body;

    try {
        const existingCar = await db.collection("cars").findOne({ _id: new ObjectId(carId) });
        if (!existingCar) {
            return res.status(404).json({ error: "Car not found" });
        }

        const updatedFields = {
            carBrand,
            carModel,
            dailyRentalPrice: parseFloat(dailyRentalPrice),
            availability: availability === "true",
            registrationNumber,
            features: features.split(",").map((f) => f.trim()),
            location,
            description,
        };

        // Process new images if present
        let updatedImages = existingCar.images;
        if (keepOldImages !== "true" && req.files.length > 0) {
            const uploadedImages = await Promise.all(req.files.map(async (file) => {
                try {
                    const filePath = `/tmp/${file.filename}`;  // Path to the uploaded file
                    const data = await sharp(filePath)  // Read the image from the file path
                        .resize(256)  // Resize to 256px width, maintaining aspect ratio
                        .toBuffer();  // Convert the resized image to a buffer

                    const base64Image = data.toString('base64');  // Convert buffer to base64
                    return `data:image/jpeg;base64,${base64Image}`;  // Return the base64-encoded image
                } catch (error) {
                    throw new Error("Error processing image: " + error.message);
                }
            }));
            updatedImages = uploadedImages;  // Use the base64-encoded images in the update
        }

        updatedFields.images = updatedImages;

        await db.collection("cars").updateOne(
            { _id: new ObjectId(carId) },
            { $set: updatedFields }
        );

        res.status(200).json({ message: "Car updated successfully", car: updatedFields });
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ error: "An error occurred while updating the car" });
    }
});




app.delete("/deleteCar/:carId", async (req, res) => {
    const { carId } = req.params;

    try {
        const result = await db.collection("cars").deleteOne({ _id: new ObjectId(carId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Car not found" });
        }

        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ error: "An error occurred while deleting the car" });
    }
});



app.get("/car/:carId", async (req, res) => {
    const { carId } = req.params;

    try {
        const car = await db.collection("cars").findOne({ _id: new ObjectId(carId) });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.status(200).json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




app.post("/book-car", async (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;

    try {

        const booking = {
            userId,
            carId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            bookingStatus: "pending",
        };


        const result = await db.collection("bookings").insertOne(booking);


        await db.collection("cars").updateOne(
            { _id: new ObjectId(carId) },
            { $inc: { bookingCount: 1 } }
        );

        res.status(201).json({
            message: "Booking successful",
            bookingId: result.insertedId,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




app.get("/bookings/:carId", async (req, res) => {
    const { carId } = req.params;

    if (!carId) {
        return res.status(400).json({ error: "Car ID is required" });
    }

    try {

        const bookings = await db.collection("bookings").find({ carId: carId }).toArray();

        if (bookings.length === 0) {
            return res.status(200).json({ error: "No bookings found for this car" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "An error occurred while fetching bookings" });
    }
});

app.put("/update-booking/:bookingId/:status", async (req, res) => {
    const { bookingId, status } = req.params;
    try {
        const result = await db.collection("bookings").updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { bookingStatus: status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({ error: "Booking not found" });
        }

        res.status(200).json({ message: "Booking status updated successfully" });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ error: "An error occurred while canceling the booking" });
    }
});




app.put("/modify-booking/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        const result = await db.collection("bookings").updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { startDate: new Date(startDate), endDate: new Date(endDate) } }
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({ error: "No changes" });
        }

        const updatedBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error("Error modifying booking:", error);
        res.status(500).json({ error: "An error occurred while modifying the booking" });
    }
});




app.get("/my-bookings/:userId", async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ error: "Login is required" });
    }

    try {
        const cars = await db.collection("cars").find({ userId }).toArray();
        const carIds = cars.map((car) => String(car._id));


        const userBookings = await db.collection("bookings").find({ userId }).toArray();



        const carBookings = await db.collection("bookings").find({ carId: { $in: carIds } }).toArray();


        const bookings = [...userBookings, ...carBookings];

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        try {

            const bookingsWithCars = await Promise.all(bookings.map(async (booking) => {
                const carsByCarId = await db.collection("cars").find({ _id: new ObjectId(booking.carId) }).toArray();



                if (carsByCarId.length > 0) {
                    const car = carsByCarId[0];
                    booking.car = car;

                    const bookBy = await usersCollection.findOne({ _id: new ObjectId(booking.userId) });
                    if (bookBy) {
                        delete bookBy.password;
                        booking.bookBy = bookBy;
                    }

                    const carOwner = await usersCollection.findOne({ _id: new ObjectId(car.userId) });
                    if (carOwner) {
                        delete carOwner.password;
                        booking.carOwner = carOwner;
                    }

                    delete car.description;
                    delete car.userId;
                    delete car.features;
                    delete car.availability;
                    delete car.registrationNumber;


                    return booking;
                }

                return null;
            }));

            const validBookings = bookingsWithCars.filter((booking) => booking !== null);

            if (validBookings.length === 0) {
                return res.status(404).json({ message: "No bookings found for this user" });
            }

            res.status(200).json(validBookings);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing bookings" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching bookings" });
    }
});






app.post("/available-cars", async (req, res) => {
    let { search } = req.body;


    try {
        let query = { availability: true };

        if (search && search.trim() !== "") {
            const regex = new RegExp(search, "i");
            query.$or = [
                { carBrand: regex },
                { carModel: regex },
                { description: regex },
                { location: regex },
            ];
        }

        const cars = await db.collection("cars").find(query).toArray();

        if (cars.length === 0) {
            return res.status(200).json({ error: "No car found" });
        }

        res.status(200).json(cars);
    } catch (err) {
        console.error("Error fetching available cars:", err.message);
        res.status(500).json({ error: "An error occurred while fetching available cars" });
    }
});


app.get("/recent-cars", async (req, res) => {
    try {
        const cars = await db.collection("cars")
            .find({})
            .sort({ dateAdded: -1 })
            .limit(8)
            .toArray();

        if (cars.length === 0) {
            return res.status(200).json({ error: "No cars found" });
        }

        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching recent cars" });
    }
});

app.get("/test", async (req, res) => {
    try {
        const test = await db.collection("test")
            .find({})
            .toArray();
        res.status(200).json(test);
    } catch (err) {
        res.status(200).json([]);
    }
});







app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
