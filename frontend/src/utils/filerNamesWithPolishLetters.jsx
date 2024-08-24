export const filterNamesWithPolishLetters = (options, {inputValue}) => {
    return options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.toLowerCase().localeCompare(inputValue.toLowerCase(), 'pl', {sensitivity: 'base'}) === 0
    );
};