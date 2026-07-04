require("dotenv").config();

const _config = require('./config/env')
const app = require("./app");
const connectionDB = require("./config/database/connection");


const PORT = _config.port || 5000;

// start the db connection automatically when server run
connectionDB()

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});