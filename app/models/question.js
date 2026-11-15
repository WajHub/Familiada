module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Collection",
          key: "id"
        }
      }
    });
    Question.associate = function(models) {
      Question.belongsTo(models.Collection, { foreignKey: 'collectionId' });
      Question.hasMany(models.Answer, { foreignKey: 'questionId' });
    };
    return Question;
  };
