const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.enable('trust proxy');
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());
app.use('/api/user', userRouter);

// app.use('/api/workouts',workoutRouter);

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});
