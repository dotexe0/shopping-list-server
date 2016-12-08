
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
  //list all shopping list items
  it('should list items on GET', function(done) {
         chai.request(app)
             .get('/items')
             .end(function(err, res) {
                 should.equal(err, null);
                 res.should.have.status(200);
                 res.should.be.json;
                 res.body.should.be.a('array');
                 res.body.should.have.length(3);
                 res.body[0].should.be.a('object');
                 res.body[0].should.have.property('id');
                 res.body[0].should.have.property('name');
                 res.body[0].id.should.be.a('number');
                 res.body[0].name.should.be.a('string');
                 res.body[0].name.should.equal('Broad beans');
                 res.body[1].name.should.equal('Tomatoes');
                 res.body[2].name.should.equal('Peppers');
                 done();
             });
   });

     //add an item to shopping list
   it('should add an item on POST', function(done) {
           chai.request(app)
               .post('/items/')
               .send({'name': 'Kale'})
               .end(function(err, res) {
                   should.equal(err, null);
                   res.should.have.status(201);
                   res.should.be.json;
                   res.body.should.be.a('object');
                   res.body.should.have.property('name');
                   res.body.should.have.property('id');
                   res.body.name.should.be.a('string');
                   res.body.id.should.be.a('number');
                   res.body.name.should.equal('Kale');
                   storage.items.should.be.a('array');
                   storage.items.should.have.length(4);
                   storage.items[3].should.be.a('object');
                   storage.items[3].should.have.property('id');
                   storage.items[3].should.have.property('name');
                   storage.items[3].id.should.be.a('number');
                   storage.items[3].name.should.be.a('string');
                   storage.items[3].name.should.equal('Kale');
                   done();
               });
   });

   it('should not POST without body data', function(done) {
     chai.request(app)
         .post('/items/')
         .send({})
         .end(function(err, res) {
           should.equal(err, err);
         done();
       });
   });

   it('should not POST with something other than valid JSON', function(done) {
     chai.request(app)
         .post('/items/')
         .send("Hello World! I'm an error.")
         .end(function(err, res) {
           should.equal(err, err);
         done();
       });
   });

  //edit single shopping list item
  it('should edit an item on PUT', function(done) {
    chai.request(app)
        .put('/items/3')
        .send({'name':'Banana'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('id');
          res.body.name.should.be.a('string');
          res.body.id.should.be.a('number');
          res.body.name.should.equal('Banana');
          res.body.id.should.equal(3);
          storage.items.should.have.length(4);
          done();
      });
  });

  it('should not PUT without an ID in the endpoint', function(done) {
    chai.request(app)
        .put('/items/')
        .send({'name':'Banana'})
        .end(function(err, res) {
          should.equal(err, err); //expecting "/items/:id" to be under .put('/items/')
        done();
      });
  });

  it('should not PUT with different ID in the endpoint than the body', function(done) {
    chai.request(app)
        .put('/items/1')
        .send({'name': 'Cake', 'id': 500})
        .end(function(err, res) {
          should.equal(err, err); // should not have sent "id"
          res.should.have.status(400);
        done();
        });
  });
  it('should PUT to an ID that doesn\'t exist', function(done) {
    chai.request(app)
        .put('/items/5')
        .send({'name': 'Cake'})
        .end(function(err, res) {
          should.equal(err, null);
          done();
        });
  });
  it('should not PUT without body data', function(done) {
    chai.request(app)
        .put('/items/1')
        .send()
        .end(function(err, res) {
          should.equal(err, err);
          res.should.have.status(400);
          done();
        });
  });

  it('should not PUT with something other than valid JSON', function(done) {
    chai.request(app)
        .put('/items/1')
        .send("HELLO WORLD! IM AN ERROR")
        .end(function(err, res) {
          should.equal(err, err);
          res.should.have.status(400);
          done();
        });
  });

  it('should delete an item on DELETE', function(done) {
    chai.request(app)
        .delete('/items/1')
        .end(function(err, res) {
          should.equal(err, null);
          res.should.be.json;
          res.should.have.status(200);
          res.body.should.be.a('array');
          storage.items[2].should.have.property('name');
          storage.items[2].should.have.property('id');
          storage.items[2].id.should.be.a('number');
          storage.items[2].name.should.be.a('string');
          storage.items.should.have.length(4);
          done();
        });
  });
  it("should not DELETE an item that doesn't exist", function(done) {
    chai.request(app)
        .delete('/items/100000')
        .end(function(err, res) {
          should.equal(err, err);
          res.should.have.status(404);
          storage.items[2].should.have.property('name');
          storage.items[2].should.have.property('id');
          storage.items[2].id.should.be.a('number');
          storage.items[2].name.should.be.a('string');
          storage.items.should.have.length(4);
          done();
        });
  });

  it('should not DELETE without an ID in the endpoint', function(done) {
    chai.request(app)
        .delete('/items/')
        .end(function(err, res) {
          should.equal(err, err);
          res.should.have.status(404);
          done();
        });
    });
});
