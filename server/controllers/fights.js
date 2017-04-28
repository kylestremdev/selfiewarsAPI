var mongoose  = require("mongoose");

// Models

var User = mongoose.model("User");
var Fight = mongoose.model("Fight");
var Selfie = mongoose.model("Selfie");

module.exports = {
  generateFight: function (req, res) {

    console.log(req.params.user_id);

    var newFight = new Fight({});

    var func;

    console.log("before find eligibleSelfies");
    findEligibleSelfies(req.params.user_id, func, function (data){

      func = data;

      console.log("after find eligibleSelfies");
      console.log("func: " + func);

      if (func) {
        newFight.left = func[0];
        newFight.right = func[1];
        newFight.user = func[2]._id;

        newFight.save()
        .then(function (fight) {
          return res.json(fight);
        }, function (err) {
          console.log(err);
          return res.sendStatus(400);
        })
      } else {
        return res.sendStatus(400);
      }
    })
  },

  updateFight: function (req, res) {
    console.log("============ updateFight ============");
    Fight.findById(req.body.fight_id).populate("left right").exec()
    .then(function (fight) {

      User.findById(req.body.user_id).exec()
      .then(function (user) {
        user.fights.push(fight);

        console.log(req.body);

        if (req.body.none == "1") {
          console.log("none");
          fight.none = true;

          fight.left.losses.push(fight);
          fight.right.losses.push(fight);

          fight.left.save().catch(function (err) { return res.sendStatus(400)});
          fight.right.save().catch(function (err) { return res.sendStatus(400)});
          fight.save().catch(function (err) { return res.sendStatus(400)});

          return res.sendStatus(200);
        } else if (req.body.left_win == "1") {
          console.log("left");
          fight.left_win = true;

          fight.left.wins.push(fight);
          fight.right.losses.push(fight);

          fight.left.save().catch(function (err) { return res.sendStatus(400)});
          fight.right.save().catch(function (err) { return res.sendStatus(400)});
          fight.save().catch(function (err) { return res.sendStatus(400)});

          return res.sendStatus(200);
        } else if (req.body.right_win == "1") {
          console.log("fight");
          fight.left_win = true;

          fight.left.losses.push(fight);
          fight.right.wins.push(fight);

          fight.left.save().catch(function (err) { return res.sendStatus(400)});
          fight.right.save().catch(function (err) { return res.sendStatus(400)});
          fight.save().catch(function (err) { return res.sendStatus(400)});

          return res.sendStatus(200);
        }

      }, function (err) {
        return res.sendStatus(400);
      })




    }, function (err) {
      return res.status(400).send(err);
    })
  }
}

function findEligibleSelfies(user_id, func, callback) {
  var left, right;

  User.findById(user_id).populate({path: "fights", populate: {path: "left right"}}).exec()
  .then(function (user) {
    Selfie.find().where("user").ne(user).exec()
    .then(function (eligibleSelfies) {

      // console.log("eligibleSelfies: " + eligibleSelfies);

      var left_idx = genRandomIdx(-1, -1, eligibleSelfies.length);
      var right_idx = genRandomIdx(left_idx, -1, eligibleSelfies.length);

      var cycle_count = 0
      var turn_count = 0

      var selfieArr = nonConflictHandler(left_idx, right_idx, user.fights, eligibleSelfies)

      if (selfieArr !== false) {
        left = selfieArr[0];
        right = selfieArr[1];

        console.log("findEligibleSelfies: " + [left, right, user]);
        func = [left, right, user];

        callback(func)
      } else {
        return false
      }

    }, function(err) {
      console.log(err);
      return false;
    })
  }, function (err) {
    console.log(err);
    return false;
  })
}

function nonConflictHandler(left_idx, right_idx, fights, selfiePool) {

  // console.log([left_idx, right_idx, fights, selfiePool]);

  var left = selfiePool[left_idx];
  var right = selfiePool[right_idx];

  console.log("left / right : " + [left,right]);

  console.log("elgibility: " + checkEligiblity(left, right, fights));

  while(!checkEligiblity(left, right, fights) && cycle_count < 20) {

    console.log(checkEligiblity(left, right, fights));

    var new_right_idx = genRandomIdx(left_idx, right_idx, selfiePool.length);
    right = selfiePool[new_right_idx]

    cycle_count++;

    if (cycle_count == 20) {
      var new_left_idx = genRandomIdx(left_idx, right_idx, selfiePool.length);
      left = selfiePool[new_left_idx];

      cycle_count == 0;
      turn_count++;
    }

    if (turn_count == 5) {
      return false
    }
  }


  return [left, right]
}

function checkEligiblity(left, right, fights) {
  console.log("checkEligiblity");

  // return true;

  if (!fights) {
    console.log("true");
    return true
  }

  for (var fight_idx; fight_idx < fights.length; fight_idx++) {

    if (!fights[fight_idx]) {
      console.log("false");
      return false
    } else {
      if (fights[fight_idx].left._id == fights[fight_idx].right._id) {
        console.log("false");
        return false;
      }
    }
  }

  console.log("true");
  return true;
}

function genRandomIdx(unwanted_idx1, unwanted_idx2, length) {
  if (length < 2) {
    return 0;
  }

  function inner() {
    return Math.floor(Math.random() * length);
  }

  var randIdx = inner();

  while (randIdx == unwanted_idx1 || randIdx == unwanted_idx2) {
    randIdx = inner();
  }

  return randIdx;
}
