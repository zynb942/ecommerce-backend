
const mongoose = require('mongoose')
const _config = require('../env')


/**
 * connection to the MongoDB Atlas cluster using environment configurations
 * @async
 * @returns {Promise<void>} resolves when connection is successful, or stop process on failure
 */
const connectionDB = async () => {
  try {
    if(!_config.mongoURI){
      throw new Error("fail to find uri");
    }

    const connection = await mongoose.connect(_config.mongoURI)
    console.log(`the connection to Database is successful, Atlas: ${connection.connection.host}`)
  } catch (error) {
    console.log(`connection to the Database is faild, Error: ${error.message}`)
    // To stop the Server if connection faild
    process.exit(1)
  }
}

// To watch and log the events on the Server during runtime
mongoose.connection.on('disconnected', () =>{
  console.log('Database Warning: connection is lost')
})

// Catch and log any database errors that happen after a successful connection
mongoose.connection.on('error', (error) =>{
  console.error(`Database Error: ${error.message}`)
})

module.exports = connectionDB