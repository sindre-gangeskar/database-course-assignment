const fs = require('fs');
const path = require('path');
class UserService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
    }
    
    async populate() {
        try {
            const count = await this.User.count();
            if (count > 0) {
                console.log('Users Table is already populated...');
                return;
            };

            const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/users.json'));
            const data = JSON.parse(rawdata);

            for (const query of data.query) {
                await this.sequelize.query(query);
            }
        }
        catch (err) {
            console.error('There was an error populating table Users', err);
        }
    }
    async getOneByName(username) {
        return this.User.findOne({ where: { Username: username }, include: [ this.Role ] })
    }
    async create(username, password, firstname, lastname) {
        try {
            var fullname = `${firstname} ${lastname} `
            return await this.User.create({
                Username: username,
                Password: password,
                Firstname: firstname,
                Lastname: lastname,
                FullName: fullname
            })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const message = `A user with username: '${username}' already exists, please use a different username`;
                console.log(message);
                return { error: message };
            }
            else {
                throw new Error('An error has occured', error);
            }
        }
    }
}

module.exports = UserService;