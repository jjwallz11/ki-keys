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
          passwordHash: bcrypt.hashSync('password123', 10),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          companyName: 'Repo Pros',
          address: '456 Elm St',
          city: 'Locktown',
          state: 'LT',
          zip: '67890',
          country: 'USA',
          email: 'owner@repopros.com',
          passwordHash: bcrypt.hashSync('ownerpass', 10),
          role: 'owner',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          companyName: 'Leeno Pro',
          address: '456 Elm St',
          city: 'Leenotown',
          state: 'LT',
          zip: '67890',
          country: 'USA',
          email: 'locksmith@leenopro.com',
          passwordHash: bcrypt.hashSync('locksmithpass', 10),
          role: 'locksmith',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, options);
  },
};
