var budgetController = (function() {

    var x = 23;

    var add = function(a) {
        return x + a;
    }

    return {//publicTest is exposed to outer scope
        publicTest: function(b) {
            return add(b);
        }//return an object
    }//publicTest is a closure, it has access
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


var UIController = (function() {



})();

//these 2 controllers don't know about each other


var controller = (function(budgetCtrl, UICtrl) {

    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }

})(budgetController, UIController);

controller.anotherPublic();//28