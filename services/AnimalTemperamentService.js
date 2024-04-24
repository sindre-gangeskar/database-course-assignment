const fs = require('fs');
const path = require('path');

class AnimalTemperamentService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.AnimalTemperament = db.AnimalTemperament;
    }

    async populate() {
        try {
            const count = await this.AnimalTemperament.count();
            if (count > 0) return;

            const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/animalTemperament.json'));
            const data = JSON.parse(rawdata);

            for (const query of data.query) {
                await this.sequelize.query(query);
            }

        } catch (err) {
            console.log('There was an error populating the AnimalTemperament Table', err);
        }
    }
}

module.exports = AnimalTemperamentService