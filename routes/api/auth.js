const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth.js')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// Express Validator
const {
    check,
    validationResult
} = require('express-validator')

// @route   GET api/auth
// @desc    TEST Route
// @access  PUBLIC
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // means except password all i need to store into user variable
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

// @route   POST api/auth
// @desc    login-User auth Route -- Authenticate user and get token
// @access  PUBLIC
router.post(
    '/',
    [
        check('email', 'Please Include a valid mail').isEmail(),

        check(
            'password',
            'Password is Required'
        ).exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            email,
            password
        } = req.body // plain text email and password that user enter in login page

        try {
            // see if user Exist
            let user = await User.findOne({
                email
            }) // this are what database consist of acc. to the given credential

            //if user not exists
            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credential'
                    }]
                })
            }

            // if user Exists
            const isMatch = await bcrypt.compare(password, user.password)

            // if password doesnot match
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid Credential'
                    }]
                })
            }

            // get the payload  which include userId
            const payload = {
                user: {
                    id: user.id
                }
            };

            // then sign the token
            jwt.sign(payload,
                config.get('jwtSecret'), {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    })
                })
            // Return jsonwebtoken
            // res.send('User Registered')
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
)



module.exports = router