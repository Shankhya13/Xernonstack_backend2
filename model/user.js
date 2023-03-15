const user = function (user) {
  (this.name = user.name), (this.password = user.password);
};

module.exports = user;
