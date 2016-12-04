var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = { name: name, id: this.setId };
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id) {
    for (let i = 0; i < this.items.length; i++) {
      if(this.items[i].id == id) {
        removeThis = this.items[i];
        this.items.splice(i, 1);
        return removeThis;
      }
    }
    return 'error';
  },
  update: function(id, name) {
    for (let i = 0; i < this.items.length; i++) {
      if(this.items[i].id == id) {
        this.items[i].name = name;
        return this.items[i];
      }
    }
    return storage.add(request.body.name);
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

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
  if(!('name' in request.body)) {
    return response.sendStatus(400); //bad request
  }
  var item = storage.add(request.body.name);
  response.status(201).json(item); // created
});

app.delete('/items/:id', jsonParser, function(request, response) {
    var id = request.params.id;
    var item = storage.delete(id);
    if (item === 'error') {
      response.status(404);
    } else {
      response.status(200).json(item);
    }
});

app.put('/items/:id', jsonParser, function(request, response) {
  if(!('name' in request.body) || !('id' in request.body)) {
    return response.sendStatus(400);
  } else {
    var id = request.params.id;
    var name = request.body.name;
    var item = storage.update(id, name);
  }
  response.status(200).json(item);
});

app.listen(process.env.PORT || 8080, process.env.IP);
