const config = require("./utils/config");
const logger = require("./utils/logger");
const app=require('./app')

app.listen(config.PORT || 3001, () => {
    logger.info(`Server running on port ${config.PORT}`)
});