import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.join(__dirname, "..", "logs");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  
  if (process.env.VERCEL) {
    console.log(`[LOG] ${logFileName}: ${message}`);
    return;
  }
  
  try {
    if (!fs.existsSync(logsDirectory)) {
      await fsPromises.mkdir(logsDirectory, { recursive: true });
    }
    await fsPromises.appendFile(
      path.join(logsDirectory, logFileName),
      logItem
    );
  } catch (err) {
    console.error("Failed to write log file:", err);
  }
};

const getRequestOrigin = (req) => {
  return req.headers.origin || req.get("host") || req.ip || "unknown origin";
};

const logger = (req, res, next) => {
  const origin = getRequestOrigin(req);

  res.on("finish", () => {
    logEvents(
      `${req.method}\t${res.statusCode}\t${req.url}\t${origin}`,
      "reqLog.log"
    );
  });

  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger, logEvents };