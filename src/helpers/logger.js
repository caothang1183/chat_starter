const winston = require("winston");
const moment = require("moment");
const { format, transports } = require("winston");
const { combine, label, printf, prettyPrint } = format;

const directory = (folder) =>
  `./logger/${folder}/${moment().format("YYYY-MM-DD")}.log`;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[${level}][${process.env.APP_PORT}] ${moment(timestamp).format(
    "YYYY-MM-DD HH:mm:ss"
  )} : ${message}`;
});
const customLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  colors: {
    emerg: "yellow",
    alert: "red",
    crit: "red",
    error: "red",
    warning: "yellow",
    notice: "yellow",
    info: "green",
    debug: "blue",
  },
};

const ignorePrivate = format((info, opts) => {
  if (info.private) return false;
  return info;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  defaultMeta: { service: process.env.SERVICE },
  format: combine(customFormat, ignorePrivate(), format.colorize()),
  transports: [
    new transports.File({
      filename: directory("info"),
      level: "info",
    }),
    new transports.File({
      filename: directory("error"),
      level: "error",
      format: combine(prettyPrint(), format.colorize()),
    }),
    new transports.File({
      filename: directory("debug"),
      level: "debug",
      format: combine(prettyPrint(), format.colorize()),
    }),
    new transports.Console({
      format: combine(
        label({ label: process.env.SERVICE }),
        customFormat,
        ignorePrivate(),
        format.colorize()
      ),
      handleExceptions: true,
    }),
  ],
});

const logInfo = (message, data) => {
  if (data) logger.log("info", message, data);
  else logger.info(message);
};

const logError = (message) => logger.error(message);



module.exports = {
  logInfo,
  logError,
};
