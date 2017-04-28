var mongoose  = require("mongoose");

// Models

var User = mongoose.model("User");

module.exports = {
  login: function (req, res) {
    User.findOne({username: req.body.username}).exec()
    .then(function (user) {
      if (!user) {
        return res.sendStatus(400);
      }
      if (user.password_hash == req.body.password_hash) {
        return res.json(user);
      } else {
        return res.sendStatus(400);
      }
    }, function (err) {
      return res.sendStatus(400);
    })
  },

  register: function (req, res) {
    var newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password_hash: req.body.password_hash
    });

    newUser.save()
    .then(function (user) {
      return res.json(user)
    }, function (err) {
      console.log(err);
      return res.status(400).send(err);
    });
  },

  getUser: function (req, res) {
    User.findById(req.body.user_id).exec()
    .then(function (user) {
      console.log(user);
      return res.json(user);
    }, function (err) {
      return res.sendStatus(400);
    })
  }
}
