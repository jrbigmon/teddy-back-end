module.exports = {
  up: async (queryInterface) => {
    try {
      return await queryInterface.createDatabase('url_shortener');
    } catch (error) {
      console.error(
        'Error creating the database url_shortener: ',
        error.message,
      );
    }
  },

  down: async (queryInterface) => {
    try {
      return await queryInterface.dropDatabase('url_shortener');
    } catch (error) {
      console.error(
        'Error dropping the database url_shortener: ',
        error.message,
      );
    }
  },
};
