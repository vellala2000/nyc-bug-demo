import { Writable } from 'stream';
import * as chai from 'chai';
import * as winston from 'winston';
import Logger from '../src/logger';

let output = '';
const stream = new Writable();
// eslint-disable-next-line no-underscore-dangle
stream._write = (chunk, encoding, next) => {
  output += chunk.toString();
  next();
};

const streamTransport = new winston.transports.Stream({ stream });
Logger.add(streamTransport);

describe('Unit test for logger ', () => {
  Logger.error('test message');
  beforeEach(() => {
    Logger.add(streamTransport);
  });
  afterEach(() => {
    Logger.remove(streamTransport);
  });
  it('Should be able to return success', (done: () => void): void => {
    const logEvents = output.trim().split('\n');
    chai.assert(logEvents[0].includes('test message'));
    done();
  });
});
describe('Unit test for logger with NODE.ENV = test', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../src/logger')];
    process.env = { NODE_ENV: 'test' };
  });
  afterEach(() => {
    process.env = { NODE_ENV: 'development' };
  });
  it('Should be able to return success', (done: () => void): void => {
    // eslint-disable-next-line global-require
    const newLogger = require('../src/logger');
    chai.assert.equal(newLogger.default.level, 'warn');
    done();
  });
});
