const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware=require('./utils/middleware')
const express = require('express');
const app = express();
const cors = require('cors');
const peopleRouter=require('./controllers/people')
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info('Connecting to', config.MONGODB_URL)

mongoose
    .connect(config.MONGODB_URL)
    .then((result) => {
        logger.info("Connected to MongoDB")

    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error.message)
    });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger)

app.use('/api/people', peopleRouter)

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app