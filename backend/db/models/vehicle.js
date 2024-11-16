// backend/models/vehicle.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.belongsTo(models.User, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      Vehicle.hasMany(models.Invoice, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
      Vehicle.hasMany(models.Image, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
    }
  }

  Vehicle.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      make: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      vin: {
        type: DataTypes.STRING(17),
        unique: true,
        allowNull: false,
      },
      keyType: {
        type: DataTypes.ENUM('smart', 'transponder', 'high-security'),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      previewImage: DataTypes.STRING(512),
      keyImage: DataTypes.STRING(512),
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Vehicle',
    }
  );

  return Vehicle;
};
