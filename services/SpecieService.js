const fs = require('fs');
const path = require('path');

class SpecieService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Specie = db.Specie;
    }
    
    async populate() {
        try {
            const count = await this.Specie.count();
            if (count > 0) {
                console.log('Species Table is already populated...');
                return;
            }

            const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/species.json'));
            const data = JSON.parse(rawdata);

            for (const query of data.query) {
                await this.sequelize.query(query);
            }

        } catch (err) {
            console.error('An error has occured populating the Species Table', err);
        }
    }
    async getAll() {
        return this.Specie.findAll({ where: {} });
    }
    async create(specie, size) {
        return await this.Specie.create({ SpecieName: specie, Size: size });
    }
    async delete(id) {
        return await this.Specie.destroy({ where: { id: id } });
    }
    async update(id, newSpecie, size) {
        return await this.Specie.update({ SpecieName: newSpecie, Size: size }, { where: { id: id } })
    }
}

module.exports = SpecieService;