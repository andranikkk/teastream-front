require("dotenv/config");

module.exports = {
  service: {
    endpoint: {
      uri: process.env.NEXT_PUBLIC_SERVER_URL,
      skipSSLValidation: true,
    },
  },
};
