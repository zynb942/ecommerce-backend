

require("dotenv").config();


// check if the connection string exists, if not stop the server
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is missing');
  process.exit(1);
}

// put the env variable in central object
const _config = {
  PORT: parseInt(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URI,
  
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE


}

module.exports = _config
