const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  findAllDepartments() {
     return this.connection.query("SELECT * FROM department");
  }
  createDepartment(department) {

    return this.connection.query(`INSERT INTO department SET ?`, department);
  }
  findAllRoles() {
    return this.connection.query("SELECT * FROM role");
  }

  createRole(role) {
     return this.connection.query(`INSERT INTO role SET ?`, role);
  }

  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  createEmployee(employee) {
    return this.connection.query(`INSERT INTO employee SET ?`, employee);
  }

  updateEmployeeRole(employeeId, roleId) {
     return this.connection.query(`UPDATE employee SET role_id = ? WHERE id = ? `,[employeeId, roleId]);
  }

  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query("SELECT * FROM employee WHERE departmentId ", [departmentId]);
  }

  findAllEmployeesByManager(managerId) {
    return this.connection.query("SELECT * FROM role LEFT JOIN department ON role.department_id = department.id ", [managerId]);
  }
}

module.exports = new DB(connection);