'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Invoices',
      [
        {
          userId: 2, // Matches an entry in the Users table
          locksmithId: 1, // Matches an entry in the Users table
          vehicleId: 1, // Matches an entry in the Vehicles table
          description: JSON.stringify({ service: 'Key creation' }),
          units: 1,
          price: 150.00,
          amount: 150.00,
          dueDate: new Date(),
          totalDue: 150.00,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Invoices', null, options);
  },
};
