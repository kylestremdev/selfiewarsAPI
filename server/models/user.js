var mongoose  = require("mongoose"),
    Schema    = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function(v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: "Must have a valid email"
    },
    lowercase: true
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    validate: {
      validator: function(v) {
        return v.length > 4
      },
      message: "Username must be at least 5 characters"
    }
  },
  password_hash: {
    type: String,
    required: [true, "Password is required"]
  },

  selfies: [{
    type: Schema.Types.ObjectId,
    ref: 'Selfie'
  }],

  fights: [{
    type: Schema.Types.ObjectId,
    ref: 'Fight'
  }]
}, {timestamps: true});

mongoose.model("User", UserSchema);
