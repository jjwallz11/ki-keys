'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Vehicles',
      [
        {
          ownerId: 1, // Ensure this owner ID matches an entry in the Users table
          year: 2003,
          make: 'Honda',
          model: 'Accord',
          vin: '1HGCM82633A123456',
          keyType: 'transponder',
          price: 75.00,
          previewImage: 'http://example.com/preview.jpg',
          keyImage: 'http://example.com/key.jpg',
          status: 'active-locked',
        },
        {
          ownerId: 2, // Ensure this owner ID matches an entry in the Users table
          year: 2010,
          make: 'Toyota',
          model: 'Camry',
          vin: '1HGCM82633A123789',
          keyType: 'high-security',
          price: 75.00,
          previewImage: 'http://example.com/preview.jpg',
          keyImage: 'http://example.com/key.jpg',
          status: 'active-key made',
        },
        {
          ownerId: 3, // Ensure this owner ID matches an entry in the Users table
          year: 2023,
          make: 'Dodge',
          model: 'Durango',
          vin: '1HGCM82633A789456',
          keyType: 'smart',
          price: 150.00,
          previewImage: 'http://example.com/preview.jpg',
          keyImage: 'http://example.com/key.jpg',
          status: 'paid',
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Vehicles', null, options);
  },
};
