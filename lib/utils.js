const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

const createPassword = (plainText) => {
    return crypto.createHash('sha1').update(plainText).digest('hex');
};

const validPassword = (plainTextPassword, passwordHashed) => {
    return createPassword(plainTextPassword) === passwordHashed;
};

const issueJWT = (user) => {
    const id = user.id;
    const expiresIn = '1d';
    const payload = {
        sub: id,
        iat: Date.now()
    }
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn, 
        algorithm: 'RS256'
    });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    };
};

const utils = {};

utils.createPassword = createPassword
utils.validPassword = validPassword
utils.issueJWT = issueJWT

module.exports = utils;
