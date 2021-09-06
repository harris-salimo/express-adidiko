const express = require('express');
const passport = require('passport');

const {Mpandray, District} = require('../models');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const mpandray = await Mpandray.findAll({
            include: 'district'
        });
        
        return res.json({success: true, mpandray: mpandray});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const {name, gender, address, district, dateOfBirth, phone, email, facebook} = req.body;
    
    try {
        const newMpandray = await Mpandray.create({districtId: district, name, gender, address, dateOfBirth, phone, email, facebook});
        
        return res.json({success: true, mpandray: newMpandray});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const mpandray = await Mpandray.findOne({
            where: {id},
            include: 'district'
        });
        
        return res.json({success: true, mpandray: mpandray});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    const {name, gender, address, district, dateOfBirth, phone, email, facebook} = req.body;
    
    try {
        let mpandray = await Mpandray.findOne({
            where: {id},
            include: 'district'
        });
     
        mpandray.districtId = district;
        mpandray.name = name;
        mpandray.gender = gender;
        mpandray.address = address;
        mpandray.dateOfBirth = dateOfBirth;
        mpandray.phone = phone;
        mpandray.email = email;
        mpandray.facebook = facebook;
        
        await mpandray.save();
        
        return res.json({success: true, mpandray: mpandray});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const mpandray = await Mpandray.findOne({
            where: {id},
        });
        
        await mpandray.destroy();
        
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

module.exports = router;