// SETUP VARIABLES
// Including the mySQL & prompt npm packages
var mysql = require("mysql");
var prompt = require("prompt");

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
var userUnits;
var userItem;
var userTotal;
var updatedStock;
var updatedRev;
var unitPrice;
var prodDep;

// Creating the properties for the prompt
var schema = {
    properties: {
        ID: {
            description: "Item ID",
            type: "integer",
            message: "Enter numbers only"
        },
        units: {
            description: "Units",
            type: "integer",
            message: "Enter numbers only"
        }
    }
};

/************************************************/
// FUNCTIONS
var userPrompt = function () {
    console.log("\nWhat item(s) would you like to purchase?  Please enter the item ID and unit(s) below.\n")
    // Starting the prompt
    prompt.start();
    // Prompting users with message asking them the ID of the product they would like to buy, then how many units of the product they would like to buy
    prompt.get(schema, function (err, result) {
        userUnits = result.units;
        userItem = result.ID;
        // Calling the quantityCheck() function
        quantityCheck();
    });
};

// Once the customer has placed the order, checking if the store has enough of the product to meet the customer's request
var quantityCheck = function () {
    // Checking if the store has enough of the product to meet the customer's request
    connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE ?", [{ item_id: userItem }],
        function (err, res) {
            if (err) {
                throw err;
            }
            // If not, letting user know and then preventing the order from going through
            if (res[0].stock_quantity < userUnits) {
                console.log("\n*******************************");
                console.log("Insufficient quantity!");
                console.log("*******************************\n");
                // Calling the userPrompt() function
                userPrompt();
            } else {
                // If store does have enough of the product, fulfilling the customer's order by calling the updateStock() function & logging the order summary
                updateStock(res[0].stock_quantity, userUnits);
                console.log("\nQuantity in stock: %s", res[0].stock_quantity);
                console.log("\nOrder received:\n  ID: %s\n  Units: %s", userItem, userUnits);

                // Once the update goes through, showing the customer the total cost of their purchase
                userTotal = res[0].price * userUnits;

                console.log("\n*******************************");
                console.log("Total cost: $%s", userTotal.toFixed(2));
                console.log("*******************************\n");

                // Updating the SQL database with new product revenue based on the sale by calling update ProdRev() & updateDepRev() 
                updateProdRev(res[0].product_sales, userTotal);
                updateDepRev(userTotal);
                // Calling the userPrompt() function
                userPrompt();
            };
        }
    );
};

// Creating the function to update the SQL database to reflect the remaining quantity 
var updateStock = function (stockQuantity, userUnits) {
    updatedStock = stockQuantity - userUnits;

    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: updatedStock
    }, {
        item_id: userItem
    }],
        function (err, res) { }
    );
};

// Creating the function to update the SQL database to reflect the product revenue generated from the sale to the user
var updateProdRev = function (prodSales, userTotal) {
    updatedRev = prodSales + userTotal;

    connection.query("UPDATE products SET ? WHERE ?", [{
        product_sales: updatedRev
    }, {
        item_id: userItem
    }],
        function (err, res) { }
    );
};

// Creating the function to update the SQL database to reflect the department revenue generated from the sale to the user
var updateDepRev = function (userTotal) {
    connection.query("SELECT department_name FROM products WHERE ?", [{ item_id: userItem }], function (err, res) {
        if (err) {
            throw err;
        }
        // Pulling the department for the product the user selected 
        prodDep = res[0].department_name;

        connection.query("SELECT total_sales FROM departments WHERE ?", [{ department_name: prodDep }], function (err, res) {
            if (err) {
                throw err;
            }
            depSales = res[0].total_sales;

            updatedDepRev = depSales + userTotal;
            // Calling the updateRev() function to update the departments table
            updateRev(updatedDepRev, prodDep);
        });
    });
};

// Creating the function to update the department revenue earned from the sale
var updateRev = function (updatedDepRev, prodDep) {
    connection.query("UPDATE departments SET ? WHERE ?", [{
        total_sales: updatedDepRev
    }, {
        department_name: prodDep
    }],
        function (err, res) { }
    )
};


/************************************************/
// MAIN PROCESSES
// Connecting to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// Displaying all of the items available for sale, including the ids, names, and prices of products for sale
connection.query("SELECT * FROM products",
    function (err, res) {
        if (err) {
            throw err;
        }
        console.log("*******************************");
        for (var i = 0; i < res.length; i++) {
            console.log("ID# %s | %s | $%s", res[i].item_id, res[i].product_name, res[i].price.toFixed(2));
        }
        console.log("*******************************");
        // Calling the userPrompt() function 
        userPrompt();
    }
);