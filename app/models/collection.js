module.exports = (sequelize, DataTypes) => {
    const Collection = sequelize.define('Collection', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Collection.associate = function(models) {
        Collection.hasMany(models.Question, { foreignKey: 'collectionId' });
      };
    return Collection;
};