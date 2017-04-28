var mongoose  = require("mongoose");

// Models

var User = mongoose.model("User");
var Selfie = mongoose.model("Selfie");

module.exports = {
  create: function(req, res) {
    var newSelfie = new Selfie({
      user: req.body.user_id,
      s3_link: req.body.s3_link,
      img_id: req.body.img_id
    });

    User.findById(req.body.user_id).exec()
    .then(function (user) {
      user.selfies.push(newSelfie)

      return user.save()
    }, function (err) {
      return res.sendStatus(400);
    }).then(function (saved_user) {
      newSelfie.save()
      .then(function (selfie) {
        return res.sendStatus(200);
      }, function (err) {
        console.log(err);
        return res.sendStatus(400);
      });
    });

  },

  user_selfies: function (req, res) {
    User.findById(req.body.user_id).exec()
    .then(function (user) {
      Selfie.find({user: user}).exec()
      .then(function (selfies) {
        return res.json(selfies);
      }, function (err) {
        console.log(err);
        return res.sendStatus(400);
      })
    })
  },

  recent: function(req, res) {
    Selfie.find({}).sort("createdAt").exec()
    .then(function (selfies) {
      return res.json(selfies);
    }, function (err) {
      console.log(err);
      return res.sendStatus(400);
    })
  },

  delete: function (req, res) {
    Selfie.remove({_id: req.params.selfie_id}).exec()
    .then(function () {
      return res.sendStatus(200);
    }, function (err) {
      console.log(err);
      return res.sendStatus(400);
    })
  }
}
