# RemuteJS
RemuteJS is TypeScript/JavaScript tool to produce new immutable object from the previous one using ES6 arrow functions.
It is to simplify and reduce amount of boilerplate code dealing with immutable objects, like produce state in React application.

```js
state = remute(state, x => x.foo.bar, "new value");
```
RemuteJS exports `remute` function that accepts 
1. current state 
2. arrow function that is a navigation property pointing to the property you are going to change
3. new value

The result has updated references for all the objects involved in arrow function. The rest of the references remain untouched. 

Obviously using arrow functions along with TypeScript gives you the best coding experience incluting refactoring features.
![Alt text](/assets/coding.png "Coding is cool with RemuteJS")

RemuteJS is written using TypeScript and by default is transpiled to ES6 but it works just fine being transpiled to ES5.

## Basic example
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
