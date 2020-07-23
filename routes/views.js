var express = require('express');
const router = express.Router();
const aeh = require('../middleware/asyncErrorHandler');
const UserView = require("../models/UserView");

/* POST API:  Add User Data. */
router.post('/:userId', aeh(async function (req, res) {
  const userId = req.params.userId;
  var dbData = {};
  console.log("new date", new Date())
  if (!isNaN(userId) && userId > 0) {
    dbData.userId = userId;
    dbData.distance = req.body.distance && !isNaN(req.body.distance) ? req.body.distance : null;
    dbData.startTime = req.body.startTime ? new Date(req.body.startTime) : null;
    var timeRequired = req.body.timeRequired ? req.body.timeRequired.split(":") : null;
    dbData.endTime = new Date(dbData.startTime);
    dbData.endTime = new Date(dbData.endTime.setHours(parseInt(dbData.startTime.getHours()) + parseInt(timeRequired[0])));
    dbData.endTime = new Date(dbData.endTime.setMinutes(parseInt(dbData.endTime.getMinutes()) + parseInt(timeRequired[1])));
    dbData.endTime = dbData.endTime.setSeconds(parseInt(dbData.endTime.getSeconds()) + parseInt(timeRequired[2]));

    const UserViewObj = new UserView(dbData);
    UserViewObj.save(function (err, data) {
      if (err) {
        return res.status(404).error('Error Found', err);
      } else {
        res.success('Data Found', data);
      }
    })

  } else {
    return res.status(404).error('Incorrect User Id', userId);
  }

}));

/* GET API:  Get User Data. */
router.get('/:userId', aeh(async function (req, res, next) {
  const userId = req.params.userId;

  var dbQuery = {}, group = {}, project = {}, match = {};

  if (!isNaN(userId) && userId > 0) {
    dbQuery.userId = userId;
    group = {
      $group: {
        _id: "$userId",
        distance: {
          $sum: "$distance"
        }
      }
    }

    dbQuery.startTime = { $gte: req.body.startTime };
    dbQuery.endTime = { $lt: req.body.endTime };
    match = { $match: dbQuery };

    project = { $project: { _id: 0, userId: "$_id", TotalDistance: "$distance" } };

    const UserViewData = await UserView.aggregate([
      match,
      group,
      project,
    ]);

    res.success('Data', UserViewData);

  } else {
    return res.status(404).error('Incorrect Product Id', userId);
  }

}));

module.exports = router;

