# RemuteJS
RemuteJS is TypeScript/JavaScript tool to generate immutable applying lambda expressions.

## Examples (flat and nested object structures)

```ts
interface Employee {
    readonly firstName: string;
    readonly lastName: string;
}
```

```ts
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
```
