module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      await queryInterface.createTable(
        'urls',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          original_url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          short_url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          user_id: {
            type: Sequelize.STRING,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      await queryInterface.createTable(
        'clicks',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          url_id: {
            type: Sequelize.STRING,
            references: {
              model: 'urls',
              key: 'id',
            },
            allowNull: false,
          },
          user_id: {
            type: Sequelize.STRING,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      console.error('Error on create the migrations: ', error);
      await transaction.rollback();
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('clicks', { transaction });
      await queryInterface.dropTable('urls', { transaction });
      await queryInterface.dropTable('users', { transaction });

      await transaction.commit();
    } catch (error) {
      console.error('Error on drop the migrations: ', error);
      await transaction.rollback();
    }
  },
};
