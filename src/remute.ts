export { remute };

const remute = <TInstance, TValue>(instance: TInstance, expression: (x: TInstance) => TValue, value: TValue) => {
    const stack = parse(expression);
    const reference = stack.shift();
    if (!stack.length) return instance;
    const mutation = compose(stack, value);
    const result = merge(instance, mutation);
    return result as TInstance;
};

const parse = (expression: Function) => {
    return expression
        .toString()
        .split("=>")
        .pop()
        .split(".")
        .map(x => x.trim());
};

const compose = (stack: string[], value) => {
    while (stack.length) {
        const property = stack.pop();
        const instance = {};
        instance[property] = value;
        value = instance;
    }
    return value;
};

const merge = (...mutations) => {
    const instance = {};
    while (mutations.length) {
        const mutation = mutations.shift();
        for (const key in mutation) {
            if (!mutation.hasOwnProperty(key)) continue;
            const isMutationNull = mutation[key] === null;
            const isSame = instance[key] === mutation[key];

            const isInstanceObject = isObject(instance[key]);
            const isInstanceArray = isArray(instance[key]);
            const isInstanceValue = !isInstanceObject && !isInstanceArray;

            const isMutationObject = isObject(mutation[key]);
            const isMutationArray = isArray(mutation[key]);
            const isMutationValue = !isMutationObject && !isMutationArray;

            if (isMutationNull) doAssign(instance, mutation, key);

            else if (isInstanceObject && isMutationObject) doMerge(instance, mutation, key);
            else if (isInstanceObject && isMutationArray) doAssign(instance, mutation, key);
            else if (isInstanceObject && isMutationValue) doAssign(instance, mutation, key);

            else if (isInstanceArray && isMutationObject) doAssign(instance, mutation, key);
            else if (isInstanceArray && isMutationArray) doClone(instance, mutation, key, isSame);
            else if (isInstanceArray && isMutationValue) doAssign(instance, mutation, key);

            else if (isInstanceValue && isMutationObject) doAssign(instance, mutation, key);
            else if (isInstanceValue && isMutationArray) doAssign(instance, mutation, key);
            else if (isInstanceValue && isMutationValue) doAssign(instance, mutation, key);
        }
    }
    return instance;
};

const arrayConstructor = ([]).constructor;
const objectConstructor = ({}).constructor;

const doAssign = (instance: any, mutation: any, key: string) => instance[key] = mutation[key];
const doMerge = (instance: any, mutation: any, key: string) => instance[key] = merge(instance[key], mutation[key]);
const doClone = (instance: any, mutation: any, key: string, isSame: boolean) => instance[key] = isSame ? [...mutation[key]] : mutation[key];

const isArray = (value) => arrayConstructor === value.constructor;
const isObject = (value) => objectConstructor === value.constructor;