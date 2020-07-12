const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db/index");
require("console.table");

init();


function init() {

  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add Role",
          value: "ADD_ROLE",
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
    },
  ]);
  switch (choice) {
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    

    default:
      return quit();
  }
}

async function viewDepartments() {
  const allDept = await db.findAllDepartments();

  console.log("\n");
  console.table(allDept);

  loadMainPrompts();
}

async function addDepartment() {
  const addDept = await prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]);
    await db.createDepartment(addDept);

  console.log("Added " + addDept.name + " to the database");

  loadMainPrompts();
}

async function viewRoles() {
   const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  loadMainPrompts();
}

async function addRole() {

  const addRoles = await db.findAllRoles();

  const roleChoices = addRoles.map(({ id, name }) => ({
    name: name,
    value: id,
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?",
    },
    {
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: roleChoices,
    },
  ]);


     await db.createRole(role);

  console.log(`Added ${role.title} to the database`);

  loadMainPrompts();
}

async function viewEmployees() {
  const allEmp = await db.findAllEmployees();

  console.log("\n");
  console.table(allEmp);

  loadMainPrompts();
}


async function updateEmployeeRole() {
  const  findEmp = await db.findAllEmployees();

  const empChoices = findEmp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to update",
      choices: empChoices, 
    },
  ]);

  const findRole = await db.findAllRoles();

  const roleChoices = findRole.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the new role?",
      choices: roleChoices,
    },
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

async function addEmployee() {

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);
  const findRole = await db.findAllRoles();

  const roleChoices = findRole.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the new role?",
      choices: roleChoices,
    },
  ]);
  employee.role_id = roleId;
  const findMgr = await db.findAllEmployees();

  const mgrChoices = findMgr.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Who is the manager?",
      choices: mgrChoices,
    },
  ]);
  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}