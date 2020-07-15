const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// need model in this file
const User = require('../../models/User.js')

// Express Validator
const {
    check,
    validationResult
} = require('express-validator')

// @route   POST api/users
// @desc    Register-User Route
// @access  PUBLIC
router.post(
    '/',
    [
        check('name', 'Name is Required')
        .not()
        .isEmpty(),

        check('email', 'Please Include a valid mail').isEmail(),

        check(
            'password',
            'plz Enter password with more then 6 or more character'
        ).isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            name,
            email,
            password
        } = req.body

        try {
            // see if user Exist
            let user = await User.findOne({
                email
            })
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already Exist'
                    }]
                })
            }
            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            // create new instance of user
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encryped password
            const salt = await bcrypt.genSalt(10) // first we create the salt for encrypt purpose
            user.password = await bcrypt.hash(password, salt)
            await user.save() // anything which return promise make sure you put await in font of

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