USE Bamazon;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NULL,
    over_head_costs DECIMAL(10 , 2 ) NULL,
    total_sales DECIMAL(10 , 2 ) NULL default 0.00,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Automotive",30000),
("Books", 5000),
("Electronics", 40000),
("Kitchen & Dining", 20000),
("Pet Supplies", 10000);

SELECT 
    *
FROM
    departments;