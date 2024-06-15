module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    Question.associate = function(models){
      Question.belongsTo(sequelize.define("SetOfQuestions"));
      Question.hasMany(sequelize.define("Answer"));
    }
    return Question;
  };
