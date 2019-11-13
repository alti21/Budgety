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



})();

//these 2 controllers don't know about each other

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    /*var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }*/

    var ctrlAddItem = function() {
        // 1. Get the filed input data

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

        console.log('ok');
    }


    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event)
    {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });


})(budgetController, UIController);

//controller.anotherPublic();//28