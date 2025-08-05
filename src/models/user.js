const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength:20,
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
        type: String,
        validate(value) {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("pls enter a strong password"+value);
            }
        },

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
        validate(value){
        if(!validator.isURL(value)){
          throw new Error("invalid url"+ value);
        } 
        }
        
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

userSchema.methods.getJWT = async function(){

    const user = this;

    const token = await jwt.sign({ _id_: user._id }, 'urs48#jfj', { expiresIn: '500000  s' });

   return token;

}

userSchema.methods.validatePassword = async function(userEnteredPassword){

    const user = this;

    const hashPassword = user.password;

    const isPasswordValid = await bcrypt.compare(userEnteredPassword,hashPassword);

    return isPasswordValid;

}


module.exports = mongoose.model("User", userSchema);