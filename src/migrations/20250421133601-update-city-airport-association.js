'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Airports', {
      fields: ['cityId'],
      type: 'FOREIGN KEY',
      name: 'city_fkey_constraint', // optional
      references: {
        table: 'Cities',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Airports', 'city_fkey_constraint');
  }
};
