const express = require('express');
const passport = require('passport');

const {Adidy, Mpandray} = require('../models');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const adidy = await Adidy.findAll({
            include: 'mpandray'
        });
        
        return res.json({success: true, adidy: adidy});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const {mpandray, total, beginAt, endAt} = req.body;
    
    try {
        const newAdidy = await Adidy.create({mpandrayId: mpandray, total, beginAt, endAt});
        
        return res.json({success: true, adidy: newAdidy});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const adidy = await Adidy.findOne({
            where: {id},
            include: 'mpandray'
        });
    
        return res.json({success: true, adidy: adidy});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    const {mpandray, total, benginAt, endAt} = req.body;
    
    try {
        let adidy = await Adidy.findOne({
            where: {id},
            include: 'mpandray'
        });
    
        adidy.mpandrayId = mpandray;
        adidy.total = total;
        adidy.benginAt = benginAt;
        adidy.endAt = endAt;
    
        await adidy.save();
    
        return res.json({success: true, adidy: adidy});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    const id = req.params.id;
    
    try {
        const adidy = await Adidy.findOne({
            where: {id},
        });
    
        await adidy.destroy();
    
        return res.json({success: true});
    } catch (err) {
        console.log(err);
    
        return res.json({success: false, error: err});
    }
});

module.exports = router;