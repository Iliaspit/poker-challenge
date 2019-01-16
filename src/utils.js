export const values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
export const suits = ["D", "H", "S", "C"];

export const getColourForSuit = suit => suit === "D" || suit === "H" ? "red" : "black";

const getFullName = (namesSelected) => {
    return ["John", "Pete", "Kate", "Anna"].find(name => (!namesSelected.includes(name)));
}

const getSuitsValuesAndKeys = (selectedKeys) => {
    const suitsArr = [];
    const valuesArr = [];
    const keysArr = [];
    while (keysArr.length < 5) {
        for (const suit of suits) {
            if (keysArr.length === 5) { break; }
            for (const value of values) {
                const key = suit + value;
                if (!keysArr.includes(key) && !selectedKeys.includes(key)) {
                    suitsArr.push(suit);
                    valuesArr.push(value);
                    keysArr.push(key);
                }
                if (keysArr.length === 5) { break; }
            }
        }

    }

    return {
        suits: suitsArr,
        values: valuesArr,
        keys: keysArr
    }
}

export const generateNewPlayer = (namesSelected, selectedKeys) => {
    const chosenAttr = getSuitsValuesAndKeys(selectedKeys);
    const {suits, values, keys} = chosenAttr;
    return (
        {
            name: getFullName(namesSelected),
            suits: suits,
            values: values,
            keys: keys
        }
    )
}

export const stringifyArray = (arr) => {
    let str = '';
    for (const el of arr) {
        str += `${el} `;
    }
    return str.trim();
}