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
  
    return Answer;
  };