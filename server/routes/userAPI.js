const User = require('../models/user.js');

module.exports = (router) => {
    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }, {password:0}).exec((err, user) => {
          if (err) {
            res.json({ success: false, message: err});
          } else if (!user) {
            res.json({ success: false, message: 'No user found' })
          } else {
            res.json({ success: true, data: { user: user }})
          }
        });
    });

    return router;
}
