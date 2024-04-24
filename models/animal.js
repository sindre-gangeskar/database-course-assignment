module.exports = (sequelize, Sequelize) => {
    const Animal = sequelize.define('Animal', {
        AnimalName: { allowNull: false, type: Sequelize.STRING },
        Birthday: { allowNull: false, type: Sequelize.DATEONLY },
        SpecieId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'Species',
                key: 'id'       
            },
            onUpdate: 'CASCADE', 
            onDelete: 'RESTRICT' 
        }
    }, { timestamps: false })

    Animal.associate = function (models) {
        Animal.belongsToMany(models.Temperament, { through: models.AnimalTemperament });
        Animal.hasOne(models.Adoption);
        Animal.belongsTo(models.Specie);
    }

    return Animal;
}