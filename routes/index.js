const express = require('express');
const passport = require('passport');

const {sequelize, User, Mpandray, Adidy, District} = require('../models');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
    try {
        const thisYear = new Date().getFullYear();

        // Construction de la statistique des adidy par 
        // an
        // Création d'une map(MOIS => ADIDY) avec valeur 
        // par défaut des adidy 0
        let adidyByYear = new Map([['Jan', 0], ['Feb', 0], ['Mar', 0], ['Apr', 0], ['May', 0], ['Jon', 0], ['Jol', 0], ['Aog', 0], ['Sep', 0], ['Okt', 0], ['Nov', 0], ['Des', 0]]);
        
        // Récuperation des adidy pour l'année en cours 
        // regroupés par mois
        let adidyCurrentYear = await Adidy.findAll({
            attributes: [
                [sequelize.fn('month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('SUM', sequelize.col('total')), 'total']
            ],
            where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), thisYear),
            group: 'month'
        });

        let months = [];
        let totals1 = [];
        let i = 1;

        // Création de 2 colonnes(sous forme tableau): 
        // "MOIS" et "ADIDY" avec le map
        for (const [key, value] of adidyByYear) {
            months.push(key);
            totals1.push(value);

            // Modification des valeurs du colonne 
            // ADIDY selon la requete concernant l'adidy 
            // pour l'année en cours
            adidyCurrentYear.map(element => {
                if (element.dataValues.month === i) {
                    totals1[i - 1] = parseFloat(element.dataValues.total);
                }
            });

            i++;
        }

        // Construction de la statistique des adidy par 
        // quartier
        // Récuperation de tous les noms des quartiers
        const tempDistricts = await District.findAll({
            attributes: [
                'id',
                'name'
            ]
        });

        // Création d'un map vide
        let adidyByDistrict = new Map();

        // Affectation de données dans le map sous forme: 
        // key => value; dont le key est le nom d'un quartier 
        // et value: la valeur de l'adidy, pour l'instant 0
        tempDistricts.map(element => {
            adidyByDistrict.set(element.dataValues.name, 0);
        });

        // Récuperation des adidy pour l'année en cours
        // regroupés par mpandray
        let adidyByMpandrayCurrentYear = await Adidy.findAll({
            attributes: [
                'mpandrayId',
                [sequelize.fn('SUM', sequelize.col('total')), 'total']
            ],
            include: 'mpandray',
            where: sequelize.where(sequelize.fn('year', sequelize.col('Adidy.createdAt')), thisYear),
            group: 'mpandrayId'
        });

        let districts = [];
        let totals2 = [];

        // Modification des valeurs du colonne 
        // ADIDY selon la requete concernant l'adidy 
        // par quartier pour l'année en cours
        adidyByMpandrayCurrentYear.map(element => {
            // console.log('\nDistrict: ' + element.dataValues.mpandray.districtId + ', total: '+ parseFloat(element.dataValues.total + '\n'));
            tempDistricts.map(item => {
                if (element.dataValues.mpandray.districtId === item.dataValues.id) {
                    // totals1[i - 1] = parseFloat(element.dataValues.total);
                    adidyByDistrict.set(item.dataValues.name, parseFloat(element.dataValues.total));
                }
            });
        });

        // Création de 2 colonnes(sous forme tableau): 
        // "QUARTIER" et "ADIDY" avec le map
        for (const [key, value] of adidyByDistrict) {
            districts.push(key);
            totals2.push(value);
        }

        const sumAdidy = await Adidy.sum('total', {
            where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), thisYear)
        });
        const NMpandray = await Mpandray.count();
        const NUser = await User.count();
        
        return res.json({success: true, sumAdidy: sumAdidy, numOfMpandray: NMpandray, numOfUser: NUser, adidyByYear: {months, totals1}, adidyByDistrict: {districts, totals2}});
    } catch (err) {
        console.log(err);
        
        return res.json({success: false, error: err});
    }
});

module.exports = router;