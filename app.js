
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
    else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.total[type] = sum;
  };

// data object to store any type of item
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    },
    budget:  0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on inc and exp
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //push it to data structure
      data.allItems[type].push(newItem);

      //Retrun the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current, index, array) {
        return current.id;
      });

      index = ids.indexOf(parseInt(id));
      if (index !== -1) {
        data.allItems[type].splice(index, 1)
      }
    },

    calculateBudget: function() {
        //1. calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');
        //2. cal budget income - expenses
        data.budget = data.total['inc'] - data.total['exp'];
        //3. cal the percentage of incaome that we spent
        if (data.total.inc > 0){
          data.percentage = Math.round((data.total['exp'] / data.total['inc']) * 100);
        } else {
          data.percentage = -1;
        }
    },

    getBudget: function() {
        return {
          budget: data.budget,
          totalIncome: data.total.inc,
          totalExpense: data.total.exp,
          percentage: data.percentage
        };
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(data.total.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(current) {
        return current.getPercentage();
      });
      return allPerc;
    },

    testing: function() {
      console.log(data);
    }
  }
})();

var UIController = (function() {

  var DOMString = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
  };

  return {
    getInput: function() {
      return {
         type: document.querySelector(DOMString.inputType).value,
         description: document.querySelector(DOMString.inputDescription).value,
         value: parseFloat(document.querySelector(DOMString.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // create html string with a placeholder text

      if (type === 'inc') {
          console.log('income');
          element = DOMString.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
      } else if (type === 'exp'){
          element = DOMString.expenseContainer;
          html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }

      // replace the placeholder text with some actual text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%value%',  this.formatNumber(obj.value, type) );
      newHtml = newHtml.replace('%description%', obj.description);

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMString.inputDescription + ', ' + DOMString.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array) {
          current.value = '';
        });

        fieldsArr[0].focus();
    },

    displayBudget: function(obj) {

      document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMString.incomeLabel).textContent = obj.totalIncome;
      document.querySelector(DOMString.expenseLabel).textContent = obj.totalExpense;
      document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';

      if (obj.percentage > 0){
        document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMString.percentageLabel).textContent = '--';
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMString.expensesPercLabel);
      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i)
        }
      };
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '--';
        }
      });
    },

    formatNumber: function(number, type) {
      var numSplit, int, dec, sign;
      //1. +/- before number
      //2. 2 decimal points
      //3. use of comma in number

      number = Math.abs(number);
      number = number.toFixed(2);

      numSplit = number.split('.');

      int = numSplit[0];
      if (int.length > 3) {
        int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);
      }
      dec = numSplit[1];

      type === 'exp' ? sign = '-' : sign = '+';

      return sign + ' ' + int + '.' + dec;
    },

    getDOMString: function() {
      return DOMString;
    }
  }
}());

var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListener = function() {

    var el;
    //console.log('Helo');
    var DOM = UICtrl.getDOMString();
    document.querySelector(DOM.inputButton).addEventListener('click', cntrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13){
        event.preventDefault()
        cntrlAddItem();
      }
    });

    el = document.querySelector(DOM.container);
    if (el){
      el.addEventListener('click', ctrlDeleteItem);
    }
  };

  var updateBudget = function() {

        //1. cal. budget
        budgetCtrl.calculateBudget();

        //2. return the budget
        var budget = budgetCtrl.getBudget();
        //console.log(budget);
        //3. display budget
        UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1. calculate percentages
    budgetCtrl.calculatePercentages();
    //2. Read percentages from budget budgetController
    var percentages = budgetCtrl.getPercentages();
    //3. update the UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  var cntrlAddItem = function() {
    var input, newItem;

    //1. get the input
    input = UICtrl.getInput();
    //console.log(input);

    if (input.description !== '' && !isNaN(input.value) && input.value > 0){

      //2. add the iteam to budget budgetController
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. add new item to UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear the fields
      UICtrl.clearFields();

      //5. cal and update budget
      updateBudget();

      //6. calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

    if (itemID) {
      splitID = itemID.split('-');
      splitID[0] === 'income' ? type = 'inc' : type = 'exp'
      //type = splitID[0];
      ID = splitID[1];

      //1. delete the item from DS
      budgetCtrl.deleteItem(type, ID);
      //2. delete item from UI
      UICtrl.deleteListItem(itemID);
      //3. update the budget
      updateBudget();
      //4. calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started');
      UICtrl.displayBudget({budget: 0,
      totalIncome: 0,
      totalExpense: 0,
      percentage: -1});
      setupEventListener();
    }
  };

})(budgetController, UIController);

controller.init();
