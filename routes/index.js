var express = require('express');
var router = express.Router();

var db = require('../models');

var RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

var SpecieService = require('../services/SpecieService');
var specieService = new SpecieService(db);

var UserService = require('../services/UserService');
var userService = new UserService(db);

var AnimalService = require('../services/AnimalService');
var animalService = new AnimalService(db);

var TemperamentService = require('../services/TemperamentService');
var temperamentService = new TemperamentService(db);

var AnimalTemperamentService = require('../services/AnimalTemperamentService');
var animalTemperamentService = new AnimalTemperamentService(db);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req?.user });
});

router.post('/populate', async function (req, res, next) {
  await roleService.populate();
  await specieService.populate();
  await userService.populate();
  await animalService.populate();
  await temperamentService.populate();
  await animalTemperamentService.populate();
/*   await adoptionService.populate(); */

  res.redirect('/');
})

module.exports = router;

