// backend/models/invoice.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Invoice.belongsTo(models.User, { foreignKey: 'locksmithId', onDelete: 'CASCADE' });
      Invoice.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
    }
  }

  Invoice.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locksmithId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: DataTypes.JSON,
      units: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amount: DataTypes.DECIMAL(10, 2),
      dueDate: DataTypes.DATE,
      totalDue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
    }
  );

  return Invoice;
};
