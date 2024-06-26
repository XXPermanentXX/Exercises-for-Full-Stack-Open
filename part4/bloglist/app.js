const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter=require('./controllers/blogs')


mongoose.set("strictQuery", false);
logger.info('Connecting to', config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL).then(() => {
    logger.info("Connected to MongoDB")
}).catch((error)=>{
    logger.error("Error connecting to MongoDB:", error.message)
})

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app;
