// backend/models/image.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
      Image.belongsTo(models.Key, { foreignKey: 'keyId', onDelete: 'CASCADE' });
    }
  }

  Image.init(
    {
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      keyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );

  return Image;
};
