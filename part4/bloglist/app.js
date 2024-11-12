require('express-async-errors')
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter=require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express();


mongoose.set("strictQuery", false);
logger.info('Connecting to', config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL).then(() => {
    logger.info("Connected to MongoDB")
}).catch((error)=>{
    logger.error("Error connecting to MongoDB:", error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter);


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;
