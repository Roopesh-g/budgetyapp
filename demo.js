var budgetController = (function(){

  var x = 23;
  var add = function(a) {
    return x + a;
  }

  return {
    publicTest: function(b) {
      return add(b);
    }
  }
})();


var UIController = (function() {
  // some code
})();

var controller = (function(budgetCtrl,UICtrl) {
  //some code
  var z;
  z = budgetCtrl.publicTest(5);
  return {
    publicTest: function() {
      console.log(z);
    }
  }
})(budgetController, UIController);
