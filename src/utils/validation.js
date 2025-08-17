const validator = require("validator");

const validateSignUpData = (req) => {

    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName && firstName.length < 4){
        throw new Error("firstName is not valid"); 
    }
    else if(!lastName){
        throw new Error("lastname is mandatory");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is weak");
    }

}

const validateEditProfileData = (req) => {

    const allowedEditFields = ['firstName','lastName','age','gender','skills','about','photoUrl'];

    const isEditAllowed = Object.keys(req.body).every((field) => 
    
        allowedEditFields.includes(field)
    );

    return isEditAllowed;

}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};