const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server/index');

chai.use(chaiHttp);

describe('Functional Tests', function() {

  describe('API ROUTING FOR /api/threads/:board', function() {
    
    describe('POST', function() {
      
      it('POST - a thread to a specific board, passing in text and delete_password', function(done) {
        let text = 'test text';
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/threads/test')
          .send({
            text,
            delete_password
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'delete_password');
            assert.property(res.body, 'bumped_on');
            assert.property(res.body, 'reported');
            assert.property(res.body, 'replies');
            assert.equal(res.body.text, text);
            assert.equal(res.body.delete_password, delete_password);
            assert.equal(res.body.reported, false);
            assert.isArray(res.body.replies);
            done();
          })
      });

    });
    
    describe('GET', function() {
      
      it('GETs - an array of most recent 10 bumped threads, with only the most recent 3 replies.', function(done) {
        chai.request(server)
          .get('/api/threads/test')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.equal(res.body.length, 10, 'response should have a length of 10');
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], 'reported');
            assert.property(res.body[0], "replies");
            assert.isArray(res.body[0].replies, 'each thread has a replies array');
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "delete_password");
            // chai.expect((new Date(res.body[0].bumped_on)).valueOf()).to.be.above((new Date(res.body[1].bumped_on)).valueOf());
            done();
          })
      })

    });
    
    describe('DELETE', function() {
      
      it('DELETE -  delete a thread by giving thread_id and valid delete_password.', function(done) {
        let text = 'test text';
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/threads/test')
          .send({
            text,
            delete_password
          })
          .end(function(err1, res1) {
            assert.equal(res1.status, 200);
            chai.request(server)
              .delete('/api/threads/test')
              .send({thread_id: res1.body._id, delete_password})
              .end(function(err, res) {
                assert.equal(res.status, 200);
                done();
              });            
          });
      });

      it('DELETE - doest not delete a thread by giving thread_id and Invalid delete_password.', function(done) {
        let text = 'test text';
        let delete_password = 'abc123';
        let wrong_password = 'acb123';
        chai.request(server)
          .post('/api/threads/test')
          .send({
            text,
            delete_password
          })
          .end(function(err1, res1) {
            assert.equal(res1.status, 200);
            chai.request(server)
              .delete('/api/threads/test')
              .send({thread_id: res1.body._id, delete_password: wrong_password})
              .end(function(err, res) {
                assert.equal(res.status, 404);
                done();
              });            
          });
      });
      
    });
  
    describe('PUT', function() {
      
      it('PUT - change the reported field of a thread to true', function(done) {
        let text = 'test text';
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/threads/test')
          .send({
            text,
            delete_password
          })
          .end(function(err1, res1) {
            assert.equal(res1.status, 200);
            chai.request(server)
              .put('/api/threads/test')
              .send({thread_id: res1.body._id})
              .end((err, res) => {
                assert.equal(res.status, 200);
                done();
              });            
          });
      });

    });
    

  });
  
  describe('API ROUTING FOR /api/replies/:board', function() {
    
    describe('POST', function() {
      
      it('POST - a reply to a specific thread, passing in text, thread_id & delete_password', function(done) {
        let text = 'test reply';
        let thread_id = "5c28fec0f362e74e4985c110";
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/replies/test')
          .send({
            text,
            thread_id,
            delete_password
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'delete_password');
            assert.property(res.body, 'reported');
            assert.equal(res.body.text, text);
            assert.equal(res.body.delete_password, delete_password);
            assert.equal(res.body.reported, false);
            done();
          })
      });

    });
    
    describe('GET', function() {
      
      it('GETs -  an entire thread with all its replies, being passed thread_id in query params, hiding reported & delete_password', function(done) {
        let thread_id = "5c28feb9f362e74e4985c10f";
        chai.request(server)
          .get('/api/replies/test')
          .query({thread_id})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response is an object');
            assert.equal(res.body._id, thread_id);
            assert.property(res.body, 'replies', 'response has a replies property');
            assert.isArray(res.body.replies, 'response has a replies array');
            assert.notProperty(res.body.replies[0], 'reported');
            assert.notProperty(res.body.replies[0], 'delete_password');
            assert.property(res.body.replies[0], 'text');
            assert.property(res.body.replies[0], 'created_on');
            done();
          })
      })

    });
    
    describe('PUT', function() {
      
      it('PUT - updates the reported field of a reply to true', function(done){
        let text = 'test reply';
        let thread_id = "5c28fec0f362e74e4985c110";
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/replies/test')
          .send({
            text,
            thread_id,
            delete_password
          })
          .end((err1, res1) => {
            assert.equal(res1.status, 200);
            chai.request(server)
              .put('/api/replies/test')
              .send({
                thread_id,
                reply_id: res1.body._id,
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                done();
              });
          })
      });

    });
    
    describe('DELETE', function() {
      
      it('DELETE - delete a reply after being provided thread_id, reply_id & Valid delete_password', function(done){
        let text = 'test reply';
        let thread_id = "5c28fec0f362e74e4985c110";
        let delete_password = 'abc123';
        chai.request(server)
          .post('/api/replies/test')
          .send({
            text,
            thread_id,
            delete_password
          })
          .end((err1, res1) => {
            assert.equal(res1.status, 200);
            chai.request(server)
              .delete('/api/replies/test')
              .send({
                thread_id,
                delete_password,
                reply_id: res1.body._id
              })
              .end(function(err, res){
                assert.equal(res.status, 200);
                done();
              });
          });
      });

      it('DELETE - does not delete a reply after being provided thread_id, reply_id & InValid delete_password', function(done){
        let text = 'test reply';
        let thread_id = "5c28fec0f362e74e4985c110";
        let delete_password = 'abc123';
        let wrong_password = 'acb123';
        chai.request(server)
          .post('/api/replies/test')
          .send({
            text,
            thread_id,
            delete_password
          })
          .end((err1, res1) => {
            assert.equal(res1.status, 200);
            chai.request(server)
              .delete('/api/replies/test')
              .send({
                thread_id,
                delete_password: wrong_password,
                reply_id: res1.body._id
              })
              .end(function(err, res){
                assert.equal(res.status, 404);
                done();
              });
          });
      });

    });
    
  });

});
