// BUDGET CONTROLLER
var budgetController = (function() {

    //private
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {//this DS is private, so add
        allItems: {//method to return statement
            exp: [],//so that it can be accessed pubicly
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    //public
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //select last id in array
            //create new ID
            if(data.allItems[type].length > 0)
            {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else 
            {
                ID = 0;
            }
          
            //create new item based on 'inc' or 'exp' type
            if(type === 'exp')
            {
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc')
            {
                newItem = new Income(ID, des, val);
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };

})();
//this is an IIFE, scope is not 
//visible to global scope
//module pattern returns an object
//containing all the functions
//that we want to be public
//outer scope access

// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {//this is a private object
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };
    
    //public
    return {
        getInput: function() {// can access this method publicly
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text

            if (type === 'inc')
            {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id&"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp')
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);

        },

        clearfields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            //clear input fields after adding an item
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;//expose this to public
        }
    };

})();
//these 2 controllers don't know about each other
// GLOBAL APP CONTROLLER, tells other modules what to do
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event)
        {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
    };

    var updateBudget = function() {
        
        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget on the UI

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();
    
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)//if description is not empty and value is a positive number
        {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            // 4. Clear the fields
            UICtrl.clearfields();

            // 5. Calculate and update budget
            updateBudget();
        }

    
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