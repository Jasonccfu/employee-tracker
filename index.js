const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');
const cTable = require('console.table');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect(function (err) {
  if (err) throw err;
  console.log('connected as id ' + db.threadId);

  startScreen();
});

// All of the prompts shown
function startScreen() {
  inquirer
    .prompt({
      type: 'list',
      choices: [
        'View department',
        'View roles',
        'View employees',
        'Add department',
        'Add role',
        'Add employee',
        'Update employee',
        'Delete Department',
        'Delete Role',
        'Delete Employee',
        'Quit',
      ],
      message: 'What would you like to do?',
      name: 'option',
    })
    .then(function (result) {
      console.log('You entered: ' + result.option);

      switch (result.option) {
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'View department':
          viewDepartment();
          break;
        case 'View roles':
          viewRoles();
          break;
        case 'View employees':
          viewEmployees();
          break;
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        case 'Update employee':
          updateEmployee();
          break;
        default:
          quit();
      }
    });
}

//adding departments when selected
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      message: 'What is the name of the department?',
      name: 'deptName',
    })
    .then(function (answer) {
      db.query(
        'INSERT INTO department (name) VALUES (?)',
        [answer.deptName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

//code for adding roles when selected
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What's the name of the role?",
        name: 'roleName',
      },
      {
        type: 'input',
        message: 'What is the salary for this role?',
        name: 'salaryTotal',
      },
      {
        type: 'input',
        message: 'What is the department id number?',
        name: 'deptID',
      },
    ])
    .then(function (answer) {
      db.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.roleName, answer.salaryTotal, answer.deptID],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

//code for adding employees when selected
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Please enter the first name of the employee.',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Please enter the last name of the employee.',
      },
      {
        name: 'role_id',
        type: 'number',
        message:
          'Please enter the role id associated with the employee. Enter >ONLY< numbers.',
      },
      {
        name: 'manager_id',
        type: 'number',
        message:
          "Please enter the manager's id associated with the employee. Enter>ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [
          response.first_name,
          response.last_name,
          response.role_id,
          response.manager_id,
        ],
        function (err, data) {
          if (err) throw err;
          console.log(
            'The new employee entered has been added successfully to the database.'
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            console.table(result);
            startScreen();
          });
        }
      );
    });
}

//code for updating the employee inputted

function updateEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message:
          'Please enter the first name of the employee you want update in the database.',
      },
      {
        name: 'role_id',
        type: 'number',
        message:
          'Please enter the new role id associated with the employee you want to update in the database. Enter>ONLY numbers.',
      },
    ])
    .then(function (response) {
      db.query(
        'UPDATE employee SET role_id = ? WHERE first_name = ?',
        [response.role_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log(
            'The new role entered has been added successfully to the database.'
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startScreen();
            }
            console.table(result);
            startScreen();
          });
        }
      );
    });
}

//code for viewing departments when selected
function viewDepartment() {
  let query = 'SELECT * FROM department';
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startScreen();
  });
}

//code for viewing roles when selected
function viewRoles() {
  // select from the db
  let query = 'SELECT * FROM role';
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startScreen();
  });
}

//code for viewing employees when selected
function viewEmployees() {
  // select from the db
  let query = 'SELECT * FROM employee';
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startScreen();
  });
}

//code for removing employees when selected
function deleteEmployee() {
  db.query('SELECT * FROM employee', function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'removeEmp',
          message: 'Select the employee who will be removed',
          choices: res.map((emp) => emp.id && emp.first_name),
        },
      ])
      .then(function (answer) {
        const selectedEmp = res.find(
          (emp) => emp.id && emp.first_name === answer.removeEmp
        );
        db.query(
          'DELETE FROM employee WHERE ?',
          [
            {
              id: selectedEmp.id,
            },
          ],
          function (err, res) {
            if (err) throw err;
            console.log('The employee has been removed.\n');
            startScreen();
          }
        );
      });
  });
}

//code for removing departments when selected
function deleteDepartment() {
  inquirer
    .prompt([
      {
        name: 'department_id',
        type: 'number',
        message:
          'Please enter the id of the department you want to delete from the database. Enter>ONLY numbers.',
      },
    ])
    .then(function (response) {
      db.query(
        'DELETE FROM department WHERE id = ?',
        [response.department_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            'The department entered has been deleted successfully from the database.'
          );

          db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startScreen();
            }
            console.table(result);
            startScreen();
          });
        }
      );
    });
}

function deleteRole() {
  inquirer
    .prompt([
      {
        name: 'role_id',
        type: 'number',
        message:
          'Please enter the id of the role you want to delete from the database. Enter>ONLY numbers.',
      },
    ])
    .then(function (response) {
      db.query(
        'DELETE FROM role WHERE id = ?',
        [response.role_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            'The role entered has been deleted successfully from the database.'
          );

          db.query(`SELECT * FROM role`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startScreen();
            }
            console.table(result);
            startScreen();
          });
        }
      );
    });
}

function quit() {
  db.end();
  process.exit();
}
