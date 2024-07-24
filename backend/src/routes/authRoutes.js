import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../helpers/passport.js';
import config from '../utils/config.js';
import { generateToken } from '../utils/utils.js';
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        const redirectUrl = `${config.apiUrl}/auth/callback?token=${token}`;
        res.redirect(redirectUrl);
    }
);

export default router;
