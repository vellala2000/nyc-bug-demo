import * as express from 'express';
import Logger from './logger';
import morganMiddleware from './morgon';

require('dotenv').config();

const app = express();
export default app;
const port = process.env.PORT || 8001;

app.use(morganMiddleware);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  Logger.debug(`test plan app listening at http://localhost:${port}`);
});
