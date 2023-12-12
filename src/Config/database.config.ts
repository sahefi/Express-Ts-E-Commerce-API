// db.js (or any other filename)
import {connect} from 'mongoose';
import logger from 'jet-logger';

async function run() {
    // 4. Connect to MongoDB
    await connect('mongodb://127.0.0.1:27017/test');
    logger.info('MongoDB connected successfully');
 }
// Get the default connection

// Event listeners for the connection

export default run;
