module.exports = (sequelize, Sequelize) => {
    const Adoption = sequelize.define('Adoption', {
        UserId: { allowNull: false, type: Sequelize.INTEGER, foreignKey: 'UserId' },
        AnimalId: { allowNull: false, type: Sequelize.INTEGER, foreignKey: 'AnimalId', unique: true }
    }, { timestamps: false
    });
    
    Adoption.associate = function (models) {
        Adoption.belongsTo(models.User, { foreignKey: 'UserId' });
        Adoption.belongsTo(models.Animal, { foreignKey: 'AnimalId' });
    }
    return Adoption;
}
