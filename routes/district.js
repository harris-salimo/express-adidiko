const express = require('express');
const passport = require('passport');

const {District} = require('../models');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const districts = await District.findAll();
    
        return res.json({success: true, districts: districts});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const {name} = req.body;
    
    try {
        const newDistrict = await District.create({name});
    
        return res.json({success: true, district: newDistrict});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const district = await District.findOne({
            where: {id},
        });
    
        return res.json({success: true, district: district});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    const {name} = req.body;
    
    try {
        let district = await District.findOne({
            where: {id},
        });
    
        district.name = name;
    
        await district.save();
    
        return res.json({success: true, district: district});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const district = await District.findOne({
            where: {id},
        });
    
        await district.destroy();
    
        return res.json({success: true});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

module.exports = router;