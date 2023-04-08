const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

//* Middleware
app.use(cors());
app.use(bodyParser.json());

//*Import routes
const authRoutes = require("./routes/users");
const movieShowsRoutes = require("./routes/movieShows");

//* for checking backend is working or not
app.get("/", (req, res) => {
  res.status(200).send("API is running properly");
});
//*Route middlewares
app.use("/api/user", authRoutes);
app.use("/api/movies", movieShowsRoutes);

//* Connect to DB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

//* Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
