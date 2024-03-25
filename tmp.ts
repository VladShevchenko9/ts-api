const errors = [
    {
        property: 'first_name',
        constraints: {
            isDefined: 'first_name should not be null or undefined',
            isLength: 'first_name must be longer than or equal to 3 characters',
            isString: 'first_name must be a string'
        }
    },
    {
        property: 'last_name',
        constraints: {
            isDefined: 'last_name should not be null or undefined',
            isLength: 'last_name must be longer than or equal to 3 characters',
            isString: 'last_name must be a string'
        }
    }
]

// console.log(errors[0].property);
// console.log(errors[0].constraints);



function parseValidationErrors(errors) {
    let errorsObj = {};
    
    for (let i = 0; i < errors.length; i++) {
        let propertyName = errors[i].property
        let constraintsName = [];

        for (let index in errors[i].constraints) {
            constraintsName.push(errors[i].constraints[index]);
            errorsObj[propertyName] = constraintsName;

        }
    }

    return errorsObj;
}

console.log(parseValidationErrors(errors));

// const tempObj = {
//     name: 'vlad',
//     last_name: 'Gleck',
//     age: 54,
// }

// for (let value in tempObj) {
//     console.log(tempObj[value]);
// }