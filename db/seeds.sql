USE employee_tracker_db;

INSERT INTO department (id,name)
VALUES
 (1,'Sales'),
 (2,'Engineering'),
 (3,'Finance'),
 (4,'Legal');

INSERT INTO role (title, salary, department_id)
VALUES  
 ('Sales Lead',100000,1),
 ('Sales person',80000,1),
 ('Lead Engineer',150000,2),
 ('Software Engineer',120000,2),
 ('Account Manager',160000,3),
 ('Accountant',125000,3),
 ('Legal Team Lead',250000,4),
 ('Lawyer',190000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jason','Chen',3,NULL),
('Amanda','Shen',4,1),
('Peter','Parker',1,1),
('Harrison','Chen',2,2),
('Mandy','Jones',5,2),
('Scott','Miller',6,3);