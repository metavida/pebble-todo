/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var mainItems = {
  title: 'ToDo',
  //icon: 'images/menu_icon.png',
  //subtitle: "Don't forget!",
  //body: 'Press any button.'
};

function getTodos() {
  return JSON.parse(localStorage.getItem('todos'));
}

function toggleTodo(todo) {
  if(checkTodo(todo) == 1) {
    unsetTodo(todo);
  } else {
    setTodo(todo);
  }
}

function setTodo(todo) {
  var current = getTodos();
  current[todo] = 1;
  saveTodoData(current);
}

function unsetTodo(todo) {
  var current = getTodos();
  current[todo] = 0;
  saveTodoData(current);
}

function checkTodo(todo) {
  return getTodos()[todo] == 1;
}

function saveTodoData(data) {
  localStorage.setItem(JSON.stringify(data));
}

function getTodosCount() {
  var count = 0,
      current = getTodos();
  for (var prop in current) {
    if(current[prop] == 1) {
      count++;
    }
  }
  return count;
}

//if(getTodosCount() > 0) {}
mainItems.subtitle = "You have "+getTodosCount()+" Todos.";

var main = new UI.Card(mainItems);
main.show();

main.on('click', 'select', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Home',
        //icon: 'images/menu_icon.png',
        subtitle: checkTodo('Home') ? 'Set' : 'Unset';
      }, {
        title: 'Work',
        subtitle: checkTodo('Work') ? 'Set' : 'Unset';
      }]
    }]
  });
  menu.on('select', function(e) {
    toggleTodo(e.item.title);
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

/*
main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/
