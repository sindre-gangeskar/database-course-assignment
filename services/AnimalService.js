const fs = require('fs');
const path = require('path');
const db = require('../models');
const AdoptionService = require('./AdoptionService');
const adoptionService = new AdoptionService(db);
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

class AnimalService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Animal = db.Animal;
        this.AnimalTemperament = db.AnimalTemperament;
        this.Temperament = db.Temperament;
        this.Adoption = db.Adoption;
        this.Specie = db.Specie;
    }
    
    async populate() {
        const count = await this.Animal.count();
        if (count > 0) {
            console.log('Animal table is already populated... ');
            return;
        }

        const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/animals.json'));
        const data = JSON.parse(rawdata);

        for (const query of data.query) {
            await this.sequelize.query(query);
        }

    }
    async getAll() {
        const animals = await this.Animal.findAll({
            where: {},
            include: [
                { model: this.Temperament, through: this.AnimalTemperament },
                { model: this.Adoption },
                { model: this.Specie, as: 'Specie', attributes: [ 'Size', 'SpecieName' ] }
            ]
        });

        this.populateAnimalData(animals);
        return animals;
    }
    async getAge(birthday) {
        const birthYear = parseInt(birthday.substring(0, 4));
        const year = new Date().getFullYear();
        const age = year - birthYear;
        return age;
    }
    async deleteAdoption(id) {
        if (isNaN(id))
            throw new Error('Invalid ID. ID must be a number');

        return await this.Adoption.destroy({ where: { AnimalId: Number(id) } });
    }
    async sortByAge() {
        const animals = await this.Animal.findAll({
            include: [
                { model: this.Temperament, through: this.AnimalTemperament },
                { model: this.Adoption },
                { model: this.Specie, attributes: [ 'Size', 'SpecieName' ] }
            ],
            order: [ [ this.sequelize.fn('YEAR', this.sequelize.col('Birthday')), 'ASC' ] ]
        })

        await this.populateAnimalData(animals);
        return animals;
    }
    async sortByPopularNames() {
        const popularAnimalNames = await this.Animal.findAll({
            include: [
                { model: this.Temperament, through: this.AnimalTemperament },
                { model: this.Specie, attributes: [ 'Size', 'SpecieName' ] },
                { model: this.Adoption }
            ],
            order: [
                [ this.sequelize.literal("(SELECT  COUNT(*) FROM Animals WHERE AnimalName = Animal.AnimalName)"), 'DESC' ]
            ]
        });
        return popularAnimalNames;
    }
    async populateAnimalData(animals) {
        animals = await Promise.all(animals.map(async animal => {
            animal.Age = await this.getAge(animal.Birthday);
            animal.Adopted = await adoptionService.getById(animal.id) ? true : false;
        }))
        return animals;
    }
    async logAdoptions() {
        const adoptions = await adoptionService.getAll();
        const arr = [];
        adoptions.forEach(adoption => {
            arr.push(adoption.dataValues);
        })

        arr?.length > 0 ? console.log('Registered adoptions:', JSON.stringify(arr, null, 2)) : console.log('No adoptions registered in database');

        return adoptions;
    }
    async findAllAdopted() {
        const animals = await this.Animal.findAll({
            include: [
                { model: this.Temperament },
                { model: this.Specie, attributes: [ 'Size', 'SpecieName' ] },
                {
                    model: this.Adoption,
                    where: {
                        AnimalId: {
                            [ Sequelize.Op.not ]: null
                        }
                    }
                } ]
        });
        await this.populateAnimalData(animals);
        return animals;
    }
    async getAllBySize() {
        const animalsPerSize = await this.Animal.findAll({
            attributes: [
                [ this.sequelize.literal('Specie.Size'), 'Size' ],
                [ this.sequelize.fn('COUNT', this.sequelize.col('*')), 'animalsPerSize' ]
            ],
            include: [ {
                model: this.Specie,
                attributes: []
            } ],
            group: 'Size',
            raw: true
        })

        return animalsPerSize;
    }
    async getDateRange(from, to) {
        const animals = await this.Animal.findAll({
            where: {
                "Birthday": {
                    [ Op.and ]: {
                        [ Op.gte ]: from,
                        [ Op.lte ]: to
                    }
                }
            },
            include: [
                { model: this.Specie, attributes: [ 'SpecieName', 'Size' ] },
                { model: this.Adoption },
                { model: this.Temperament, through: this.AnimalTemperament },
            ]
        });

        await this.populateAnimalData(animals);
        return animals;
    }
}

module.exports = AnimalService;