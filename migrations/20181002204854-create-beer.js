'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('beers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      brewery_id: {
        type: Sequelize.INTEGER
      },
      style_id: {
        type: Sequelize.INTEGER
      },
      ba_link: {
        type: Sequelize.STRING
      },
      brewery_link: {
        type: Sequelize.STRING
      },
      style_link: {
        type: Sequelize.STRING
      },
      ba_availability: {
        type: Sequelize.STRING
      },
      ba_description: {
        type: Sequelize.TEXT
      },
      abv: {
        type: Sequelize.FLOAT
      },
      rating_counts: {
        type: Sequelize.INTEGER
      },
      total_score: {
        type: Sequelize.FLOAT
      },
      beer_flavor_wheel: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      review_text_json: {
        type: Sequelize.JSONB 
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('beers');
  }
};