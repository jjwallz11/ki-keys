// backend/db/migrations/20241111024552-create-user.js
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      address: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(512)
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      zip: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        validate: {
          isEmail: {
            msg: "Please provide a valid email address"
          }
        },
        unique: true
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30),
      },
      passwordHash: {
        allowNull: false,
        type: Sequelize.STRING(60)
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('admin', 'owner', 'locksmith')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    });
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['address']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  }
};