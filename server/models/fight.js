var mongoose  = require("mongoose"),
    Schema    = mongoose.Schema;

var FightSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  left: {
    type: Schema.Types.ObjectId,
    ref: "Selfie"
  },

  right: {
    type: Schema.Types.ObjectId,
    ref: "Selfie"
  },

  none: {type: Boolean, default: false},
  left_win: {type: Boolean, default: false},
  right_win: {type: Boolean, default: false}
}, {timestamps: true});

mongoose.model("Fight", FightSchema);
