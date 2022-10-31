const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.js')
module.exports = (router) => {

  router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
      res.json({ success: false, message: "Username/password not provided" });
    } else {
      User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else if (!user) {
            res.json({ success: false, message: "Username not found." });
        } else {
          // Need this because of hashed passwords
          if (user.comparePassword(req.body.password)) {
            // Password checks out
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '504h' });
            res.json({ success: true, message: "Success", token: token, user: { username: user.username }});
          } else {
            res.json({ success: false, message: "Incorrect password." });
          }
        }
      })
    }
  });

  // Any route that requires authentication goes after this middleware
  router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      res.json({ success: false, message: "Token" });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: "Token" });
        } else {
          req.decoded = decoded;
          next();
        }
      })
    }
  });

  return router;
}
