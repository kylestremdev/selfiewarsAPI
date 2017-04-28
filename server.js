var express   = require("express"),
    bP        = require("body-parser"),
    path      = require("path"),
    app       = express();

require("./server/config/mongoose.js")

app.use(bP.urlencoded({extended:true}));
app.use(bP.json())

require("./server/config/routes.js")(app);

app.listen(8000, function () {
  console.log("Server running on port 8000")
})
