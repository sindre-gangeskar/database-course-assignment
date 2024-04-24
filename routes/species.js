var express = require('express');
var router = express.Router();
var db = require('../models');
var SpecieService = require('../services/SpecieService');
var specieService = new SpecieService(db);
var { isAuthorized, isAdmin } = require('./authMiddleware');
router.get('/', async function (req, res, next) {
    const species = await specieService.getAll();
    res.render("species", { user: req?.user, species: species });
})
router.post('/add-specie', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await specieService.create(req.body.SpecieName, req.body.Size);
        res.end();
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Cannot add entry. Entry already exists in database')
        }
        else {
            console.error(error);
            next(error);
        }
    }
})
router.delete('/delete', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await specieService.delete(req.body.id);
        return res.status(200).end();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).send('Cannot delete species with associated animal in records.');
        }
        return next(error);
    }
});
router.put('/update', isAuthorized, isAdmin, async function (req, res, next) {
    try {
        await specieService.update(req.body.id, req.body.SpecieName, req.body.Size);
        return res.status(200).end();
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Cannot update name of Specie.\nSpecie with same name already exists.');
            next();
        }
        else next(error);
    }
})


module.exports = router;