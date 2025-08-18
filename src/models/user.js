/**
 * User Model
 * Represents a user in the application with profile and authentication details
 */

// Import required packages
const mongoose = require("mongoose"); // MongoDB ODM
const validator = require("validator"); // Validation library
const jwt = require("jsonwebtoken"); // JWT for authentication
const bcrypt = require("bcrypt"); // Password hashing

/**
 * User Schema
 * Defines the structure and validation rules for user data
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String, // String data type
        required: true, // This field must be provided
        minLength: 4, // Minimum 4 characters
        maxLength: 20, // Maximum 20 characters
    },
    lastName: {
        type: String // Optional field
    },
    emailId: {
        type: String,
        required: true, // This field must be provided
        lowercase: true, // Convert to lowercase before saving
        unique: true, // Must be unique in the database
        trim: true, // Remove whitespace from both ends
        validate(value) {
            // Custom validator using validator library
            if(!validator.isEmail(value))
            {
                throw new Error("pls give valid email");
            }
        },
    },
    password: {
        type: String,
        validate(value) {
            // Ensure password meets strength requirements
            if(!validator.isStrongPassword(value))
            {
                throw new Error("pls enter a strong password"+value);
            }
        },

    },
    age: {
        type: Number,
        min: 18 // Must be at least 18 years old
    },
    gender: {
        type: String,
        validate:{
            // Custom validator to check against allowed values
            validator: function(v){
                const arr = ['male','female','other'];
              if(! arr.includes(v))
              {
                 throw new Error("Gender data is not valid");
              }
            }
        },
    },
    photoUrl: {
        type: String,
        // Default profile photo if none provided
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        validate(value){
        // Ensure URL is valid
        if(!validator.isURL(value)){
          throw new Error("invalid url"+ value);
        } 
        }
        
    },
    about: {
        type: String,
        default: "this is default text" // Default bio text
    },
    skills: {
        type: [String] // Array of strings for user skills
    }

},
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
}
);

/**
 * Generate JWT token for user authentication
 * Creates a signed token containing the user's ID
 * 
 * @method getJWT
 * @returns {string} JWT token for authentication
 */
userSchema.methods.getJWT = async function(){

    const user = this; // Current user instance

    // Create a JWT token with user ID and expiration time
    const token = await jwt.sign({ _id_: user._id }, 'urs48#jfj', { expiresIn: '500000  s' });

   return token;

}

/**
 * Validate user password
 * Compares plain text password with stored hash using bcrypt
 * 
 * @method validatePassword
 * @param {string} userEnteredPassword - Plain text password to validate
 * @returns {boolean} True if password matches, false otherwise
 */
userSchema.methods.validatePassword = async function(userEnteredPassword){

    const user = this; // Current user instance

    const hashPassword = user.password; // Get stored hashed password

    // Compare entered password with stored hash using bcrypt
    const isPasswordValid = await bcrypt.compare(userEnteredPassword,hashPassword);

    return isPasswordValid;

}


/**
 * Create and export the User model
 */
module.exports = mongoose.model("User", userSchema); // Creates 'users' collection in MongoDB