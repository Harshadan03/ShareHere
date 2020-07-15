const mongoose = require('mongoose')
const config = require('config')
const db = config.get('MONGODBURI')

const ConnectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB connnected...!')

    } catch (err) {
        console.log(err.message)
        // Exit Process with Failure
        process.exit(1);
    }
}

module.exports = ConnectDB;