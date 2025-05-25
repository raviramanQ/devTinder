const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
       "mongodb+srv://manvi0706:Manvi%400706@namastenode.lo6vnmq.mongodb.net/devTinder"
    );
};



module.exports = connectDB;