import { remute } from "../src/remute.js";

interface Employee {
    readonly firstName: string;
    readonly lastName: string;
}

interface Department {
    readonly title: string;
    readonly Manager: Employee;
    readonly Employees: Employee[];
}

interface Organization {
    readonly name: string;
    readonly developmentDepartment: Department;
    readonly marketingDepartment: Department;
}

const test = (test: Function) => test.call(this);

test(() => {
    const expected: Employee = {
        firstName: "John",
        lastName: "Doe"
    };
    
    const actual = remute(expected, x => x.firstName, "Foo");
    
    console.assert(expected != actual);
    console.assert(expected.firstName != actual.firstName);
    console.assert(expected.lastName == actual.lastName);
    console.assert("Foo" == actual.firstName);
    console.assert("Doe" == actual.lastName);
});

test(() => {
    const expected: Organization = {
        name: "Organization",
        developmentDepartment: {
            title: "Development Department",
            Manager: {
                firstName: "John",
                lastName: "Doe"
            },
            Employees: [
                { firstName: "Dev", lastName: "1" },
                { firstName: "Dev", lastName: "2" },
            ]
        },
        marketingDepartment: {
            title: "Marketing Department",
            Manager: {
                firstName: "Foo",
                lastName: "Bar"
            },
            Employees: [
                { firstName: "Emp", lastName: "1" },
                { firstName: "Emp", lastName: "2" },
            ]
        }
    };

    const actual = remute(expected, x => x.marketingDepartment.Manager.firstName, "Brad");

    console.assert(expected != actual);
    console.assert(expected.name == actual.name);
    console.assert(expected.developmentDepartment == actual.developmentDepartment);
    console.assert(expected.marketingDepartment != actual.marketingDepartment);
    console.assert(expected.marketingDepartment.title == actual.marketingDepartment.title);
    console.assert("Marketing Department" == actual.marketingDepartment.title);
    console.assert(expected.marketingDepartment.Manager != actual.marketingDepartment.Manager);
    console.assert(expected.marketingDepartment.Manager.firstName != actual.marketingDepartment.Manager.firstName);
    console.assert(expected.marketingDepartment.Manager.lastName == actual.marketingDepartment.Manager.lastName);
    console.assert("Brad" == actual.marketingDepartment.Manager.firstName);
    console.assert("Bar" == actual.marketingDepartment.Manager.lastName);
});

test(() => {
    const expected: Organization = {
        name: "Organization",
        developmentDepartment: {
            title: "Development Department",
            Manager: {
                firstName: "John",
                lastName: "Doe"
            },
            Employees: [
                { firstName: "Dev", lastName: "1" },
                { firstName: "Dev", lastName: "2" },
            ]
        },
        marketingDepartment: {
            title: "Marketing Department",
            Manager: {
                firstName: "Foo",
                lastName: "Bar"
            },
            Employees: [
                { firstName: "Emp", lastName: "1" },
                { firstName: "Emp", lastName: "2" },
            ]
        }
    };

    // Yeah, I know, bad thing here - I'm mutating original array but it's just to test
    // that array reference is updated
    const employees = expected.developmentDepartment.Employees;
    employees.push({ firstName: "Dev", lastName: "3" });

    const actual = remute(expected, x => x.developmentDepartment.Employees, employees);

    console.assert(expected != actual);
    console.assert(expected.developmentDepartment != actual.developmentDepartment);
    console.assert(expected.developmentDepartment.Employees != actual.developmentDepartment.Employees);
    console.assert(3 == actual.developmentDepartment.Employees.length);
    console.assert(expected.developmentDepartment.Employees[0] == actual.developmentDepartment.Employees[0]);
    console.assert(expected.developmentDepartment.Employees[1] == actual.developmentDepartment.Employees[1]);
    console.assert(expected.developmentDepartment.title == actual.developmentDepartment.title);
    console.assert(expected.developmentDepartment.Manager == actual.developmentDepartment.Manager);
    console.assert(expected.marketingDepartment == actual.marketingDepartment);
});