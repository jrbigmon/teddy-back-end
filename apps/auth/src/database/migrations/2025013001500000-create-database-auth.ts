module.exports = {
  up: async (queryInterface) => {
    try {
      return await queryInterface.createDatabase('auth');
    } catch (error) {
      console.error('Error creating the database auth: ', error.message);
    }
  },

  down: async (queryInterface) => {
    try {
      return await queryInterface.dropDatabase('auth');
    } catch (error) {
      console.error('Error dropping the database auth: ', error.message);
    }
  },
};
