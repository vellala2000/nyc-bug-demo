import * as winston from 'winston';

// Usage*
// Logger.error('This is an error log');
// Logger.warn('This is a warn log');
// Logger.info('This is a info log');
// Logger.http('This is a http log');
// Logger.debug('This is a debug log');

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  // *disabled as it adding color codes to all logs instead enabled only for console log
  // winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
  // print json file in readable format
  // winston.format.prettyPrint(),
  // String interpolation splat for %d %s-style messages.
  winston.format.splat(),
  // winston.format.simple(),
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    // add color specific to console log only
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
    ),
  }),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  new winston.transports.File({ filename: 'logs/all.log' }),
];
// Allow to print all unhandled exceptions to error log
const exceptionHandlers = [
  new winston.transports.File({ filename: 'logs/error.log' }),
];

// Create the logger instance that has to be exported
// and used to log messages.
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  defaultMeta: { service: 'testplan' },
  exceptionHandlers,
  exitOnError: true,
});

export default Logger;
