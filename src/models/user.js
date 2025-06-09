const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        manLength:20,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("pls give valid email");
            }
        },
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        validate:{

            validator: function(v){
                const arr = ['male','female','others'];
              if(! arr.includes(v))
              {
                 throw new Error("Gender data is not valid");
              }
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://images.indianexpress.com/2020/02/Danny-004.jpg",
    },
    about: {
        type: String,
        default: "this is default text"
    },
    skills: {
        type: [String]
    }


},
{
    timestamps: true,
}
);


module.exports = mongoose.model("User", userSchema);