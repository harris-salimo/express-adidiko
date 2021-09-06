const express = require('express');
const passport = require('passport');
const utils = require('../lib/utils');
const router = express.Router();

const {User} = require('../models');

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const users = await User.findAll();
        
        return res.json({success: true, users: users});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.post('/register', async function(req, res, next){
    const {name, email, role, password} = req.body;
    
    try {
        const newUser = await User.create({name, email, role, password: utils.createPassword(password)});
        // const jwt = utils.issueJWT(newUser);
        
        // return res.json({success: true, user: newUser, token: jwt.token, expiresIn: jwt.expires});
        return res.json({success: true, user: newUser});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.post('/login', async function(req, res, next){
    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({
            where: {email}
        });

        if(!user) return res.json({msg: "User not found."});
        
        if(!utils.validPassword(password, user.password)) return res.json({msg: "Password invalid."});
        
        else {
            const tokenObject = utils.issueJWT(user);
            
            return res.json({success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires})
        }
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const user = await User.findOne({
            where: {id},
        });
        
        return res.json({success: true, user: user});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    const {name, role} = req.body;
    
    try {
        let user = await User.findOne({
            where: {id},
        });
        
        user.name = name;
        user.role = role;
        
        await user.save();
        
        return res.json({success: true, user: user});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const user = await User.findOne({
            where: {id},
        });
        
        await user.destroy();
        
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

module.exports = router;