const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken')
const router = express.Router();
const auth = require('../../middleware/auth');
const Users = require('../../models/User');
const {
    check,
    validationResult
} = require('express-validator');

//@route - api/auth
//@desc - authenticate user and get token
//@access - Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }
});


router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {
        email,
        password
    } = req.body;

    try {
        //check if the user exist
        let user = await Users.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials'
                }]
            })
        }

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) {
                throw err
            };
            res.json({
                token
            })
        });

    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }
})
module.exports = router;