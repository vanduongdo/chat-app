const User = require("../model/userModel");
const brcypt = require("bcrypt");

/**
 * Registers a new user.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object to send the result of the registration.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
module.exports.register = async (req, res, next) => {
    try {
        // Extract user information from request body
        const { userName, email, password } = req.body;

        // Check if userName already exists
        const userNameCheck = await User.findOne({ userName });
        if (userNameCheck) {
            return res.json({ msg: "Username already taken", status: false });
        }

        // Check if email already exists
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already registered", status: false });
        }

        // Hash the password
        const hashedPassword = await brcypt.hash(password, 10);

        // Create a new user with the provided information
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
        });

        // Remove the password from the response
        user.password = undefined;

        // Send a success response with the user information
        return res.json({ status: true, user });
    } catch (ex) {
        // Pass the error to the next middleware function
        next(ex);
    }
};

/**
 * Login a user.
 * @param {Object} req - The request object containing the user's information.
 * @param {Object} res - The response object to send the result of the registration.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
module.exports.login = async (req, res, next) => {
    try {
        // Extract user information from request body
        const { email, password } = req.body;

        // Find the user with the provided email
        const user = await User.findOne({ email });

        // If user is not found, return an error response
        if (!user) {
            return res.json({ msg: "Email or Password is incorrect", status: false });
        }

        // Compare the provided password with the user's hashed password
        const isPasswordValid = await brcypt.compare(password, user.password);

        // If the password is not valid, return an error response
        if (!isPasswordValid) {
            return res.json({ msg: "Email or Password is incorrect", status: false });
        }

        // Remove the password from the response
        user.password = undefined;

        // Send a success response with the user information
        return res.json({ status: true, user });
    } catch (ex) {
        // Pass the error to the next middleware function
        next(ex);
    }
};

/**
 * Sets the avatar image for a user.
 * @param {Object} req - The request object containing the user's ID and avatar image.
 * @param {Object} res - The response object to send the result of the operation.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
module.exports.setAvatar = async (req, res, next) => {
    try {

        // Extract user ID and avatar image from request parameters and body
        const userId = req.params.id;
        const avatarImage = req.body.image;

        // Find and update the user with the provided ID, setting isAvatarImageSet to true and avatarImage to the provided image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        }, {
            new: true,
        });

        // Send a success response with the updated isAvatarImageSet and avatarImage values
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        // Pass the error to the next middleware function
        next(ex);
    }
};
