var express = require('express');
var router = express.Router();
var db = require('../models');
var TemperamentService = require('../services/TemperamentService');
var temperamentService = new TemperamentService(db);
const { isAdmin, isAuthorized } = require('./authMiddleware');
router.get('/', async function (req, res, next) {
    const temperament = await temperamentService.getAll();
    res.render("temperament", { user: req?.user, temperament: temperament })
})
router.put('/update', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await temperamentService.update(req.body.id, req.body.TemperamentName);
        res.render("index", { user: null })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Cannot update name of temperament. \nTemperament with same name already exists.');
            next();
        }
        else {
            console.error(error);
            next(error);
        }
    }
})
router.post('/add', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await temperamentService.create(req.body.TemperamentName);
        res.end();
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Cannot add entry. Entry already exists in database');
            next();
        }
        next();
    }
})
router.delete('/delete', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await temperamentService.destroy(req.body.id);
        res.end();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('Cannot delete entry. \nThere are existing records in the database that depend on this entry');
        } else {
            next(error);
        }
    }
});

module.exports = router;