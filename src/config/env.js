const dotenv = require('dotenv')

// to read all variable from .env file
dotenv.config()

// check if the connection string exists, if not stop the server
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is missing');
  process.exit(1);
}

// put the env variable in central object
const _config = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV,
  mongoURI: process.env.MONGO_URI
}

module.exports = _config