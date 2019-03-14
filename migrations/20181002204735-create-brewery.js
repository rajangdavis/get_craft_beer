'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('breweries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country:{
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.GEOMETRY('POINT', 3785),
      },
      features: {
        type: Sequelize.STRING
      },
      ba_link: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('breweries');
  }
};