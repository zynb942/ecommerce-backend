
const mongoose = require('mongoose')
const _config = require('../env.js')
const pc = require('picocolors')


/**
 * connection to the MongoDB Atlas cluster using environment configurations
 * @async
 * @returns {Promise<void>} resolves when connection is successful, or stop process on failure
 */
const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(_config.mongoURI)
    console.log(pc.green(pc.bold(`the connection to Database is successful, Atlas: `)) + pc.cyan(connection.connection.host))
  } catch (error) {
    console.error(pc.red(pc.bold(`connection to the Database is failed, Error: ${error.message}`)))
    // To stop the Server if connection faild
    process.exit(1)
  }
}

// To watch and log the events on the Server during runtime
mongoose.connection.on('disconnected', () =>{
  console.log(pc.yellow('Database Warning: connection is lost'))
})

// Catch and log any database errors that happen after a successful connection
mongoose.connection.on('error', (error) =>{
  console.error(pc.red(`Database Error: ${error.message}`))
})

module.exports = connectionDB