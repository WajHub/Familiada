module.exports = (sequelize, DataTypes) => {
    const SetOfQuestions = sequelize.define('SetOfQuestions', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    SetOfQuestions.associate = function(models) {
        SetOfQuestions.hasMany(models.Question, { foreignKey: 'setOfQuestionsId' });
      };
    return SetOfQuestions;
};