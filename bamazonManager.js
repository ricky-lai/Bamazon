// SETUP VARIABLES
// Including the mySQL & inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Creating the connection information for the SQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Username
    user: "root",

    // Password
    password: "Laihoss9328!",
    database: "Bamazon"
});

// Creating global variables
var prodArr = [];
var depArr = [];
var stockQuant = 0;
var addStock = 0;


/************************************************/
// FUNCTIONS
// Listing a set of menu options to prompt the manager
var mgrMenu = function () {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (user) {
        switch (user.action) {
            // If a manager selects View Products for Sale, calling the listInventory() function
            case "View Products for Sale":
                listInventory();
                break;
            // If a manager selects View Low Inventory, calling the lowInventory() function
            case "View Low Inventory":
                lowInventory();
                break;
            // If a manager selects Add to Inventory, calling the addMorePrompt() function
            case "Add to Inventory":
                addMorePrompt();
                break;
            // If a manager selects Add New Product, calling the newProd() function
            case "Add New Product":
                newProd();
                break;
        }
    });
};

// Listing every available item
var listInventory = function () {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) {
                throw err;
            }
            console.log("*******************************");
            console.log("Products for sale:");
            for (var i = 0; i < res.length; i++) {
                console.log("ID# %s | %s | $%s | %s", res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity);
            }
            console.log("*******************************");
            // Calling the function to display the menu again
            mgrMenu();
        }
    );
};

// Listing all items with inventory counts lower than five
var lowInventory = function () {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity<5",
        function (err, res) {
            if (err) {
                throw err;
            }
            console.log("\n*******************************");
            console.log("Time to restock! Less than five remaining of the below items:");
            for (var i = 0; i < res.length; i++) {
                console.log("ID# %s | %s | %s", res[i].item_id, res[i].product_name, res[i].stock_quantity);
            }
            console.log("*******************************\n");
            // Calling the function to display the menu again
            mgrMenu();
        }
    );
};

// Displaying a prompt that will let the manager "add more" of any item currently in the store
var addMorePrompt = function () {
    connection.query("SELECT item_id, product_name, stock_quantity, price FROM products",
        function (err, res) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < res.length; i++) {
                prodArr.push(res[i].product_name);
            };
            // Prompting the manager to input what to order
            inquirer.prompt([{
                type: "list",
                message: "What would you like to add more of?",
                name: "addMore",
                choices: prodArr
            }, {
                type: "input",
                message: "How many would you like to order?",
                name: "orderQuant"
            }]).then(function (user) {
                // Pulling the stock quantity for the product the user selected
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === user.addMore) {
                        stockQuant = res[i].stock_quantity;
                    }
                };
                addStock = stockQuant + parseInt(user.orderQuant);
                console.log("add stock: " + addStock);
                // Updating the stock quantity based on the user input
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: addStock
                }, {
                    product_name: user.addMore
                }],
                    function (err, res) { }
                );
                // Calling the function to display the menu again
                mgrMenu();
            });
        }
    );
};

// Allowing the manager to add a completely new product to the store
var newProd = function () {
    connection.query("SELECT DISTINCT department_name FROM products",
        function (err, res) {
            if (err) {
                throw err;
            }
            // Looping through and pushing unique departments in the products table to an array 
            for (var i = 0; i < res.length; i++) {
                depArr.push(res[i].department_name);
            };
            // Prompting the manager to input what to order
            inquirer.prompt([{
                type: "input",
                message: "What new product would you like to order?",
                name: "newProdName"
            }, {
                type: "list",
                message: "Under what department does this product belong?",
                name: "newProdDep",
                choices: depArr
            }, {
                type: "input",
                message: "What is its price?",
                name: "newProdPrice"
            }, {
                type: "input",
                message: "How many would you like to order?",
                name: "newProdQuant"
            }]).then(function (user) {
                // Adding the data on the new product to the SQL database
                connection.query("INSERT INTO products SET ?", [{
                    product_name: user.newProdName,
                    department_name: user.newProdDep,
                    price: user.newProdPrice,
                    stock_quantity: user.newProdQuant
                }],
                    function (err, res) {
                        console.log("\n*******************************");
                        console.log("Item ordered!");
                        console.log("*******************************\n");
                        // Calling the function to display the menu again
                        mgrMenu();
                    }
                );
            });
        }
    );
};

/************************************************/
// MAIN PROCESSES
// Connecting to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mgrMenu();
});