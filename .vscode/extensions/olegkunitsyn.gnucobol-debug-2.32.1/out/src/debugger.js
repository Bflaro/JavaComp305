"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_mi2_1 = require("./parser.mi2");
const functions_1 = require("./functions");
const repeatTimeRegex = /(\"\,\s|^)\'(\s|0)\'\s\<repeats\s(\d+)\stimes\>/i;
class CobolFieldDataParser {
    static parse(valueStr) {
        let value = valueStr;
        if (value.indexOf(" ") === -1) {
            return null;
        }
        value = value.substring(value.indexOf(" ") + 1);
        if (value.startsWith("<")) {
            if (value.indexOf(" ") === -1) {
                return null;
            }
            value = value.substring(value.indexOf(" ") + 1);
        }
        const fieldMatch = repeatTimeRegex.exec(value);
        if (fieldMatch) {
            let replacement = "";
            const size = parseInt(fieldMatch[3]);
            for (let i = 0; i < size; i++) {
                replacement += fieldMatch[2];
            }
            replacement += "\"";
            value = value.replace(repeatTimeRegex, replacement);
            if (!value.startsWith("\"")) {
                value = `"${value}`;
            }
        }
        return value;
    }
}
exports.CobolFieldDataParser = CobolFieldDataParser;
class NumericValueParser {
    static format(valueStr, fieldSize, scale, signed) {
        let value = valueStr;
        let isNegative = false;
        if (/^[-\+].+$/.test(value)) {
            isNegative = value.startsWith("-");
            value = value.substring(1, value.length);
        }
        let [wholeNumber, decimals] = value.split(/\./);
        if (!value.includes(".")) {
            decimals = "";
        }
        if (scale < 0) {
            decimals = "";
            wholeNumber = wholeNumber.substring(0, Math.max(0, wholeNumber.length - Math.abs(scale)));
        }
        else if (scale > fieldSize) {
            wholeNumber = "";
            decimals = decimals.substring(Math.min(decimals.length, scale - fieldSize), decimals.length);
        }
        value = wholeNumber + decimals;
        const diff = fieldSize - value.length;
        if (diff > 0) {
            let append = "";
            for (let i = 0; i < diff; i++) {
                append += "0";
            }
            if (fieldSize - scale < 0) {
                value += append;
            }
            else {
                value = append + value;
            }
        }
        else if (diff < 0) {
            if (fieldSize - scale < 0) {
                value = value.substring(0, value.length - Math.abs(diff));
            }
            else {
                value = value.substring(Math.abs(diff), value.length);
            }
        }
        if (signed && isNegative) {
            const sign = String.fromCharCode(parseInt(value[value.length - 1]) + this.ZERO_SIGN_CHAR_CODE);
            value = value.substring(0, value.length - 1) + sign;
        }
        return value;
    }
    static parse(valueStr, fieldSize, scale) {
        let value = valueStr;
        if (value.startsWith('"')) {
            value = value.substring(1, fieldSize + 1);
            const signCharCode = value.charCodeAt(value.length - 1);
            let sign = "";
            if (signCharCode >= this.ZERO_SIGN_CHAR_CODE) {
                sign = "-";
                value = `${value.substring(0, value.length - 1)}${signCharCode - this.ZERO_SIGN_CHAR_CODE}`;
            }
            if (value.length < scale) {
                const diff = scale - value.length;
                let prefix = "";
                for (let i = 0; i < diff; i++) {
                    prefix += "0";
                }
                value = prefix + value;
            }
            else if (scale < 0) {
                const diff = scale * -1;
                let suffix = "";
                for (let i = 0; i < diff; i++) {
                    suffix += "0";
                }
                value += suffix;
            }
            const wholeNumber = value.substring(0, value.length - scale);
            const decimals = value.substring(value.length - scale);
            let numericValue = `${sign}${wholeNumber}`;
            if (decimals.length > 0) {
                numericValue = `${numericValue}.${decimals}`;
            }
            return `${parseFloat(numericValue)}`;
        }
        return value;
    }
}
exports.NumericValueParser = NumericValueParser;
NumericValueParser.ZERO_SIGN_CHAR_CODE = 112;
class AlphanumericValueParser {
    static format(valueStr, fieldSize) {
        let value = valueStr;
        if (value.startsWith('"')) {
            value = value.substring(1);
        }
        if (value.endsWith('"')) {
            value = value.substring(0, value.length - 1);
        }
        const diff = fieldSize - value.length;
        if (diff > 0) {
            let suffix = "";
            for (let i = 0; i < diff; i++) {
                suffix += " ";
            }
            value += suffix;
        }
        else {
            value = value.substring(0, value.length + diff);
        }
        return value;
    }
    static parse(valueStr, fieldSize) {
        const value = valueStr;
        let shift = 0;
        if (value.startsWith('"')) {
            shift = 1;
        }
        const size = Math.min(fieldSize + shift, valueStr.length - shift);
        return `"${value.substring(shift, size).trim()}"`;
    }
}
exports.AlphanumericValueParser = AlphanumericValueParser;
var CobFlag;
(function (CobFlag) {
    CobFlag[CobFlag["HAVE_SIGN"] = 0] = "HAVE_SIGN";
    CobFlag[CobFlag["SIGN_SEPARATE"] = 1] = "SIGN_SEPARATE";
    CobFlag[CobFlag["SIGN_LEADING"] = 2] = "SIGN_LEADING";
    CobFlag[CobFlag["BLANK_ZERO"] = 3] = "BLANK_ZERO";
    CobFlag[CobFlag["JUSTIFIED"] = 4] = "JUSTIFIED";
    CobFlag[CobFlag["BINARY_SWAP"] = 5] = "BINARY_SWAP";
    CobFlag[CobFlag["REAL_BINARY"] = 6] = "REAL_BINARY";
    CobFlag[CobFlag["IS_POINTER"] = 7] = "IS_POINTER";
    CobFlag[CobFlag["NO_SIGN_NIBBLE"] = 8] = "NO_SIGN_NIBBLE";
    CobFlag[CobFlag["IS_FP"] = 9] = "IS_FP";
    CobFlag[CobFlag["REAL_SIGN"] = 10] = "REAL_SIGN";
    CobFlag[CobFlag["BINARY_TRUNC"] = 11] = "BINARY_TRUNC";
    CobFlag[CobFlag["CONSTANT"] = 12] = "CONSTANT";
})(CobFlag = exports.CobFlag || (exports.CobFlag = {}));
const flagMatchers = new Map();
flagMatchers.set(/0x\d\d\d1/, CobFlag.HAVE_SIGN);
flagMatchers.set(/0x\d\d\d2/, CobFlag.SIGN_SEPARATE);
flagMatchers.set(/0x\d\d\d4/, CobFlag.SIGN_LEADING);
flagMatchers.set(/0x\d\d\d8/, CobFlag.BLANK_ZERO);
flagMatchers.set(/0x\d\d1\d/, CobFlag.JUSTIFIED);
flagMatchers.set(/0x\d\d2\d/, CobFlag.BINARY_SWAP);
flagMatchers.set(/0x\d\d4\d/, CobFlag.REAL_BINARY);
flagMatchers.set(/0x\d\d8\d/, CobFlag.IS_POINTER);
flagMatchers.set(/0x\d1\d\d/, CobFlag.NO_SIGN_NIBBLE);
flagMatchers.set(/0x\d2\d\d/, CobFlag.IS_FP);
flagMatchers.set(/0x\d4\d\d/, CobFlag.REAL_SIGN);
flagMatchers.set(/0x\d8\d\d/, CobFlag.BINARY_TRUNC);
flagMatchers.set(/0x1\d\d\d/, CobFlag.CONSTANT);
var VariableType;
(function (VariableType) {
    VariableType["0x00"] = "unknown";
    VariableType["0x01"] = "group";
    VariableType["0x02"] = "boolean";
    VariableType["0x10"] = "numeric";
    VariableType["0x11"] = "numeric binary";
    VariableType["0x12"] = "numeric packed";
    VariableType["0x13"] = "numeric float";
    VariableType["0x14"] = "numeric double";
    VariableType["0x15"] = "numeric l double";
    VariableType["0x16"] = "numeric FP DEC64";
    VariableType["0x17"] = "numeric FP DEC128";
    VariableType["0x18"] = "numeric FP BIN32";
    VariableType["0x19"] = "numeric FP BIN64";
    VariableType["0x1A"] = "numeric FP BIN128";
    VariableType["0x1B"] = "numeric COMP5";
    VariableType["0x24"] = "numeric edited";
    VariableType["0x20"] = "alphanumeric";
    VariableType["0x21"] = "alphanumeric";
    VariableType["0x22"] = "alphanumeric";
    VariableType["0x23"] = "alphanumeric edited";
    VariableType["0x40"] = "national";
    VariableType["0x41"] = "national edited";
    VariableType["int"] = "integer";
    VariableType["cob_u8_t"] = "group";
})(VariableType = exports.VariableType || (exports.VariableType = {}));
class Attribute {
    constructor(cName, type, digits, scale, flagStr) {
        this.cName = cName;
        this.type = type;
        this.digits = digits;
        this.scale = scale;
        this.flags = this.buildFlags(flagStr);
    }
    has(flag) {
        return this.flags.has(flag);
    }
    buildFlags(flagsStr) {
        if (!flagsStr) {
            return new Set();
        }
        const flags = new Set();
        flagMatchers.forEach((flag, matcher) => {
            if (matcher.test(flagsStr)) {
                flags.add(flag);
            }
        });
        return flags;
    }
    getDetails(size) {
        const details = [];
        let type = this.type;
        switch (this.type) {
            case 'boolean':
                type = "bit";
                details.push({ type: 'number', name: 'digits', value: `${this.digits}` });
                break;
            case 'numeric binary':
                if (this.has(CobFlag.IS_POINTER)) {
                    type = "pointer";
                    details.push({ type: 'number', name: 'digits', value: `${this.digits}` });
                    break;
                }
            case 'numeric':
            case 'numeric packed':
            case 'numeric float':
            case 'numeric double':
            case 'numeric edited':
                details.push({ type: 'boolean', name: 'signed', value: `${this.has(CobFlag.HAVE_SIGN)}` });
                details.push({ type: 'number', name: 'digits', value: `${this.digits}` });
                details.push({ type: 'number', name: 'scale', value: `${this.scale}` });
                break;
            case 'group':
            case 'alphanumeric':
            case 'national':
                details.push({ type: 'number', name: 'size', value: `${size}` });
                break;
            default:
                break;
        }
        return [type, details];
    }
    format(valueStr, fieldSize) {
        if (!valueStr) {
            return null;
        }
        switch (this.type) {
            case 'numeric':
                return NumericValueParser.format(valueStr, fieldSize, this.scale, this.has(CobFlag.HAVE_SIGN));
            case 'group':
            case 'numeric edited':
            case 'alphanumeric':
            case 'alphanumeric edited':
            case 'national':
            case 'national edited':
                return AlphanumericValueParser.format(valueStr, fieldSize);
            default:
                throw new Error(`Not supported type: ${this.type}`);
        }
    }
    parse(valueStr, fieldSize) {
        if (!valueStr) {
            return null;
        }
        if (valueStr.startsWith("0x")) {
            valueStr = CobolFieldDataParser.parse(valueStr);
        }
        if (!valueStr) {
            return null;
        }
        switch (this.type) {
            case 'numeric':
                return NumericValueParser.parse(valueStr, fieldSize, this.scale);
            case 'numeric edited':
            case 'alphanumeric':
            case 'alphanumeric edited':
            case 'national':
            case 'national edited':
                return AlphanumericValueParser.parse(valueStr, fieldSize);
            case 'integer':
            case 'group':
                return valueStr;
            default:
                throw new Error(`Not supported type: ${this.type}`);
        }
    }
    parseUsage(valueStr) {
        if (!valueStr) {
            return null;
        }
        if (valueStr.startsWith("0x")) {
            valueStr = CobolFieldDataParser.parse(valueStr);
        }
        if (!valueStr) {
            return null;
        }
        switch (this.type) {
            case 'boolean':
            case 'numeric':
            case 'numeric binary':
            case 'numeric packed':
            case 'numeric float':
            case 'numeric double':
            case 'numeric long double':
            case 'numeric fp dec64':
            case 'numeric fp dec128':
            case 'numeric fp bin32':
            case 'numeric fp bin64':
            case 'numeric fp bin128':
            case 'numeric comp5':
                return functions_1.removeLeadingZeroes(valueStr.substring(1, valueStr.length - 1));
            default:
                return valueStr;
        }
    }
}
exports.Attribute = Attribute;
class DebuggerVariable {
    constructor(cobolName, cName, functionName, attribute = null, size = null, value = null, parent = null, children = new Map()) {
        this.cobolName = cobolName;
        this.cName = cName;
        this.functionName = functionName;
        this.attribute = attribute;
        this.size = size;
        this.value = value;
        this.parent = parent;
        this.children = children;
        [this.displayableType, this.details] = this.attribute.getDetails(this.size);
    }
    addChild(child) {
        child.parent = this;
        this.children.set(child.cobolName, child);
    }
    getDataStorage() {
        if (this.parent) {
            return this.parent.getDataStorage();
        }
        return this;
    }
    hasChildren() {
        return this.children.size > 0;
    }
    setValue(value) {
        this.value = this.attribute.parse(value, this.size);
    }
    formatValue(value) {
        return this.attribute.format(value, this.size);
    }
    setValueUsage(value) {
        this.value = this.attribute.parseUsage(value);
    }
    toDebugProtocolVariable(showDetails) {
        const result = [];
        if (showDetails) {
            for (const detail of this.details) {
                result.push({
                    name: detail.name,
                    evaluateName: this.cobolName,
                    type: detail.type,
                    value: detail.value,
                    variablesReference: 0
                });
            }
        }
        result.push({
            name: 'value',
            evaluateName: this.cobolName,
            value: this.value || "null",
            variablesReference: 0
        });
        return result;
    }
}
exports.DebuggerVariable = DebuggerVariable;
class VariableObject {
    constructor(node) {
        this.name = parser_mi2_1.MINode.valueOf(node, "name");
        this.exp = parser_mi2_1.MINode.valueOf(node, "exp");
        this.numchild = parseInt(parser_mi2_1.MINode.valueOf(node, "numchild"));
        this.type = parser_mi2_1.MINode.valueOf(node, "type");
        this.value = parser_mi2_1.MINode.valueOf(node, "value");
        this.threadId = parser_mi2_1.MINode.valueOf(node, "thread-id");
        this.frozen = !!parser_mi2_1.MINode.valueOf(node, "frozen");
        this.dynamic = !!parser_mi2_1.MINode.valueOf(node, "dynamic");
        this.displayhint = parser_mi2_1.MINode.valueOf(node, "displayhint");
        // TODO: use has_more when it's > 0
        this.hasMore = !!parser_mi2_1.MINode.valueOf(node, "has_more");
    }
    applyChanges(node) {
        this.value = parser_mi2_1.MINode.valueOf(node, "value");
        if (!!parser_mi2_1.MINode.valueOf(node, "type_changed")) {
            this.type = parser_mi2_1.MINode.valueOf(node, "new_type");
        }
        this.dynamic = !!parser_mi2_1.MINode.valueOf(node, "dynamic");
        this.displayhint = parser_mi2_1.MINode.valueOf(node, "displayhint");
        this.hasMore = !!parser_mi2_1.MINode.valueOf(node, "has_more");
    }
    isCompound() {
        return this.numchild > 0 ||
            this.value === "{...}" ||
            (this.dynamic && (this.displayhint === "array" || this.displayhint === "map"));
    }
    toProtocolVariable() {
        return {
            name: this.exp,
            evaluateName: this.name,
            value: (this.value === void 0) ? "<unknown>" : this.value,
            type: this.type,
            variablesReference: this.id
        };
    }
}
exports.VariableObject = VariableObject;
exports.MIError = class MIError {
    constructor(message, source) {
        Object.defineProperty(this, 'name', {
            get: () => this.constructor.name,
        });
        Object.defineProperty(this, 'message', {
            get: () => message,
        });
        Object.defineProperty(this, 'source', {
            get: () => source,
        });
        Error.captureStackTrace(this, this.constructor);
    }
    toString() {
        return `${this.message} (from ${this.source})`;
    }
};
Object.setPrototypeOf(exports.MIError, Object.create(Error.prototype));
exports.MIError.prototype.constructor = exports.MIError;
//# sourceMappingURL=debugger.js.map