const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvents = async (message, log_name) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logMessage = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs")))
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", log_name),
      logMessage
    );
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "requests.txt");
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = { logEvents, logger };
