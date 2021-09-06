const express = require('express');
const passport = require('passport');

const {sequelize, User, Mpandray, Adidy} = require('../models');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const thisYear = new Date().getFullYear();

        let adidyByYear = new Map([['Jan', 0], ['Jan', 0], ['Feb', 0], ['Mar', 0], ['Apr', 0], ['May', 0], ['Jon', 0], ['Jol', 0], ['Aog', 0], ['Sep', 0], ['Nov', 0], ['Des', 0]]);
        let tempResponse1 = await Adidy.findAll({
            attributes: [
                [sequelize.fn('month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('SUM', sequelize.col('total')), 'total']
            ],
            where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), thisYear),
            group: 'month'
        });

        let tempResponse2 = await Adidy.findAll({
            attributes: [
                'mpandrayId',
                [sequelize.fn('SUM', sequelize.col('total')), 'total']
            ],
            include: 'mpandray',
            where: sequelize.where(sequelize.fn('year', sequelize.col('Adidy.createdAt')), thisYear),
            group: 'mpandrayId'
        });

        let months = [];
        let totals = [];
        let index = 1;

        for (const [key, value] of adidyByYear) {
            months.push(key);
            totals.push(value);

            tempResponse1.map(element => {
                if (element.dataValues.month === index) {
                    totals[index - 1] = parseFloat(element.dataValues.total);
                }
            });

            index++;
        }

        tempResponse2.map(element => {
            console.log('District: ' + element.dataValues.mpandray.districtId + ', total: '+ parseFloat(element.dataValues.total));
        });

        const sumAdidy = await Adidy.sum('total', {
            where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), thisYear)
        });
        const NMpandray = await Mpandray.count();
        const NUser = await User.count();
        
        return res.json({success: true, sumAdidy: sumAdidy, numOfMpandray: NMpandray, numOfUser: NUser, adidyByYear: {months, totals}, tempResponse2: tempResponse2});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

module.exports = router;