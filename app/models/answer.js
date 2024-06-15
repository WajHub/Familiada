module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
    
    Answer.associate = function(models){
      Answer.belongsTo(sequelize.define("Question"));
    }
  
    return Answer;
  };