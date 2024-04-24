var express = require('express');
var router = express.Router();

const db = require('../models');
const AnimalService = require('../services/AnimalService');
const animalService = new AnimalService(db);
const AdoptionService = require('../services/AdoptionService');
const adoptionService = new AdoptionService(db);
const { isMember, isAdmin, isAuthorized } = require('./authMiddleware');

router.get('/', async function (req, res, next) {
  const animals = await animalService.getAll();
  await animalService.logAdoptions();
  res.render('animals', { user: req?.user, animals: animals });
});
router.get('/all-animals', async function (req, res, next) {
  res.redirect('/animals');
});
router.get('/sort-by-age', async function (req, res, next) {
  const animals = await animalService.sortByAge();
  await animalService.logAdoptions();

  res.render('animals', { user: req?.user, animals: animals });
})
router.get('/sort-by-names', async function (req, res, next) {
  const animals = await animalService.sortByPopularNames();
  await animalService.populateAnimalData(animals);
  res.render('animals', { user: req?.user, animals: animals })
})
router.get('/all-adopted', async function (req, res, next) {
  const animals = await animalService.findAllAdopted();
  res.render('animals', { animals: animals, user: req?.user })
}
)
router.get('/animals-per-size', isAuthorized, isAdmin, async function (req, res, next) {
  animals = await animalService.getAllBySize();
  res.render('animalsPerSize', { animals: animals, user: req?.user });
})
router.get('/animals-between-range', async function (req, res, next) {
  try {
    const { from, to } = req.query;
    console.log(req.query);
    const animals = await animalService.getDateRange(from, to);
    res.render('animals', { animals: animals, user: req?.user })
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).send(error.message);
    }
    else return next(error);
  }
})


router.delete('/', isAuthorized, isAdmin, async function (req, res, next) {
  if (req.body.AnimalId) {
    await animalService.deleteAdoption(req.body.AnimalId);
    res.end();
  }
})
router.post('/adoptions', isAuthorized, isMember, async function (req, res, next) {
  await adoptionService.create(req.user.id, req.body.AnimalId);
  res.end();
});

module.exports = router;