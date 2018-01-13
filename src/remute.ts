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
        .replace("return", "=>")
        .split("=>")
        .pop()
        .replace(/;|}/g, "")
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
            
            const doAssign = () => instance[key] = mutation[key];
            const doMerge = () => instance[key] = merge(instance[key], mutation[key]);
            const doClone = () => instance[key] = isSame ? [...mutation[key]] : mutation[key];

            if (isMutationNull) doAssign();

            else if (isInstanceObject && isMutationObject) doMerge();
            else if (isInstanceObject && isMutationArray) doAssign();
            else if (isInstanceObject && isMutationValue) doAssign();

            else if (isInstanceArray && isMutationObject) doAssign();
            else if (isInstanceArray && isMutationArray) doClone();
            else if (isInstanceArray && isMutationValue) doAssign();

            else if (isInstanceValue && isMutationObject) doAssign();
            else if (isInstanceValue && isMutationArray) doAssign();
            else if (isInstanceValue && isMutationValue) doAssign();
        }
    }
    return instance;
};

const isArray = (value) => Object.prototype.toString.call(value) === "[object Array]";
const isObject = (value) => (typeof value === "object") && !isArray(value);