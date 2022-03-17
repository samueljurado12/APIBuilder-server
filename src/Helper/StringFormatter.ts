const StringFormatter = (input: string):string => {
    return input.trim().replace(/\s+/g, '_');
}

export default StringFormatter;
