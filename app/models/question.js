module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    
    return Question;
  };
