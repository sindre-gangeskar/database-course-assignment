module.exports = (sequelize, Sequelize) => {
    const Specie = sequelize.define('Specie', {
        SpecieName: {allowNull: false, type: Sequelize.STRING, unique: true},
        Size: {allowNull: false, type: Sequelize.STRING}
    }, { timestamps: false })

    Specie.associate = function (models) {
        Specie.hasMany(models.Animal);
    }

    return Specie;
}