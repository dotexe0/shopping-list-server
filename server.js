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
    this.items = this.items.filter(element => element.id != id);
    return this.items;
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
  if(!('id' in request.body)) {
    console.log('this aint workin');
    return response.sendStatus(400); //bad request
  } else {
    var id = request.params.id;
    storage.delete(id);
    response.status(201).json(id);
  }
});

app.put('/items/:id', jsonParser, function(request, response) {
  if(!('name' in request.body)) {
    return response.sendStatus(400);
  }
  var id = request.params.id;
  var name = request.params.name;
  if(storage.items.id === id) {
    var index = storage.items.indexOf(id);
    console.log(index);
    storage.items[index].name = name;
  } else {
    var item = storage.add(request.body.name);
  }
  response.status(201).json(id)
});

app.listen(process.env.PORT || 8080, process.env.IP);
