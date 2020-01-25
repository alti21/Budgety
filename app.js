// BUDGET CONTROLLER
var budgetController = (() => {

    //private
    class Common 
    { 
        constructor(id, description, value, category)
        {
            this.id = id;
            this.description = description;
            this.value = value;
            this.category = category;
        }
    }

    class Expense extends Common 
    {
        constructor(id, description, value, category, percentage)
        {
            super(id, description, value, category);
            this.percentage = -1;
        }

        calcPercentage(totalIncome)
        {
            if(totalIncome > 0)
            {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }
            else 
            {
                this.percentage = -1;
            }
        }

        getPercentage()
        {
            return this.percentage;
        }

    }

    class Income extends Common 
    {
        constructor(id, description, value, category)
        {
            super(id, description, value, category);
        }
    }
  
    const calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;//current refers to the array element, current.valoe of either inc object or exp object 
        });
        data.totals[type] = sum;
    };

    //global data structure
    let data = {//this DS is private, so add
        allItems: {//method to return statement
            exp: [],//so that it can be accessed pubicly
            inc: []//these are arrays of objects
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
        addItem: (type, des, val, ctgry) => {
            let newItem, ID;
            //select last id in array
            //create new ID
            if(data.allItems[type].length > 0)
            {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else // if no income or expenses
            {
                ID = 0;
            }
          
            //create new item based on 'inc' or 'exp' type
            if(type === 'exp')
            {
                newItem = new Expense(ID, des, val, ctgry);
            }
            else if (type === 'inc')
            {
                newItem = new Income(ID, des, val, ctgry);
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        deleteItem: (type, id) => {
            let ids, index; 

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

        calculateBudget: () => {

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

        calculatePercentages: () => {

            /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: () => {
            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(); 
            });
            return allPerc;//array of all the percentages
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: () => {
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
var UIController = (() => {
    //private
    const DOMstrings = {//this is a private object
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        inputCategory: '.add_category'
    };

    const formatNumber = (num, type) => {
        let numSplit, int, dec;
        /*
        + or - before number exactly 2 decimal 
        points, comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);//method of number prototype
        //retuns a string of the number with n decimal places
        //n is the argument

        numSplit = num.split('.');
        //seperate num string into int and decimal part

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0 , int.length - 3) + ',' + int.substr(int.length - 3, 3);//return substring, in 2310, out 2,310
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    const nodeListForEach = (list, callback) => {

        for (let i=0; i<list.length; i++) {
            callback(list[i], i);//current, index
        }

    };
    
    //public
    return {
        getInput: () => {// can access this method publicly
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
                category: document.querySelector(DOMstrings.inputCategory).options[document.querySelector(DOMstrings.inputCategory).options.selectedIndex].text
                };
        },

        addListItem: (obj, type) => {
            let html, newHtml, element;

            // Create HTML string with placeholder text

            if (type === 'inc')
            {
                console.log(type);
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">${obj.description}</div>&nbsp<span>%category%</span> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }
            else if (type === 'exp')
            {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">${obj.description}</div>&nbsp<span>%category%</span> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }
            
            // Replace placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
           // newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);

        },

        deleteListItem: (selectorID) => {

            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearfields: () => {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            //clear input fields after adding an item
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: (obj) => {
            let type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else 
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: (percentages) => {

            //returns HTML collection or nodeList
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, (current, index) => {

                if (percentages[index] > 0)
                {
                    current.textContent = percentages[index] + '%';
                }
                else 
                {
                    current.textContent = '---';
                }
                
            });

        },

        displayMonth: () => {
            let now, months, month, year;
            now = new Date();//store today's date

            months = ['January', 'February', 'March', 'April', 'May', 'June' , 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: () => {

            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

            if(document.querySelector(DOMstrings.inputType).options.selectedIndex  === 0)
            {
                document.querySelector('.top').classList.remove('base__bg');
                document.querySelector('.top').classList.remove('expense__bg');
                document.querySelector('.top').classList.add('income__bg');
            }
            else 
            {
                document.querySelector('.top').classList.remove('base__bg');
                document.querySelector('.top').classList.remove('income__bg');
                document.querySelector('.top').classList.add('expense__bg');
            }

        },
     
        getDOMstrings: () => {
            return DOMstrings;//expose this to public
        }
    };

})();
//these 2 controllers don't know about each other
// GLOBAL APP CONTROLLER, tells other modules what to do
var controller = ((budgetCtrl, UICtrl) => {

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();

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

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    };

    const updateBudget = () => {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    const updatePercentages = () => {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = () => {
        let input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();
       // input.category
    
        if(input.description !== "" && !isNaN(input.value) && input.value > 0 && input.category !== "Select Category")//if description is not empty and value is a positive number
        {   console.log(input.category);
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            // 4. Clear the fields
            UICtrl.clearfields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }

    
    };

    const ctrlDeleteItem = (event) => {

        let itemID, splitID, type, ID;

        
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
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();

        }

    };


    return {
        init: () => {
            console.log('app has started');
            UICtrl.displayMonth();
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