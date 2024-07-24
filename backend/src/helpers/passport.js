import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            let user = await User.findOne({
                $or: [{ googleId: profile.id }, { email: profile._json.email }]
            });

            if (!user) {

                user = new User({
                    googleId: profile.id,
                    name: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName || ''
                    },
                    email: profile._json.email,
                });
                await user.save();
            } else if (!user.googleId) {
                // google id updation
                user.googleId = profile.id;
                await user.save();
            }


            done(null, user);
        } catch (error) {

            done(error, null);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
