module.exports = (sequelize, Sequelize) => {
    const Temperament = sequelize.define('Temperament', {
        TemperamentName: { allowNull: false, type: Sequelize.STRING, unique: true },
    }, { timestamps: false })

    Temperament.associate = function (models) {
        Temperament.belongsToMany(models.Animal, {
            through: models.AnimalTemperament,
            onDelete: 'RESTRICT'
        })
    }
    return Temperament;
}