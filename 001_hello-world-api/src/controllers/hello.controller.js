const constants = require('../config/constants');

const helloController = {
  // GET / - Welcome endpoint
  getWelcome: (req, res) => {
    const response = {
      success: true,
      message: constants.MESSAGES.WELCOME,
      instructions: constants.MESSAGES.INSTRUCTIONS,
      timestamp: new Date().toISOString(),
      endpoints: [
        {
          method: "GET",
          path: "/",
          description: "Welcome message and instructions"
        },
        {
          method: "POST",
          path: "/hello",
          description: "Get a personalized greeting",
          example_request: {
            name: "John"
          },
          example_response: {
            message: "Hello, John! 👋 Welcome to our API!"
          }
        }
      ]
    };

    res.status(constants.STATUS.SUCCESS).json(response);
  },

  // POST /hello - Personalized greeting
  postHello: (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(constants.STATUS.BAD_REQUEST).json({
          success: false,
          error: constants.MESSAGES.ERRORS.NO_NAME,
          timestamp: new Date().toISOString()
        });
      }

      const response = {
        success: true,
        message: constants.MESSAGES.SUCCESS.HELLO.replace('{name}', name),
        data: {
          name: name,
          greeting: `Hello, ${name}!`,
          timestamp: new Date().toISOString(),
          request_id: Date.now() // Simple request ID
        }
      };

      res.status(constants.STATUS.SUCCESS).json(response);
    } catch (error) {
      res.status(constants.STATUS.SERVER_ERROR).json({
        success: false,
        error: constants.MESSAGES.ERRORS.SERVER_ERROR,
        timestamp: new Date().toISOString()
      });
    }
  }
};

module.exports = helloController;