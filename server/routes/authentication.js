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
          if (user.comparePassword(req.body.password)) {
            const token = jwt.sign({ username: user.username, userId: user._id }, config.secret, { expiresIn: '504h' });
            res.json({ success: true, message: "Success", data: { token: token, user: { username: user.username } }});
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
      res.json({ success: false, message: "Area11Error.Auth - Error verifying JWT token: No token found" });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.log("Error verifying JWT token: " + err?.message);
          res.json({ success: false, message: "Area11Error.Auth - " + err?.message });
        } else {
          req.decoded = decoded;
          next();
        }
      })
    }
  });

  return router;
}
