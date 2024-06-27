const setOfQuestions = require("./setOfQuestions");

module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      setOfQuestionsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SetOfQuestions",
          key: "id"
        }
      }
    });
    Question.associate = function(models) {
      Question.belongsTo(SetOfQuestions);
      Question.hasMany(models.Answer, { foreignKey: 'questionId' });
    };
    return Question;
  };
