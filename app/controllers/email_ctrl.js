var eg = require('emptygif');

var Wregx = require("./../../lib/wregx");
var Errors = require("./../../lib/errors");

var Record = require("./../models/record");

var EmailCtrl = {
  sendTrackingPixel: function(req, res) {
    eg.sendEmptyGif(req, res, {
      'Content-Type': 'image/gif',
      'Content-Length': eg.emptyGifBufferLength,
      'Cache-Control': 'public, max-age=0'
    });
  }, // end sendTrackingPixel

  markRead: function(req, res, next) {
    // the user has GET'd the tracking pixel, log it
    var id = req.query.id;
    if (!Wregx.isHexstr(id))
      return next(Errors.invalidId());
    // errelseug
    Record.getById(id).then(function(r) {
      // good it exists, is it read?
      if (r.x.email.read)
        throw Errors.mailAlreadyRead();
      // not read
      Record.update({_id: id}, {$set:{"x.email.read": true}}).then(function(result) {
        /* enable for debug
        res.send(JSON.stringify({
          marked_read: 1
        }));
        */
        // send them the image
        EmailCtrl.sendTrackingPixel(req, res);
      }).catch(function(e) {
        throw e;
        //throw Errors.mailMarkRead();
      });
    }).catch(function(e) {
      /* enable for debug
      res.send(e);
      */
      // still give it to them, we had a deal
      EmailCtrl.sendTrackingPixel(req, res);
    });
  }, // end markRead method

  newMail: function(req, res) {
    // create a new mail record in the db

  } // end new mail method
};


module.exports = EmailCtrl;

