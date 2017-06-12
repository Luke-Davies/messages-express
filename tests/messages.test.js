var app = require('../app.js');
var request = require('supertest')(app);
var should = require('chai').should();

var testMessages = [
    {'id': 900, 'text': "Test Message 1"},
    {'id': 901, 'text': "Test Message 2"},
    {'id': 902, 'text': "Test Message 3"}
];

function clone(obj) {
    // cheeky cloning trick
    return JSON.parse(JSON.stringify(obj));
}

describe("/messages", function() {

    beforeEach(function() {
        // reset messages before each test
        app.locals.messages = clone(testMessages);
    })

    describe("GET", function() {
        it('returns all messages', function(done) {
            request
                .get('/messages')
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(testMessages, done);
        });
    })

    describe("POST", function() {
        var newMessage = 'New Test Message';

        it('returns the id of the added nessage', function(done) {
            request
                .post('/messages')
                .type('application/x-www-form-urlencoded')
                .accept('application/json')
                .send(newMessage)
                .expect(201)
                .expect("Content-Type", /application\/json/)
                .end(function(err, res) {
                    if(err) return done(err);
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('number');
                    app.locals.messages.should.have.lengthOf(4)
                    done();
                })
        });

        it('adds a new urlencoded message', function(done) {
            request
                .post('/messages')
                .type('application/x-www-form-urlencoded')
                .accept('application/json')
                .send(newMessage)
                .expect(201)
                .end(function(err,res) {
                    if(err) return done(err);
                    app.locals.messages.find((msg) => msg.id == res.body.id).text.should.equal(newMessage);
                    app.locals.messages.should.have.lengthOf(4)
                    done();
                });
        });

        it('adds a new plain text message', function(done) {
            request
                .post('/messages')
                .type('text/plain')
                .accept('application/json')
                .send(newMessage)
                .expect(201)
                .end(function(err,res) {
                    if(err) return done(err);
                    app.locals.messages.find((msg) => msg.id == res.body.id).text.should.equal(newMessage);
                    app.locals.messages.should.have.lengthOf(4)
                    done();
                });
        });

        it('returns 400 for unsupported request content types', function(done) {
            request
                .post('/messages')
                .type('application/json')
                .accept('application/json')
                .send()
                .expect(400, done);
        });

        it('returns 400 for unsupported request content types', function(done) {
            request
                .post('/messages')
                .type('text/plain')
                .accept('application/json')
                .send()
                .expect(400, done);
        });

        it('returns 406 for unsupported accepts header', function(done) {
            request
                .post('/messages')
                .type('text/plain')
                .accept('text/plain')
                .send()
                .expect(406, done);
        });
    });

    describe("DELETE", function() {
        it('delete all messages', function(done) {
            request
                .delete('/messages')
                .expect(204)
                .end(function(err,res) {
                    if(err) return done(err);
                    app.locals.messages.should.be.empty;
                    done();
                });
        });
    });

    describe("/:msgId", function() {
        describe("GET", function() {
            it('returns a message when found', function(done) {
                request
                    .get('/messages/900')
                    .expect(200)
                    .expect("Content-Type", /text\/plain/)
                    .expect(testMessages.find((msg) => msg.id == 900).text, done);
            });

            it('returns 400 when msgId not an integer', function(done) {
                request
                    .get('/messages/test')
                    .expect(400,done)
            });

            it('returns 404 when not found', function(done) {
                request
                    .get('/messages/800')
                    .expect(404,done)
            });
        });
    });
})