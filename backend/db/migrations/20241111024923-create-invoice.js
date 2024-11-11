'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      locksmithId: {
        type: Sequelize.INTEGER
      },
      vehicleId: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.JSON
      },
      units: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      dueDate: {
        type: Sequelize.DATE
      },
      totalDue: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};