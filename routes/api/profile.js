const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('config')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const auth = require('../../middleware/auth')
const {
    check,
    validator,
    validationResult
} = require('express-validator')

// @route   GET api/profile/me
// @desc    Authenticate the Logged-In User
// @access  PRIVATE
router.get('/me', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar'])

        // if no such profile
        if (!profile) {
            return res.status(400).json({
                msg: 'there is no profile of this User'
            })
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

});

// @route   POST api/profile
// @desc    Create User profile or Update 
// @access  PRIVATE
router.post('/', [auth, [
    check('status', 'Status is Required')
        .not()
        .isEmpty(),
    check('skills', 'Skills are mandatory')
        .not()
        .isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            erros: errors.array()
        })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //Build profile object
    const ProfileFields = {}
    ProfileFields.user = req.user.id

    if (company) ProfileFields.company = company
    if (website) ProfileFields.website = website
    if (location) ProfileFields.location = location
    if (bio) ProfileFields.bio = bio
    if (status) ProfileFields.status = status
    if (githubusername) ProfileFields.githubusername = githubusername

    if (skills) {
        ProfileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    //Build Socail Object
    ProfileFields.social = {};
    if (youtube) ProfileFields.social.youtube = youtube
    if (twitter) ProfileFields.social.twitter = twitter
    if (facebook) ProfileFields.social.facebook = facebook
    if (linkedin) ProfileFields.social.linkedin = linkedin
    if (instagram) ProfileFields.social.instagram = instagram

    try {

        let profile = await Profile.findOne({
            user: req.user.id
        })

        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate({ // returns the document as it was before update was applied.
                user: req.user.id
            }, {
                $set: ProfileFields
            }, {
                new: true //new option to true to return the document after update was applied    
            });
            return res.json(profile)
        }
        // Create 
        profile = new Profile(ProfileFields)
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

// @route   GET api/profile
// @desc    Get All Users profile 
// @access  PUBLIC

router.get('/', async (req, res) => {

    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

});


// @route   GET api/profile/user/user_id
// @desc    Get User profile by id 
// @access  PUBLIC

router.get('/user/:user_id', async (req, res) => {

    try {

        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({
                msg: 'Profile Not Builded'
            })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message)

        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not Builded'
            })
        }

        res.status(500).send('Server Error')
    }

});


// @route   DELETE api/profile
// @desc    Delete User, profile, post 
// @access  PRIVATE

router.delete('/', auth, async (req, res) => {
    try {
        //  Remove the users post
        await Post.deleteMany({ user: req.user.id })


        //  remove the user profile
        await Profile.findOneAndRemove({
            user: req.user.id
        })

        // remove user itself
        await User.findOneAndRemove({
            _id: req.user.id
        })

        res.json({
            msg: 'User Removed Sucessfully...'
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

});

// @route   PUT api/profile/experience
// @desc    Add experience in your existing profile 
// @access  PRIVATE

router.put('/experience', [auth, [check('title', 'Title is mandatory').not().isEmpty(),
check('company', 'Company is mandatory').not().isEmpty(),
check('from', 'from field is mandatory').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        })
    }


    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error!')
    }

});

// @route   DELETE api/profile/experience
// @desc    Delete experience from your existing profile 
// @access  PRIVATE

router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error!')
    }

});


// @route   PUT api/profile/education
// @desc    Add education in your existing profile 
// @access  PRIVATE

router.put('/education', [auth, [check('school', 'School is mandatory').not().isEmpty(),
check('degree', 'Degree is mandatory').not().isEmpty(),
check('fieldofstudy', 'Field of Study is mandatory').not().isEmpty(),
check('from', 'from field is mandatory').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        })
    }


    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error!')
    }

});

// @route   DELETE api/profile/education
// @desc    Delete education from your existing profile 
// @access  PRIVATE

router.delete('/education/:edu_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error!')
    }

});

// @route   GET api/profile/github/:username
// @desc    Get the user repos from the Github
// @access  PUBLIC

router.get('/github/:username', (req, res) => {

    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
                  &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }

        request(options, (error, response, body) => {
            if (error) {
                console.error(error.message)
            }

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: 'No GitHub Profile Found....!'
                })
            }

            res.json(JSON.parse(body)) // as body is regular string we need to parse into json to show into json
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})


module.exports = router