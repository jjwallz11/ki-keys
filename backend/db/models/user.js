// backend/db/models/user.js
'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    companyName: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};