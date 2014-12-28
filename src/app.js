/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
//var Vector2 = require('vector2');

function getTodos() {
  var fromLocal = localStorage.getItem('todos');
  if(fromLocal === null) {
    return {};
  } else
    try {
      return JSON.parse(fromLocal);
    } catch (err) {
      console.log('Error!!!');
      console.log(err);
      return {};
    }
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
  localStorage.setItem('todos', JSON.stringify(data));
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

function mainSubtitleStr() {
  var count = getTodosCount();
  if(count == 1) {
    return "1 Todo";
  } else {
    return count + " Todos";
  }
}

var main = new UI.Card({
  title: 'ToDo',
  subtitle: mainSubtitleStr(),
});
main.show();

main.on('click', 'select', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Home',
        //icon: 'images/menu_icon.png',
        subtitle: checkTodo('Home') ? 'Set' : 'Unset'
      }, {
        title: 'Work',
        subtitle: checkTodo('Work') ? 'Set' : 'Unset'
      }, {
        title: 'Misc',
        subtitle: checkTodo('Misc') ? 'Set' : 'Unset'
      }]
    }]
  });
  menu.on('select', function(e) {
    var selectedTitle = e.item.title;
    toggleTodo(selectedTitle);
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + selectedTitle + 
                '" and is now ' + (checkTodo(selectedTitle) ? 'Set' : 'Unset')
               );
    main.subtitle(mainSubtitleStr());
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
