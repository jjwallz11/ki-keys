'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    userId: DataTypes.INTEGER,
    locksmithId: DataTypes.INTEGER,
    vehicleId: DataTypes.INTEGER,
    description: DataTypes.JSON,
    units: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    dueDate: DataTypes.DATE,
    totalDue: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};