const collection = require("./collection");

module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
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
      Question.belongsTo(collection);
      Question.hasMany(models.Answer, { foreignKey: 'questionId' });
    };
    return Question;
  };
