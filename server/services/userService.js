const User = require("../models/User");

const createUserService = () => ({
  getById: (id) => User.findById(id),
});

module.exports = createUserService;