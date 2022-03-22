const User = require('./userModel');
const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

//make jason web token functions async using util
const asyncLogInUser = util.promisify(jwt.sign);
const asyncVerifyUser = util.promisify(jwt.verify);

// define secret key for my token
const secretKey = 'mySecretKey'

// sign up function expression
const signUp = async (req, res, next) => {

    let user = new User(req.body);  
    try {
        // hashing password with 10 saltrounds
        user.password = await bcrypt.hash(user.password, saltRounds)

        //saving signed up user data in the database
        await user.save();

        //sending response to the user
        res.send("signed up successfully");

    } catch (error) {
        error.status = 500;
        // send catched error to error handler middleware
        next(error);
    }
}

//log in function expression
const logIn = async (req, res, next) => {

    // distruct request body to use in search
    const { email, password } = req.body;
    try {

        // find user in the database with logged in username
        const user = await User.findOne({ email: email });

        // throw error if there is no matched username
        if (!user) {
            throw new Error('invalid username or password');
        }

        // prepare founded user password and compare it to logged in password
        const { password: hashedPassword } = user;
        const checkPassword = await bcrypt.compare(password, hashedPassword);

        // throw error if passwords did'nt match
        if (!checkPassword) {
            throw new Error('invalid username or password')
        }

        //create token to authorized user for further authentication
        const token = await asyncLogInUser({
            id: user.id,
            admin:user.admin
        }, secretKey)

        //send response to the user
        res.send({
            message: 'logged in successfully',
            token
        })
    }
    catch (error) {
        error.status = 422;

        //send error to error handler middleware
        next(error)
    }
}


// get profile info by token id function expression
const checkAdminRole = async (req, res, next) => {

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure user have privilages and get token payload
        const payload = await asyncVerifyUser(authorization, secretKey)

        // check if logged in user is admin 
        const isAdmin = payload.admin

        //send back response with check result
        res.send({Admin:isAdmin});
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }
}



module.exports = {
    signUp,
    logIn,
    checkAdminRole,
}