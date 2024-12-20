// backend/db/models/user.js
"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Vehicle, {
        foreignKey: "ownerId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Invoice, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Invoice, {
        foreignKey: "locksmithId",
        onDelete: "CASCADE",
      });
    }
  }

  User.init(
    {
      companyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      zip: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        len: [4, 30],
        isNotEmail(val) {
          if (Validator.isEmail(val)) {
            throw Error("Cannot be email.");
          }
        },
      },
      passwordHash: {
        type: DataTypes.STRING(60).BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "owner", "locksmith"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["passwordHash", "email", "createdAt", "updatedAt"],
        },
      },
    }
  );

  return User;
};
