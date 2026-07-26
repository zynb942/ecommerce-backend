const pc = require('picocolors')


require("dotenv").config();

const _config = require('./config/env')
const app = require("./app");
const connectionDB = require("./database/connection");


const PORT = _config.port || 5000;

connectionDB()

app.listen(PORT, () => {
    console.log(pc.magenta(`Server Running On Port: `) + pc.bold(pc.yellow(PORT)));
});