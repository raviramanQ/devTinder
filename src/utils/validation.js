const validator = require("validator"); // Import validator library for input validation

/**
 * Validates user signup data from request body
 * Checks for required fields and proper formatting
 * 
 * @param {Object} req - Express request object containing user signup data
 * @param {Object} req.body - Request body containing user details
 * @param {string} req.body.firstName - User's first name (must be at least 4 characters)
 * @param {string} req.body.lastName - User's last name (required)
 * @param {string} req.body.emailId - User's email address (must be valid email format)
 * @param {string} req.body.password - User's password (must meet strength requirements)
 * @throws {Error} If any validation fails with specific error message
 * @returns {undefined} No return value if validation passes
 */
const validateSignUpData = (req) => {

    // Extract user data from request body
    const {firstName,lastName,emailId,password} = req.body;

    // Validate first name exists and meets minimum length requirement
    if(!firstName && firstName.length < 4){
        throw new Error("firstName is not valid"); 
    }
    // Validate last name is provided
    else if(!lastName){
        throw new Error("lastname is mandatory");
    }
    // Validate email format using validator library
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    // Validate password strength using validator library
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is weak");
    }

}

/**
 * Validates profile edit data to ensure only allowed fields are being updated
 * 
 * @param {Object} req - Express request object containing profile edit data
 * @param {Object} req.body - Request body containing fields to update
 * @returns {boolean} True if all fields in request are allowed to be edited, false otherwise
 */
const validateEditProfileData = (req) => {

    // Define list of fields that are allowed to be edited
    const allowedEditFields = ['firstName','lastName','age','gender','skills','about','photoUrl'];

    // Check if every field in the request body is in the allowed fields list
    const isEditAllowed = Object.keys(req.body).every((field) => 
        // Return true if the field is in the allowed list, false otherwise
        allowedEditFields.includes(field)
    );

    // Return validation result
    return isEditAllowed;

}

/**
 * Export validation utility functions for use in other modules
 */
module.exports = {
    validateSignUpData,
    validateEditProfileData,
};