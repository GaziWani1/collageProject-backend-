const mongoose = require('mongoose');

const conn = async () => {
    const res = await mongoose.connect("mongodb://localhost:27017/realEstateManagment", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    // if (res) console.log('db connected')
    // else
    // console.log('failed to connect')
}
conn();
module.exports = conn;