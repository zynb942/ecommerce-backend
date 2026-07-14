
const mongoose = require('mongoose')
const _config = require('../config/env')
const pc = require('picocolors')


//#region Database Connection Monitors

  // To log event when database connects successfully
  mongoose.connection.on('connected', () => {
    console.log(pc.green('Database Success: Connected to MongoDB Atlas successfully.'));
  });

  // To watch and log warning message if the connection is lost during runtime
  mongoose.connection.on('disconnected', () => {
    console.log(pc.yellow('Database Warning: connection is lost'))
  })

  // To log event when database reconnects successfully
  mongoose.connection.on('reconnected', () => {
  console.log(pc.cyan('Database Info: Connection recovered.'));
});

  // Catch and log any database errors that happen after a successful connection
  mongoose.connection.on('error', (error) => {
    console.error(pc.red(`Database Error: ${error.message}`))
  })
//#endregion

/**
 * connection to the MongoDB Atlas cluster using environment configurations
 * @async
 * @returns {Promise<void>} resolves when connection is successful, or stop process on failure
 */
const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(_config.MONGO_URL)
    console.log(pc.green(pc.bold(`the connection to Database is successful, Mongodb Atlas: `)) + pc.cyan(connection.connection.host))
  } catch (error) {
    console.error(pc.red(pc.bold(`connection to the Database is failed, Error: ${error.message}`)))
    // To stop the Server if connection faild
    process.exit(1)
  }
}


module.exports = connectionDB