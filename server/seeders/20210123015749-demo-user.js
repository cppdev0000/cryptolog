'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'demo@demo.com',
      passwordHash: '$2b$10$5VbHYzJjZT11Y79vGqbdcer08lpnNi9Cr2wsxx77YU23VY7Co.aAW|$2b$10$5VbHYzJjZT11Y79vGqbdce',
      totalCashIn: 0.0,
      totalFees: 0.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
