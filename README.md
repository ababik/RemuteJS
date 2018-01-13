# RemuteJS
RemuteJS is TypeScript/JavaScript tool to produce new immutable object from the previous one using ES6 arrow functions.
It is to simplify and reduce amount of boilerplate code dealing with immutable objects, like produce state in React application.

## Examples
```js
const expected = {
    firstName: "John",
    lastName: "Doe"
};

const actual = remute(expected, x => x.firstName, "Foo");

console.assert(expected != actual);
console.assert(expected.firstName != actual.firstName);
console.assert(expected.lastName == actual.lastName);
console.assert("Foo" == actual.firstName);
console.assert("Doe" == actual.lastName);
```
