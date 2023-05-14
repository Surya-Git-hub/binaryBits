const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./routes/userRoutes");

const app = express();


app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;



app.use('/api/user',userRouter);

// app.use('/api/workouts',workoutRouter);

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});