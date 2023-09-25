"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numberOrDot = /[0-9.]/;
const numberOrChar = /[a-z0-9]/i;
const numberOrCharOrDot = /[a-z0-9.]/i;
const containsCharacter = /(?=.*[a-zA-Z]).*/;
const containsLeadingZeroes = /^[-+]{0,1}0*/;
function removeLeadingZeroes(value) {
    if (!value || value.startsWith("0x") || value.startsWith("\"")) {
        return value;
    }
    const negativeSign = value.startsWith("-") ? value.charAt(0) : "";
    if (containsLeadingZeroes.test(value)) {
        let fixedValue = value.replace(containsLeadingZeroes, "");
        if (fixedValue.length === 0 || fixedValue.startsWith(".")) {
            fixedValue = "0" + fixedValue;
        }
        return negativeSign + fixedValue;
    }
    return value;
}
exports.removeLeadingZeroes = removeLeadingZeroes;
function checkToken(token, tokenStack, functionName, sourceMap, variablesInC) {
    if (token.length === 0) {
        return "";
    }
    if (containsCharacter.test(token)) {
        let position = -1;
        let variableName = token;
        do {
            const variable = sourceMap.findVariableByCobol(functionName, variableName);
            if (variable) {
                variablesInC.add(variable.cName);
                tokenStack.push(variable.cName);
                if (position !== -1) {
                    tokenStack.push(token.substring(position));
                }
                return "";
            }
            position = variableName.lastIndexOf(".");
            if (position !== -1) {
                variableName = variableName.substring(0, position);
            }
        } while (position !== -1);
    }
    else {
        token = removeLeadingZeroes(token);
    }
    tokenStack.push(token);
    return "";
}
function parseExpression(expression, functionName, sourceMap) {
    const tokenStack = [];
    const variableInC = new Set();
    let token = "";
    let openQuote = false;
    let quoteMarker = null;
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (openQuote) {
            token += char;
            if (char === quoteMarker) {
                tokenStack.push(token);
                openQuote = false;
                token = "";
            }
            continue;
        }
        switch (char) {
            case ' ':
            case '\t':
            case '\n':
                token = checkToken(token, tokenStack, functionName, sourceMap, variableInC);
                continue;
            case '\'':
            case '"':
                quoteMarker = char;
                token += char;
                openQuote = true;
                continue;
            case '(':
            case ')':
            case '/':
            case '*':
            case ',':
                token = checkToken(token, tokenStack, functionName, sourceMap, variableInC);
                tokenStack.push(char);
                continue;
            case '+':
                if (numberOrDot.test(expression[i + 1])) {
                    token += char;
                    continue;
                }
                token = checkToken(token, tokenStack, functionName, sourceMap, variableInC);
                tokenStack.push(char);
                continue;
            case '-':
                if (numberOrChar.test(expression[i - 1]) || numberOrCharOrDot.test(expression[i + 1])) {
                    token += char;
                    continue;
                }
                token = checkToken(token, tokenStack, functionName, sourceMap, variableInC);
                tokenStack.push(char);
                continue;
            default:
                token += char;
        }
    }
    checkToken(token, tokenStack, functionName, sourceMap, variableInC);
    return [tokenStack.join(" "), Array.from(variableInC)];
}
exports.parseExpression = parseExpression;
const containsQuotes = /"/g;
function cleanRawValue(rawValue) {
    let cleanedRawValue = rawValue;
    if (!!cleanedRawValue && cleanedRawValue.startsWith("\"")) {
        cleanedRawValue = cleanedRawValue.substring(1);
    }
    if (!!cleanedRawValue && cleanedRawValue.endsWith("\"")) {
        cleanedRawValue = cleanedRawValue.substring(0, cleanedRawValue.length - 1);
    }
    if (containsQuotes.test(cleanedRawValue)) {
        cleanedRawValue = cleanedRawValue.replace(containsQuotes, '\\\\\"');
    }
    return cleanedRawValue;
}
exports.cleanRawValue = cleanRawValue;
//# sourceMappingURL=functions.js.map