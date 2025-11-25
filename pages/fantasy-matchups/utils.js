// Creates positive integer options for a select w/in a given range (inclusive)
export function createOptionsInRange(selectId, lowerLimit, upperLimit){
    let options = [];
    for (let i = lowerLimit; i < (upperLimit + 1); i++){
        options.push(`<option value='${i}'>${i}</option>`);
    }
    document.getElementById(selectId).innerHTML = options.join("");
}

// Checks if every element of an array is unique
export function allUnique(array){
    let set = new Set(array);
    if (set.size == array.length){
        return true;
    }

    return false;
}

// Verifies that 2 arrays don't contain the same elements
export function arraysExclusive(array1, array2){
    let union = [...array1, ...array2];
    return allUnique(union);
}

// Creates a deep copy of an array in a different memory location
export function deepCopy(array){
    let newArray = [];
    for (let i = 0; i < array.length; i++){
        value = array[i];
        newArray.push(value);
    }
    return newArray;
}

// Deep copy for 2D arrays
export function recursiveDeepCopy(nestedArray){
    let newNestedArray = [];
    for (let i = 0; i < nestedArray.length; i++){
        innerArray = deepCopy(nestedArray[i]);
        newNestedArray.push(innerArray);
    }
    return newNestedArray;
}