const express = require('express');
const User = require('../Models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Harryisagoodb$oy';
router.post(
    '/createuser',
    [
        body('email').custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
        body('password').isLength({ min: 5 }),
        body('password').custom(async value => {
            const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
            if (!strong.test(value)) {
                throw new Error('Password must have uppercase, lowercase, number, and special character');
            }
        }),
        body('name', 'Name should have atleast 3 characters').isLength({ min: 3 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
            const user = new User(req.body);
            await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            var token = jwt.sign({ data }, JWT_SECRET);

            res.json({ authtoken: token });
        } catch (err) {
            res.status(500).send('Server Error occured');
        }
    }
);
router.post(
    '/login',
    [
        body('email', 'Email cannot be empty').notEmpty(),
        body('password', 'Password cannot be empty').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: 'Incorrect credentials' });
            }
            const passwordcompare = await bcrypt.compare(password, user.password);
            if (!passwordcompare) {
                return res.status(400).json({ error: 'Incorrect credentials' });
            }
            const data = {

                user: {
                    id: user.id
                }
            }
            var token = jwt.sign({ data }, JWT_SECRET);
            res.json({ authtoken: token });
        } catch (err) {
            res.status(500).send('Server Error occured');
        }
    }
);
router.post(
    '/getuser',
    fetchuser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            if (!user) {
                res.status(404).send({ error: 'could not find user' });
            }
            res.send(user);
        } catch (err) {
            res.status(500).send('Server Error occured');
        }
    }
);

router.put("/theme", fetchuser, async (req, res) => {
    try {
        const { theme } = req.body;

        if (!theme) {
            return res.status(400).json({ error: "Theme is required" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { theme },
            { new: true }
        ).select("-password");

        res.json({ success: true, theme: user.theme });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Get current user's theme 
router.get("/theme", fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("theme");
        res.json({ theme: user.theme });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
