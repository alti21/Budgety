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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;//current refers to the array element
        });
        data.totals[type] = sum;
    };

    //global data structure
    var data = {//this DS is private, so add
        allItems: {//method to return statement
            exp: [],//so that it can be accessed pubicly
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id) {
            var ids, index; 

            // id = 8
            //data.allItems[type][id]
            // ids = [1 2 4 8 9]
            // index = 3
            //the following code will delete id # 8
            // from ids array

            //map returns a new array, unlike forEach
             ids = data.allItems[type].map(function(current) {
                return current.id;
             });

             index = ids.indexOf(id);//get index of element we
             //want to remove

             if (index !== -1) {
                 //1st arg is position that we want to 
                 //start deleting elements from
                 //2nd arg is amount of elements that
                 //we want to delete
                 data.allItems[type].splice(index, 1);
             }

        },

        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            }
            else 
            {
                data.percentage = -1;
            }
            
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp')
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
           
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else 
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

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

        //this event is attached to the parent element that has class="container"
        //we are interested in the delete icon
        //but we still attach the eventListener to the parent element instead
        //of the icon element
        //we are actually ineterested in another parent element of the icon,
        //the div with id="income-#"
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

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

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;

        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;////////////////////////////////////

        if (itemID) {

            //returns array, 1st element is part of string that comes before '-'
            //2nd element is part of string that comes after '-' 
            //if string has multiple '-', then split returns array
            //of all parts of string that are around and between '-'
            splitID = itemID.split('-');//this is a string
            type = splitID[0];//type is inc or exp
            ID =  parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete item from UI


            // 3. Update and show the new budget


        }

    };


    return {
        init: function() {
            console.log('app has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);

//controller.anotherPublic();//28

controller.init();