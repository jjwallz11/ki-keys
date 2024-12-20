'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          companyName: 'KiKeys King',
          address: '123 Main St',
          city: 'Sample City',
          state: 'SC',
          zip: '12345',
          country: 'USA',
          email: 'admin@example.com',
          username: 'JJpdez13',
          passwordHash: bcrypt.hashSync('pass123', 10),
          role: 'admin',
        },
        {
          companyName: 'Repo Pros',
          address: '457 Elm St',
          city: 'Locktown',
          state: 'LT',
          zip: '67890',
          country: 'USA',
          email: 'owner@repopros.com',
          username: 'NYg4eva',
          passwordHash: bcrypt.hashSync('ownerpass', 10),
          role: 'owner',
        },
        {
          companyName: 'Leeno Pro',
          address: '456 Elm St',
          city: 'Leenotown',
          state: 'LT',
          zip: '67890',
          country: 'USA',
          email: 'locksmith@leenopro.com',
          username: 'leanDashO7',
          passwordHash: bcrypt.hashSync('locksmithp', 10),
          role: 'locksmith',
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, options);
  },
};
