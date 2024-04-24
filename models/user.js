module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        FullName: { allowNull: false, type: Sequelize.STRING },
        Username: { allowNull: false, type: Sequelize.STRING, unique: true },
        Password: { allowNull: false, type: Sequelize.STRING },
        RoleId: { allowNull: false, type: Sequelize.INTEGER, defaultValue: 1 },
    }, { timestamps: false })

    User.associate = function (models) {
        User.hasMany(models.Adoption);
        User.belongsTo(models.Role, { foreignKey: 'RoleId' });
    }

    return User;
}
