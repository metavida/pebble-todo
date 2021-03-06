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

  /* Private UI Methods */
  var setMenuTodoItem = function(itemIndex) {
    ToDos.UI.menu.item(0, itemIndex, {
      title: itemTitleStrWithSelectStatus(itemIndex)
    });
  };

  var numTodoStr = function() {
    var count = getTodosCount();
    if(count == 1) {
      return "1 Todo";
    } else {
      return count + " Todos";
    }
  };

  var itemTitleStrWithSelectStatus = function(todoIndex) {
    var todoTitle = todoTitleByIndex(todoIndex);
    console.log('call menuItemTitleStr('+todoTitle+')');
    console.log('checkTodo('+todoTitle+') => '+checkTodo(todoTitle));
    console.log(JSON.stringify(getTodos()));
    return checkTodo(todoTitle) ? '+ '+todoTitle : '- '+todoTitle;
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
      main: new UI.Card({
        title: 'ToDo',
        subtitle: numTodoStr(),
      }),

      menu: new UI.Menu({
        sections: [{
          items: []
        }]
      }),


    }
  };

  ToDos.UI.main.on('click', 'select', function(e) {
    for (var i in ToDos.todoItems) {
      setMenuTodoItem(i);
    }
    ToDos.UI.menu.show();
  });

  ToDos.UI.menu.on('select', function(e) {
    toggleTodo(e.itemIndex);
    console.log(itemTitleStrWithSelectStatus(e.itemIndex));
    setMenuTodoItem(e.itemIndex);
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex );
    console.log('The item is now titled "' + e.item.title);
    ToDos.UI.main.subtitle(numTodoStr());
  });
})();

ToDos.UI.main.show();
