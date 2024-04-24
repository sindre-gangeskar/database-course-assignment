const fs = require('fs');
const path = require('path');

class RoleService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Role = db.Role;
        this.User = db.User;
    }
    
    async populate() {
        try {
            const count = await this.Role.count();
            if (count > 0) {
                console.log('Roles Table is already populated...');
                return;
            }

            const rawdata = fs.readFileSync(path.resolve(__dirname, '../public/json/roles.json'));
            const data = JSON.parse(rawdata);
            for (const query of data.query) {
                await this.sequelize.query(query);
            }

        } catch (err) {
            console.error('An error has occured populating Roles table: ', err);
        }
    }
    async getRoleTypeName(userId) {
        const user = await this.User.findByPk(userId, { include: this.Role });
        if (user && user.Role) {
            return user.Role.Type;
        }
        else return null;
    }
}

module.exports = RoleService;