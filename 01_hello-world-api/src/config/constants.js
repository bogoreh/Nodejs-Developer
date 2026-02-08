module.exports = {
  MESSAGES: {
    WELCOME: "Welcome to the Hello World API! 👋",
    INSTRUCTIONS: {
      GET: "Use GET / to see this message",
      POST: "Use POST /hello with a JSON body containing 'name' to get a personalized greeting"
    },
    ERRORS: {
      NO_NAME: "Please provide a 'name' in the request body",
      SERVER_ERROR: "Something went wrong on our end"
    },
    SUCCESS: {
      HELLO: "Hello, {name}! 👋 Welcome to our API!"
    }
  },
  STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500
  }
};