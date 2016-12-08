var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        return this.items.splice(i, 1);
      }
    }
    return 'Error, item not found';
  },
  update: function(name, id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        this.items[i].name = name;
        return this.items[i];
      }
    }
    return this.add(name);
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();

app.use(express.static('public'));

app.get('/items', function(request, response) {
  response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
  var name = request.body.name;
  if (!('name' in request.body)) {
      return response.sendStatus(400);
  }
  var item = storage.add(name);
  response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
  var id = request.params.id;
  var item = storage.delete(id);
  if (item == 'Error, item not found') {
    return response.sendStatus(404);
  }
  response.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
  if (!('name' in request.body) || ('id' in request.body)) {
    return response.sendStatus(400);
  }
  var name = request.body.name;
  var id = request.params.id;
  var item = storage.update(name, id);
  response.status(200).json(item);
});

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;
