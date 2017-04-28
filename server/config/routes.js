// Controllers

var users = require("./../controllers/users.js");
var selfies = require("./../controllers/selfies.js");
var fights = require("./../controllers/fights.js");

module.exports = function (app) {
  app.post("/login", users.login);
  app.post("/register", users.register);
  app.post("/getUser", users.getUser);

  app.post("/upload", selfies.create);
  app.post("/getUserSelfies", selfies.user_selfies);
  app.get("/recent", selfies.recent);

  app.get("/fight/:user_id", fights.generateFight);
  app.post("/fightFinish", fights.updateFight);
}
