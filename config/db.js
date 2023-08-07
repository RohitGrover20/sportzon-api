const mongoose = require('mongoose');
require('dotenv').config();
// mongoose.set('useCreateIndex', true);

const password = encodeURIComponent(process.env.DBPASSWORD)
module.exports = function () {
    mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${password}@yesteq.lt5yiuc.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
        console.log("db connected");
    })

}