'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Locksmiths',
      [
        {
          userId: 2, // Ensure this user ID matches an entry in the Users table
          companyName: 'Leeno Pro',
          address: '456 Elm St',
          city: 'Leenotown',
          state: 'LT',
          zip: '67890',
          country: 'USA',
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locksmiths', null, options);
  },
};
