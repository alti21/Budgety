// BUDGET CONTROLLER
var budgetController = (function() {

   /* var x = 23;

    var add = function(a) {
        return x + a;
    }

    return {//publicTest is exposed to outer scope
        publicTest: function(b) {
            return add(b);
        }//return an object
    }*/
    //publicTest is a closure, it has access
//to x and add() even when the IIFE has 
//already returned

})();
//this is an IIFE, scope is not 
//visible to global scope
//module pattern returns an object
//containing all the functions
//that we want to be public
//outer scope access

//budgetController gets assigned the object
//when the IIFE returns

//budgetController.publicTest(5);//28

// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {//this is a private object
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
        getInput: function() {// can access this method publicly
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
                };
            },

            getDOMstrings: function() {
                return DOMstrings;//expose this to public
            }
    };

})();

//these 2 controllers don't know about each other

// GLOBAL APP CONTROLLER, tells other modules what to do
var controller = (function(budgetCtrl, UICtrl) {

    /*var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }*/

    //function where all event listeners are placed
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event)
        {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
                console.log('what');
            }

        });
    };

    

    var ctrlAddItem = function() {
        // 1. Get the filed input data
        var input = UICtrl.getInput();
    

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    
    };


    return {
        init: function() {
            console.log('app has started');
            setupEventListeners();
        }
    };


})(budgetController, UIController);

//controller.anotherPublic();//28

controller.init();