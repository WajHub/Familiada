module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Question',
          key: 'id'
        }
      }
    });
    
    Answer.associate = function(models){
      Answer.belongsTo(models.Question);
    }

    Answer.compareByPointsFn = function(a, b){
      if(a.points > b.points) {
        return -1;
      }
      else if(a.points < b.points){
        return 1;
      }
      else {
        return 0;
      }
    }
  
    return Answer;
  };