CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10 , 2 ) NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chopsticks", "Kitchen & Dining", 5.42, 100),
("Jumper Cables", "Automotive", 25.00, 5),
("Can Penguins Fly?", "Books", 14.87, 2),
("PetSafe Lickety Stik Dog Treat, Bacon", "Pet Supplies", 3.89, 2000),
("Nylabone Advanced Oral Care Natural Dog Dental Kit", "Pet Supplies", 5.50, 91),
("Puppy Snacks", "Pet Supplies", 3.70, 150),
("Deer Antlers Dog Toys", "Pet Supplies", 5.35, 41),
("Fight Club", "Books", 9.10, 51),
("Cooking with Bobby Flay", "Books", 9.99, 500),
("PlayStation 5", "Electronics", 500.00, 20),
("HTC VIVE - Virtual Reality System", "Electronics", 799.99, 15),
("Apple Watch 3rd Gen, Space Gray", "Electronics", 175.00, 300);

    
ALTER TABLE products
ADD product_sales DECIMAL(10 , 2 ) default 0.00;

SELECT 
    *
FROM
    products;