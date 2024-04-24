module.exports = (sequelize, Sequelize) => {
    const AnimalTemperament = sequelize.define('AnimalTemperament', {
        AnimalId: { allowNull: false, type: Sequelize.INTEGER },
        TemperamentId: { allowNull: false, type: Sequelize.INTEGER }
    }, { timestamps: false });

    AnimalTemperament.associate = function (models) {
        AnimalTemperament.belongsTo(models.Temperament, {foreignKey: 'TemperamentId'});
        AnimalTemperament.belongsTo(models.Animal, {foreignKey: 'AnimalId'});
    }
    return AnimalTemperament;
}