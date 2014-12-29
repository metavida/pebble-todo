/**
 * A Watchapp that helps you record & recall what you need to do.
 */

var debug = true;

var UI = require('ui');
//var Vector2 = require('vector2');

if(debug) {
  localStorage.setItem('todos', '{}');
}

var ToDos = {};

(function() {
  /* Private Variables */
  var todoTitlesByIndex = null,
      todoIconsByIndex = null;

  /* Private Functions */
  var getTodos = function() {
    var fromLocal = localStorage.getItem('todos');
    if(fromLocal === null) {
      return {};
    } else {
      try {
        return JSON.parse(fromLocal);
      } catch (err) {
        console.log('Error!!!');
        console.log(err);
        return {};
      }
    }
  };

  var toggleTodo = function(todoIndex) {
    var todoTitle = todoTitleByIndex(todoIndex);
    if(checkTodo(todoTitle) == 1) {
      unsetTodo(todoTitle);
    } else {
      setTodo(todoTitle);
    }
  };

  var setTodo = function(todo) {
    var current = getTodos();
    current[todo] = 1;
    saveTodoData(current);
  };

  var unsetTodo = function(todo) {
    var current = getTodos();
    current[todo] = 0;
    saveTodoData(current);
  };

  var checkTodo = function(todo) {
    return getTodos()[todo] == 1;
  };

  var saveTodoData = function(data) {
    localStorage.setItem('todos', JSON.stringify(data));
  };

  var getTodosCount = function() {
    var count = 0,
        current = getTodos();
    for (var prop in current) {
      if(current[prop] == 1) {
        count++;
      }
    }
    return count;
  };

  var todoTitleByIndex = function(index) {
    return ToDos.todoItems[index].title;
  };

  /* Public API */
  ToDos = {
    todoItems: [
      {
        title: 'Home',
        icon: null,
      },
      {
        title: 'Work',
        icon: null,
      },
      {
        title: 'Food',
        icon: null,
      },
      {
        title: 'Friends',
        icon: null,
      },
      {
        title: 'Family',
        icon: null,
      },
      {
        title: 'Misc',
        icon: null,
      },
    ],

    toggleTodo: toggleTodo,

    UI: {
      numTodoStr: function() {
        var count = getTodosCount();
        if(count == 1) {
          return "1 Todo";
        } else {
          return count + " Todos";
        }
      },

      itemTitleStrWithSelectStatus: function(todoIndex) {
        var todoTitle = todoTitleByIndex(todoIndex);
        console.log('call menuItemTitleStr('+todoTitle+')');
        console.log('checkTodo('+todoTitle+') => '+checkTodo(todoTitle));
        console.log(JSON.stringify(getTodos()));
        return checkTodo(todoTitle) ? '+ '+todoTitle : '- '+todoTitle;
      }
    }
  };
})();

var main = new UI.Card({
  title: 'ToDo',
  subtitle: ToDos.UI.numTodoStr(),
});
main.show();

var menu = new UI.Menu({
    sections: [{
      items: []
    }]
  });

function setMenuTodoItem(itemIndex) {
  console.log('call setMenuTodoItem('+itemIndex+')');
  menu.item(0, itemIndex, {
    title: ToDos.UI.itemTitleStrWithSelectStatus(itemIndex)
  });
}

main.on('click', 'select', function(e) {
  for (var i in ToDos.todoItems) {
    setMenuTodoItem(i);
  }
  menu.show();
});

menu.on('select', function(e) {
  ToDos.toggleTodo(e.itemIndex);
  console.log(ToDos.UI.itemTitleStrWithSelectStatus(e.itemIndex));
  setMenuTodoItem(e.itemIndex);
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is now titled "' + e.item.title);
  main.subtitle(ToDos.UI.numTodoStr());
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
