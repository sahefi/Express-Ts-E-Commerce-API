import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import {app} from './server';
import db from './Config/database.config';
import { connect } from 'mongoose';
import run from './Config/database.config';
import Banner from './resoursces/Banner';





// **** Run **** //
// console.log(db.on('connected', () => {
//   console.log('MongoDB connected successfully');
// }))
console.log(`

${Banner}

`);

run().catch(err => console.log(err));


const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());
  app.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));

