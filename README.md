# messages-express

A simple messaging REST service implemented in node.js using the express genertor (with bits removed).
The application allows you to store and retrieve messages via http.
Messages are stored in memory and are lost when the server is stopped.

### Swagger

A rough API definition can be found on swaggerhub [here](https://app.swaggerhub.com/apis/Luke-Davies/Messages_API/1.0.0)

### Running the server:

- Download or clone the repository
- `cd` into messages-express
- `npm install` to install dependencies
- `npm start` will launch the server on localhost, port `3000`

### Calling the messages service

*Note that when calling the service with curl, the response body will not end with a newline (\n). I believe this is due to how express builds the http response. To make the output easier to read, you might want to use `-w '\n'` or `;echo` on the end of your curl commands.*

The following examples demonstrate calling the service on localhost:

Add a message:
```
$ curl localhost:3000/messages -d 'test message' -w '\n'
{"id":1000}
```
View the message:
```
$ curl localhost:3000/messages/1000 -w '\n'
test message
```
See all messages:
```
$ curl localhost:3000/messages -w '\n'
[{"id":1000,"text":"test message"}]
```
Clear all messages:
```
$ curl -X DELETE localhost:3000/messages -w '\n'

```

### Test cases:
A number of test cases are provided. These have been built using mocha, chai and supertest.
`npm test` will execute the test cases. This spins up a copy of the server on a random port - it does not use the server running on port 3000:

```
$ npm test

> messages-express@1.0.0 test /Users/lukedavies/work/projects/amigo/messages-express
> mocha ./tests/ -R list


    /messages GET returns all messages: GET /messages 200 3.791 ms - 106
  ✓ /messages GET returns all messages: 37ms
    /messages POST returns the id of the added nessage: POST /messages 201 14.169 ms - 11
  ✓ /messages POST returns the id of the added nessage: 21ms
    /messages POST adds a new urlencoded message: POST /messages 201 0.848 ms - 11
  ✓ /messages POST adds a new urlencoded message: 3ms
    /messages POST adds a new plain text message: POST /messages 201 0.546 ms - 11
  ✓ /messages POST adds a new plain text message: 2ms
    /messages POST returns 400 for unsupported request content types: POST /messages 400 0.456 ms - 34
  ✓ /messages POST returns 400 for unsupported request content types: 2ms
    /messages POST returns 400 for unsupported request content types: POST /messages 400 0.839 ms - 18
  ✓ /messages POST returns 400 for unsupported request content types: 4ms
    /messages POST returns 406 for unsupported accepts header: POST /messages 406 3.396 ms - 26
  ✓ /messages POST returns 406 for unsupported accepts header: 6ms
    /messages DELETE delete all messages: DELETE /messages 204 0.268 ms - -
  ✓ /messages DELETE delete all messages: 5ms
    /messages /:msgId GET returns a message when found: GET /messages/900 200 0.887 ms - 14
  ✓ /messages /:msgId GET returns a message when found: 4ms
    /messages /:msgId GET returns 400 when msgId not an integer: GET /messages/test 400 0.353 ms - 47
  ✓ /messages /:msgId GET returns 400 when msgId not an integer: 4ms
    /messages /:msgId GET returns 404 when not found: GET /messages/800 404 0.271 ms - 46
  ✓ /messages /:msgId GET returns 404 when not found: 2ms

  11 passing (121ms)

```


