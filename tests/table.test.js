const table = require('../js/main');


describe('sortEmployees_function', () => {

    // Tests that the function successfully sorts employees in descending order based on the "total" property. 
    it("test_sort_employees_success", () => {
        const employees = [
            { name: "John", total: 10 },
            { name: "Jane", total: 20 },
            { name: "Bob", total: 15 }
        ];
        const expected = [
            { name: "Jane", total: 20 },
            { name: "Bob", total: 15 },
            { name: "John", total: 10 }
        ];
        table.employees = employees;
        table.sortEmployees();
        expect(table.employees).toEqual(expected);
    });

    // Tests that the function handles an invalid property name for sorting. 
    it("test_sort_employees_invalid_property", () => {
        const employees = [
            { name: "John", total: 10 },
            { name: "Jane", total: 20 },
            { name: "Bob", total: 15 }
        ];
        const expected = [
            { name: "John", total: 10 },
            { name: "Jane", total: 20 },
            { name: "Bob", total: 15 }
        ];
        table.employees = employees;
        table.sortedBy = "invalid_property";
        table.sortEmployees();
        expect(table.employees).toEqual(expected);
    });

    // Tests that the function handles an empty employees array. 
    it("test_sort_employees_empty_array", () => {
        const employees = [];
        const expected = [];
        table.employees = employees;
        table.sortEmployees();
        expect(table.employees).toEqual(expected);
    });

    // Tests that the function handles a non-boolean value for the sortedInDescendingOrder property. 
     it("test_sort_employees_boolean_property", () => {
        const tableInstance = Object.create(table);
        tableInstance.sortedInDescendingOrder = "not a boolean";
        expect(() => tableInstance.sortEmployees()).toThrow();
    });

    // Tests that the function handles errors thrown by the sorting algorithm. 
    it("test_sort_employees_error", () => {
        const tableInstance = Object.create(table);
        tableInstance.employees = null;
        expect(() => tableInstance.sortEmployees()).toThrow();
    });

    // Tests that the function sorts employees based on the sortedBy and sortedInDescendingOrder properties. 
    it("test_sort_employees_general", () => {
        const tableInstance = Object.create(table);
        const sortedEmployees = [...tableInstance.employees].sort((a, b) => b.total - a.total);
        tableInstance.sortEmployees();
        expect(tableInstance.employees).toEqual(sortedEmployees);
    }); 
});

describe('calc_function', () => {

    // Tests that the total property is correctly calculated and added to each employee object. 
    it("test_calc_adds_total_to_employees", () => {
        const employees = [
            { name: "John", academy: 10, challange: 20 },
            { name: "Jane", academy: 15, challange: 25 }
        ];
        const expectedEmployees = [
            { name: "John", academy: 10, challange: 20, total: 30 },
            { name: "Jane", academy: 15, challange: 25, total: 40 }
        ];
        table.employees = employees;
        table.calcAndAddTotalToEmployees();
        expect(table.employees).toEqual(expectedEmployees);
    });

     // Tests that calc function does not throw an error when employees array is empty. 
    it("test_calc_empty_array", () => {
        table.employees = [];
        expect(() => table.calcAndAddTotalToEmployees()).not.toThrow();
    });

    // Tests that calc function does not throw an error when employees array contains invalid data types.  
    it("test_calc_invalid_data_types", () => {
        const invalidEmployees = [{ academy: "a", challange: "b" }, { academy: "c", challange: "d" }];
        table.employees = invalidEmployees;
        expect(() => table.calcAndAddTotalToEmployees()).not.toThrow();
    });
 
  
});
