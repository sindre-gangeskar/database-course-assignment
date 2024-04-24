module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        Type: { allowNull: false, type: Sequelize.STRING}
    }, { timestamps: false });

    return Role;
}