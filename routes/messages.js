var express = require('express');
var router = express.Router();

/* GET all messages. */
router.get('/', function(req, res) {
  res.status(200).json(req.app.locals.messages);
});

/* POST a new message */
router.post('/', function(req, res) {
  if(!req.accepts(["application/json"])) {
    res.status(406).send("Accept type not supported.")
    return;
  }

  // if not support request content type
  if(!["application/x-www-form-urlencoded","text/plain"].includes(req.get("Content-Type"))) {
    res.status(400).send("Request content type not supported");
    return;
  }

  /*  
   * "curl -d" sends data as urlencoded.
   * This means curl <url> -d 'my message' will be handled by express as a key-value pair, with no value.
   * Object.keys used on body to handle this. 
   * Included option to post raw text as well. E.g. curl -X POST -H 'Content-Type: text/plain' -d 'my message'
  */
  var messageTxt = req.is("application/x-www-form-urlencoded") ? Object.keys(req.body)[0] : req.body;

  if(messageTxt == "") {
    res.status(400).send("No data provideds.")
    return;
  }

  var messageId = req.app.locals.nextMsgId();
  var message = {id: messageId, text: messageTxt};

  req.app.locals.messages.push(message);;

  var result = {id: messageId};
  res.status(201).json(result);
});

/* DELETE all messages */
router.delete('/', function(req, res) {
  req.app.locals.messages = {};
  res.status(204).send();
});

/* Fetch a message by it's id */
router.get('/:msgId', function(req, res) {
  res.type('text/plain');

  if(isNaN(req.params.msgId)) {
    res.status(400).send("Expected integer for ID. Instead received: " + req.params.msgId);
    return;
  }

  var message = req.app.locals.messages.find((msg) => msg.id == req.params.msgId);

  if(message == null) {
    res.status(404).send("No message was found for the given message ID.");
    return;
  }
  
  res.status(200).send(message.text);
});

module.exports = router;
