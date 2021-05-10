import { Writable } from 'stream';
import * as chai from 'chai';
import * as winston from 'winston';
import chaiHttp = require('chai-http');
/* eslint-disable import/first */
import Logger from '../src/logger';
import app from '../src/app';

let output = '';
chai.use(chaiHttp);
const stream = new Writable();
// eslint-disable-next-line no-underscore-dangle
stream._write = (chunk, encoding, next) => {
  output += chunk.toString();
  next();
};

const streamTransport = new winston.transports.Stream({ stream });

describe('morgon logger unit test for http requests', () => {
  beforeEach(() => {
    Logger.add(streamTransport);
    Logger.silent = false;
  });
  afterEach(() => {
    Logger.remove(streamTransport);
    Logger.silent = true;
  });
  it('Should be able to return success', async (): Promise<void> => {
    const resp = await chai.request(app).get('/');
    chai.expect(resp).to.have.status(404);
    const logEvents = output.trim().split('\n');
    chai.expect(logEvents[0]).includes('http: GET / 404');
  });
});
