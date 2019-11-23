// SETUP VARIABLES
// Including the mySQL & inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
var profit;


/************************************************/
// FUNCTIONS
// Listing a set of menu options for the supervisor
var sprMenu = function () {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function (user) {
        switch (user.action) {
            // If a supervisor selects View Product Sales by Department, calling the displaySales() function 
            case "View Product Sales by Department":
                displaySales();
                break;
            // If a manager selects Add New Product, calling the newDep() function
            case "Create New Department":
                newDep();
                break;
        }
    });
};

// Displaying a summarized table of product sales by department in the supervisor's terminal/bash window
var displaySales = function () {
    connection.query("SELECT department_id, department_name, over_head_costs, total_sales FROM departments",
        function (err, res) {
            if (err) {
                throw err;
            }
            // Creating the table 
            var table = new Table({
                head: ["ID", "Department Name", "Overhead", "Total Sales", "Total Profit"],
                colWidths: [5, 20, 10, 15, 15]
            });
            for (var i = 0; i < res.length; i++) {
                // Calculating each department's profit
                profit = res[i].total_sales - res[i].over_head_costs;
                // Pushing the data from the SQL database to the table
                table.push(
                    [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, profit]
                );
            }
            // Displaying the table in terminal/bash
            console.log(table.toString());
            // Calling the function to display the menu again
            sprMenu();
        }
    );
};

// Allowing the supervisor to add a completely new department to the store
var newDep = function () {
    inquirer.prompt([{
        type: "input",
        message: "What new department would you like to create?",
        name: "newDepName"
    }, {
        type: "input",
        message: "What is the overhead cost of this department?",
        name: "newDepOH"
    }]).then(function (user) {
        // Adding the new department's data to the SQL database
        connection.query("INSERT INTO departments SET ?", [{
            department_name: user.newDepName,
            over_head_costs: user.newDepOH
        }],
            function (err, res) {
                console.log("\n*******************************");
                console.log("The '%s' Department has been created!", user.newDepName);
                console.log("*******************************\n");
                // Calling the function to display the menu again
                sprMenu();
            }
        );
    });
};


/************************************************/
// MAIN PROCESSES
// Connecting to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // Displaying the supervisor's menu
    sprMenu();
});