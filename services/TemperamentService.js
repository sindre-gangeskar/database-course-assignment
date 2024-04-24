const fs = require('fs');
const path = require('path');

class TemperamentService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Temperament = db.Temperament;
    }
    
    async populate() {
        try {
            const count = await this.Temperament.count();
            if (count > 0) {
                console.log('Temperaments Table is already populated...');
                return;
            }
            const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/temperaments.json'));
            const data = JSON.parse(rawdata);

            for (const query of data.query) {
                await this.sequelize.query(query);
            }

        } catch (err) {
            console.log('An error has occured populating the Temperaments Table', err);
        }
    }
    async getAll() {
        return this.Temperament.findAll({ where: {} });
    }
    async create(name) {
        return this.Temperament.create({ TemperamentName: name })
    }
    async destroy(id) {
        return await this.Temperament.destroy({ where: { id: id } });
    }
    async update(id, newName) {
        return await this.Temperament.update({ TemperamentName: newName }, { where: { id: id } });
    }
}

module.exports = TemperamentService;