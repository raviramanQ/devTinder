 const adminAuth = (req,res,next)=>{
    console.log("Admin auth is getting checked");

    const token = 'xyz';

    const isValid = token === 'xyz';

    if(!isValid)
    {
        res.status(401).send("invalid user");
    }
    else
    {
        next();
    }
};

const userLoginAuth = (req,res,next)=>{
    const userId = "ravi@123";

    const isValidLogin = userId === "ravi@123";

    if(!isValidLogin)
    {
        res.status(401).send('invalid credentials');
    }
    else{
        next();
    }
}

module.exports = {
adminAuth,
userLoginAuth,
};