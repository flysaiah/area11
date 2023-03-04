const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: false},
  password: { type: String, required: true, unique: false, lowercase: false},
  bestgirl: { type: String, required: true, unique: false, lowercase: false},
  bioDisplay: { type: String, required: true, unique: false, lowercase: false}, // What we display on group page -- ex. best girl, best boy
  avatar: String,
  group: String,   // name of the group
  autoTimelineAdd: Boolean,
  fireworks: Boolean,
  bestboy: String,
  warnMe: Boolean
});

// This runs any time the user Schema is activated
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Encrypt password
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

// unencrypt
userSchema.methods.comparePassword = function(password) {
  // returns boolean; if true, then pass & this.pass are a match
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
