var mongoose  = require("mongoose"),
    Schema    = mongoose.Schema;

var SelfieSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  img_id: {
    type: String,
    required: true
  },

  s3_link: {
    type: String,
    required: true
  },

  wins: [{
    type: Schema.Types.ObjectId,
    ref: "Fight"
  }],

  losses: [{
    type: Schema.Types.ObjectId,
    ref: "Fight"
  }]
}, {timestamps: true});

mongoose.model("Selfie", SelfieSchema);
