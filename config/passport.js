const fs = require('fs');
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {User} = require('../models');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const verify = async (payload, done) => {
    try {
        const user = await User.findOne({
            where: {
                id: payload.sub
            }
        });

        if(user) return done(null, user);

        else return done(null, false);
        
    } catch (err) {
        return done(err, false);
    }
};

const strategy = new JwtStrategy(options, verify);

module.exports = (passport) => {
    passport.use(strategy);
};