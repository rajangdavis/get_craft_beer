'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('styles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ba_link: {
        type: Sequelize.STRING
      },
      abv_range: {
        type: Sequelize.STRING
      },
      ibu_range: {
        type: Sequelize.STRING
      },
      glassware: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('styles');
  }
};