const ObjectId = require('mongodb').ObjectId;
const Timeline = require('../models/timeline.js');
const User = require("../models/user.js");
const Group = require("../models/group.js");

module.exports = (router) => {
  router.post('/saveTimeline', (req, res) => {
    // Save state of timeline (currently only possible after editing 1 era at a time)
    Timeline.findOneAndUpdate({ "user": ObjectId(req.decoded.userId) }, { $set: { eras: req.body.eras } }, (err, timeline) => {
      if (err) {
        res.json({ success: false, message: err });
      } else if (!timeline) {
        res.json({ success: false, message: "Timeline not found" });
      } else {
        res.json({ success: true, message: "Timeline updated successfully!" });
      }
    });
  });

  router.post('/fetchTimeline', (req, res) => {

    if (req.body.user) {
      // First make sure both users are in the same group
      User.findOne({ "username": req.body.user }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else if (!user) {
          res.json({ success: false, message: "Permission denied" });
        } else {
          if (!user.group) {
            res.json({ success: false, message: "Permission denied" });
          }
          Group.findOne({ "name": user.group }, (err, group) => {
            if (err) {
              res.json({ success: false, message: err });
            } else if (!group) {
              res.json({ success: false, message: "Permission denied" });
            } else {
              let found = false;
              for (let member of group.members) {
                if (!member.isPending && member.id == req.decoded.userId) {
                  found = true;
                }
              }
              if (!found) {
                res.json({ success: false, message: "Permission denied" });
              } else {
                Timeline.findOne({ "user": ObjectId(user._id) }, (err, timeline) => {
                  if (err) {
                    res.json({ success: false, message: err });
                  } else if (!timeline) {
                    res.json({ success: true });
                  } else {
                    res.json({ success: true, timeline: timeline });
                  }
                });
              }
            }
          });
        }
      });
    } else {
      // If no user argument is specified, just look up the user's own timeline
      Timeline.findOne({ "user": ObjectId(req.decoded.userId) }, (err, timeline) => {
        if (err) {
          res.json({ success: false, message: err });
        } else if (!timeline) {
          res.json({ success: true });
        } else {
          res.json({ success: true, timeline: timeline });
        }
      });
    }
  });

  return router;
}
