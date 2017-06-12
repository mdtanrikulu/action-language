(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Tombstone", [], factory);
	else if(typeof exports === 'object')
		exports["Tombstone"] = factory();
	else
		root["Tombstone"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Statement = undefined;
	
	var _statement = __webpack_require__(2);
	
	var _statement2 = _interopRequireDefault(_statement);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Statement = _statement2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _table = __webpack_require__(3);
	
	var Statement = function () {
	    function Statement(statement) {
	        _classCallCheck(this, Statement);
	
	        this.symbols = extractSymbols(statement);
	        var error = checkWellFormed(this.symbols);
	        if (error) {
	            throw new Error(error);
	        }
	        this.statement = statement;
	        this.variables = extractvariables(this.statement);
	        this.symbolsRPN = convertToRPN(this.symbols);
	        this.tree = RPNToTree(this.symbolsRPN);
	    }
	
	    _createClass(Statement, [{
	        key: 'evaluate',
	        value: function evaluate(values) {
	            var evalReady = performSubstitution(this.symbolsRPN, values);
	            var outStack = [];
	            var operands = [];
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = evalReady[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var symbol = _step.value;
	
	                    if (typeof symbol === 'boolean') {
	                        outStack.push(symbol);
	                    } else {
	                        operands.push(outStack.pop());
	                        if (symbol !== '~') {
	                            operands.push(outStack.pop());
	                        }
	                        outStack.push(_evaluate(symbol, operands));
	                        operands = [];
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	
	            return outStack[0];
	        }
	    }, {
	        key: 'variables',
	        value: function variables() {
	            return this.variables;
	        }
	    }, {
	        key: 'symbols',
	        value: function symbols() {
	            return this.symbols;
	        }
	    }, {
	        key: 'table',
	        value: function table() {
	            return _table(this, 'Json');
	        }
	    }]);
	
	    return Statement;
	}();
	
	/**
	 * Uses the Shunting-Yard algorithm to convert a propositional logic statement
	 * to Reverse Polish notation (RPN).
	 *
	 * @example
	 * // [ 'P', 'Q', '<->', 'R', 'Q', '|', '&', 'S', '->' ]
	 * convertToRPN('(P <-> Q) & (R | Q) -> S')
	 *
	 * @param   {String} statement - The statement to be converted.
	 *
	 * @returns {Array} - The statement in RPN.
	 */
	
	
	function convertToRPN(symbols) {
	    var closingParen = false;
	    var outQueue = [];
	    var opStack = [];
	
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	        for (var _iterator2 = symbols[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var symbol = _step2.value;
	
	            if (symbol.match(/^[a-z]{1}$/i)) {
	                outQueue.push(symbol);
	            } else if (symbol === ')') {
	                closingParen = false;
	                while (!closingParen && opStack[opStack.length - 1] !== '(') {
	                    outQueue.push(opStack.pop());
	                    closingParen = opStack[opStack.length - 1] === '(';
	                }
	                opStack.pop();
	            } else {
	                while (compareOperators(symbol, opStack[opStack.length - 1])) {
	                    outQueue.push(opStack.pop());
	                }
	                opStack.push(symbol);
	            }
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }
	
	    outQueue.push.apply(outQueue, opStack.reverse());
	    return outQueue;
	}
	
	/**
	 * Verify that the symbols array is valid.
	 *
	 * @param  {Array} symbols - The list of symbols to be checked.
	 *
	 * @return {String|null} - A message if an error is found and null otherwise.
	 */
	function checkWellFormed(symbols) {
	    var isOperand = /^[a-z()]{1}$/i;
	    var opening = 0;
	    var closing = 0;
	    var symbol = null;
	    var prev = null;
	    var next = null;
	    var isOperator = false;
	    var wasOperator = false;
	    var error = null;
	
	    if (symbols.length === 0) {
	        return 'no symbols!';
	    }
	
	    for (var i = 0; i < symbols.length; ++i) {
	        symbol = symbols[i];
	        next = symbols[i + 1] === undefined ? '' : symbols[i + 1];
	        prev = symbols[i - 1] === undefined ? '' : symbols[i - 1];
	        isOperator = ['~', '&', '||', '->', '<->'].includes(symbol);
	        if (!isOperator && !symbol.match(isOperand)) {
	            error = 'unknown symbol!';
	        }
	        if (symbol === '(') {
	            opening += 1;
	        } else if (symbol === ')') {
	            closing += 1;
	        } else if (isOperator && wasOperator && symbol !== '~') {
	            error = 'double operators!';
	        } else if (isOperator && symbol !== '~') {
	            if (!prev.match(isOperand) || next !== '~' && !next.match(isOperand)) {
	                error = 'missing operand!';
	            }
	        } else if (symbol === '~') {
	            if (!next.match(isOperand)) {
	                error = 'missing operand!';
	            }
	        }
	        wasOperator = isOperator;
	    }
	
	    if (opening !== closing) {
	        error = 'unbalanced parentheses!';
	    } else if (symbols.length === opening + closing) {
	        error = 'no symbols!';
	    }
	    return error;
	}
	
	/**
	 * Extract all symbols from statement.
	 *
	 * @example
	 * // [ 'P', '&', '~', 'Q' ]
	 * extractSymbols('P & ~Q')
	 *
	 * @example
	 * // [ '(', 'P', '<->', 'Q', ')', '&', '(', 'R', '|', 'Q', ')', '->', 'S' ]
	 * extractSymbols('(P<-> Q) & (R|Q) ->S')
	 *
	 * @param   {String} statement - The statement to be parsed.
	 *
	 * @returns {Array} - An array containing each symbol.
	 */
	function extractSymbols(statement) {
	    var accepted = ['(', ')', '->', '&', '||', '~', '<->'];
	    var symbols = statement.split(' ');
	    var idx = 0;
	    var cond = null;
	    var bicond = null;
	    var extracted = [];
	
	    var _iteratorNormalCompletion3 = true;
	    var _didIteratorError3 = false;
	    var _iteratorError3 = undefined;
	
	    try {
	        for (var _iterator3 = symbols[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var symbol = _step3.value;
	
	            if (!symbol.match(/^[a-z]+$/i) && accepted.indexOf(symbol) < 0) {
	                idx = 0;
	                while (idx < symbol.length) {
	                    cond = symbol.slice(idx, idx + 2);
	                    bicond = symbol.slice(idx, idx + 3);
	                    if (bicond === '<->') {
	                        extracted.push(bicond);
	                        idx += 3;
	                    } else if (cond === '->' || cond === '||') {
	                        extracted.push(cond);
	                        idx += 2;
	                    } else {
	                        extracted.push(symbol.charAt(idx));
	                        idx += 1;
	                    }
	                }
	            } else {
	                extracted.push(symbol);
	            }
	        }
	    } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                _iterator3.return();
	            }
	        } finally {
	            if (_didIteratorError3) {
	                throw _iteratorError3;
	            }
	        }
	    }
	
	    return extracted;
	}
	
	/**
	 * Extract the variables from a given statement.
	 *
	 * @param   {String} statement - The statement to be considered.
	 *
	 * @returns {Array} - All of the variables in the given statement.
	 */
	function extractvariables(statement) {
	    var symbols = extractSymbols(statement);
	    var variables = [];
	
	    var _iteratorNormalCompletion4 = true;
	    var _didIteratorError4 = false;
	    var _iteratorError4 = undefined;
	
	    try {
	        for (var _iterator4 = symbols[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var symbol = _step4.value;
	
	            if (symbol.match(/^[a-z]+$/i)) {
	                variables.push(symbol);
	            }
	        }
	    } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                _iterator4.return();
	            }
	        } finally {
	            if (_didIteratorError4) {
	                throw _iteratorError4;
	            }
	        }
	    }
	
	    return variables;
	}
	
	/**
	 * Compare the precedence of two operators.
	 *
	 * @param   {String} op1 - The first operator.
	 * @param   {String} op2 - The second operator.
	 *
	 * @returns {Boolean} - true if op1 has lower precedence than op2 and false
	 *  otherwise.
	 */
	function compareOperators(op1, op2) {
	    var operators = ['~', '&', '||', '->', '<->'];
	    if (op2 === undefined || op2 === '(') {
	        return false;
	    }
	    return operators.indexOf(op1) > operators.indexOf(op2);
	}
	
	/**
	 * Substitute values for symbols where possible.
	 *
	 * @example
	 * // [ 'true', '&', '~', 'false' ]
	 * performSubstitution(['P', '&', '~', 'Q'], {'P': true, 'Q': false})
	 *
	 * @param   {Array} symbols - The symbols to be considered.
	 * @param   {Object} values - An object mapping symbols to their intended
	 *  values.
	 *
	 * @returns {Array} - An array with symbols replaced by their values.
	 */
	function performSubstitution(symbols, values) {
	    var prepared = [];
	
	    var _iteratorNormalCompletion5 = true;
	    var _didIteratorError5 = false;
	    var _iteratorError5 = undefined;
	
	    try {
	        for (var _iterator5 = symbols[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	            var symbol = _step5.value;
	
	            if (['(', ')', '->', '&', '||', '<->', '~'].includes(symbol)) {
	                prepared.push(symbol);
	            } else {
	                prepared.push(values[symbol]);
	            }
	        }
	    } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                _iterator5.return();
	            }
	        } finally {
	            if (_didIteratorError5) {
	                throw _iteratorError5;
	            }
	        }
	    }
	
	    return prepared;
	}
	
	/**
	 * Evaluate the given operator with its operand(s).
	 *
	 * @param   {String} operator - The operator to be used.
	 * @param   {Array} operands - The operands to be used.
	 *
	 * @returns {Boolean} - The result of the evaluation.
	 */
	function _evaluate(operator, operands) {
	    switch (operator) {
	        case '~':
	            return !operands[0];
	        case '&':
	            return operands[0] && operands[1];
	        case '||':
	            return operands[0] || operands[1];
	        case '->':
	            return !operands[1] || operands[0];
	        case '<->':
	            return operands[0] === operands[1];
	    }
	}
	
	function RPNToTree(symbols) {
	    var outStack = [];
	    var right = null;
	    var size = 0;
	
	    var _iteratorNormalCompletion6 = true;
	    var _didIteratorError6 = false;
	    var _iteratorError6 = undefined;
	
	    try {
	        for (var _iterator6 = symbols[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	            var symbol = _step6.value;
	
	            if (symbol.match(/^[a-z]{1}$/i)) {
	                outStack.push({
	                    'name': symbol
	                });
	            } else {
	                right = outStack.pop();
	                if (symbol === '~') {
	                    outStack.push({
	                        'name': symbol,
	                        'children': [right]
	                    });
	                } else {
	                    outStack.push({
	                        'name': symbol,
	                        'children': [right, outStack.pop()]
	                    });
	                }
	            }
	            size += 1;
	        }
	    } catch (err) {
	        _didIteratorError6 = true;
	        _iteratorError6 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                _iterator6.return();
	            }
	        } finally {
	            if (_didIteratorError6) {
	                throw _iteratorError6;
	            }
	        }
	    }
	
	    return {
	        'tree': outStack,
	        'size': size
	    };
	}
	
	exports.default = Statement;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var mdTable = __webpack_require__(4
	
	/**
	 * Get all boolean input values for n variables.
	 *
	 * @example
	 * // [ [ true, true ], [ true, false ], [ false, true ], [ false, false ] ]
	 * getValues(2, [])
	 *
	 * @param   {Number} n - The number of variables.
	 * @param   {Array} t - The array to be recursively filled.
	 *
	 * @returns {Array} All possible input values.
	 */
	);function getValues(n, t) {
	    if (t.length === n) {
	        return [t];
	    } else {
	        return getValues(n, t.concat(true)).concat(getValues(n, t.concat(false)));
	    }
	}
	
	/**
	 * Get all boolean values for each variable.
	 *
	 * @example
	 * // [ { P: true }, { P: false } ]
	 * getCases (['P'])
	 *
	 * @param   {Array} variables - All variables in a given statement.
	 *
	 * @returns {Array} - An array of objects mapping variables to their possible
	 *  values.
	 */
	function getCases(variables) {
	    var numVars = variables.length;
	    var values = getValues(numVars, []);
	    var numRows = values.length;
	    var rows = [];
	    var row = {};
	
	    for (var i = 0; i < numRows; ++i) {
	        row = {};
	        for (var j = 0; j < numVars; ++j) {
	            row[variables[j]] = values[i][j];
	        }
	        rows.push(row);
	    }
	
	    return rows;
	}
	
	/**
	 * Convert a statement into an object representing the structure of a table.
	 *
	 * @param   {Object} s - The statement to be converted.
	 *
	 * @returns {Object} - The table representation.
	 */
	function statementToTable(s) {
	    var table = {};
	
	    table['statement'] = s.statement;
	    table['variables'] = s.variables;
	    table['rows'] = getCases(table['variables']);
	    for (var i = 0; i < table['rows'].length; ++i) {
	        table['rows'][i]['eval'] = s.evaluate(table['rows'][i]);
	    }
	
	    return table;
	}
	
	/**
	 * Create a Markdown-formatted truth table.
	 *
	 * @param   {Object} table - The table to be converted to Markdown.
	 *
	 * @returns {String} The Markdown-formatted table.
	 */
	function tableToMarkdown(table) {
	    var rows = [];
	    var row = [];
	    var header = table['variables'].slice();
	
	    header.push(table['statement'].replace(/\|/g, '&#124;'));
	    rows.push(header);
	    for (var i = 0; i < table['rows'].length; ++i) {
	        row = [];
	        for (var j = 0; j < table['variables'].length; ++j) {
	            row.push(table['rows'][i][table['variables'][j]]);
	        }
	        row.push(table['rows'][i]['eval']);
	        rows.push(row);
	    }
	
	    return mdTable(rows, {
	        align: 'c'
	    });
	}
	
	/**
	 * Create a truth table from a given statement.
	 *
	 * @param   {String} s - The statement.
	 * @param   {String} type - The table format.
	 *
	 * @returns {String} - The formatted table.
	 */
	function makeTruthTable(s, type) {
	    var table = statementToTable(s);
	    var format = type.toLowerCase
	
	    // TODO: Add support for other formats
	    ();switch (format) {
	        case 'markdown':
	            return tableToMarkdown(table);
	        case 'json':
	            return table;
	    }
	}
	
	// module.exports.truthTable = makeTruthTable
	exports.default = makeTruthTable;
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	
	/* Expose. */
	module.exports = markdownTable;
	
	/* Expressions. */
	var EXPRESSION_DOT = /\./;
	var EXPRESSION_LAST_DOT = /\.[^.]*$/;
	
	/* Allowed alignment values. */
	var LEFT = 'l';
	var RIGHT = 'r';
	var CENTER = 'c';
	var DOT = '.';
	var NULL = '';
	
	var ALLIGNMENT = [LEFT, RIGHT, CENTER, DOT, NULL];
	var MIN_CELL_SIZE = 3;
	
	/* Characters. */
	var COLON = ':';
	var DASH = '-';
	var PIPE = '|';
	var SPACE = ' ';
	var NEW_LINE = '\n';
	
	/* Create a table from a matrix of strings. */
	function markdownTable(table, options) {
	  var settings = options || {};
	  var delimiter = settings.delimiter;
	  var start = settings.start;
	  var end = settings.end;
	  var alignment = settings.align;
	  var calculateStringLength = settings.stringLength || lengthNoop;
	  var cellCount = 0;
	  var rowIndex = -1;
	  var rowLength = table.length;
	  var sizes = [];
	  var align;
	  var rule;
	  var rows;
	  var row;
	  var cells;
	  var index;
	  var position;
	  var size;
	  var value;
	  var spacing;
	  var before;
	  var after;
	
	  alignment = alignment ? alignment.concat() : [];
	
	  if (delimiter === null || delimiter === undefined) {
	    delimiter = SPACE + PIPE + SPACE;
	  }
	
	  if (start === null || start === undefined) {
	    start = PIPE + SPACE;
	  }
	
	  if (end === null || end === undefined) {
	    end = SPACE + PIPE;
	  }
	
	  while (++rowIndex < rowLength) {
	    row = table[rowIndex];
	
	    index = -1;
	
	    if (row.length > cellCount) {
	      cellCount = row.length;
	    }
	
	    while (++index < cellCount) {
	      position = row[index] ? dotindex(row[index]) : null;
	
	      if (!sizes[index]) {
	        sizes[index] = MIN_CELL_SIZE;
	      }
	
	      if (position > sizes[index]) {
	        sizes[index] = position;
	      }
	    }
	  }
	
	  if (typeof alignment === 'string') {
	    alignment = pad(cellCount, alignment).split('');
	  }
	
	  /* Make sure only valid alignments are used. */
	  index = -1;
	
	  while (++index < cellCount) {
	    align = alignment[index];
	
	    if (typeof align === 'string') {
	      align = align.charAt(0).toLowerCase();
	    }
	
	    if (ALLIGNMENT.indexOf(align) === -1) {
	      align = NULL;
	    }
	
	    alignment[index] = align;
	  }
	
	  rowIndex = -1;
	  rows = [];
	
	  while (++rowIndex < rowLength) {
	    row = table[rowIndex];
	
	    index = -1;
	    cells = [];
	
	    while (++index < cellCount) {
	      value = row[index];
	
	      value = stringify(value);
	
	      if (alignment[index] === DOT) {
	        position = dotindex(value);
	
	        size = sizes[index] +
	          (EXPRESSION_DOT.test(value) ? 0 : 1) -
	          (calculateStringLength(value) - position);
	
	        cells[index] = value + pad(size - 1);
	      } else {
	        cells[index] = value;
	      }
	    }
	
	    rows[rowIndex] = cells;
	  }
	
	  sizes = [];
	  rowIndex = -1;
	
	  while (++rowIndex < rowLength) {
	    cells = rows[rowIndex];
	
	    index = -1;
	
	    while (++index < cellCount) {
	      value = cells[index];
	
	      if (!sizes[index]) {
	        sizes[index] = MIN_CELL_SIZE;
	      }
	
	      size = calculateStringLength(value);
	
	      if (size > sizes[index]) {
	        sizes[index] = size;
	      }
	    }
	  }
	
	  rowIndex = -1;
	
	  while (++rowIndex < rowLength) {
	    cells = rows[rowIndex];
	
	    index = -1;
	
	    if (settings.pad !== false) {
	      while (++index < cellCount) {
	        value = cells[index];
	
	        position = sizes[index] - (calculateStringLength(value) || 0);
	        spacing = pad(position);
	
	        if (alignment[index] === RIGHT || alignment[index] === DOT) {
	          value = spacing + value;
	        } else if (alignment[index] === CENTER) {
	          position /= 2;
	
	          if (position % 1 === 0) {
	            before = position;
	            after = position;
	          } else {
	            before = position + 0.5;
	            after = position - 0.5;
	          }
	
	          value = pad(before) + value + pad(after);
	        } else {
	          value += spacing;
	        }
	
	        cells[index] = value;
	      }
	    }
	
	    rows[rowIndex] = cells.join(delimiter);
	  }
	
	  if (settings.rule !== false) {
	    index = -1;
	    rule = [];
	
	    while (++index < cellCount) {
	      /* When `pad` is false, make the rule the same size as the first row. */
	      if (settings.pad === false) {
	        value = table[0][index];
	        spacing = calculateStringLength(stringify(value));
	        spacing = spacing > MIN_CELL_SIZE ? spacing : MIN_CELL_SIZE;
	      } else {
	        spacing = sizes[index];
	      }
	
	      align = alignment[index];
	
	      /* When `align` is left, don't add colons. */
	      value = align === RIGHT || align === NULL ? DASH : COLON;
	      value += pad(spacing - 2, DASH);
	      value += align !== LEFT && align !== NULL ? COLON : DASH;
	
	      rule[index] = value;
	    }
	
	    rows.splice(1, 0, rule.join(delimiter));
	  }
	
	  return start + rows.join(end + NEW_LINE + start) + end;
	}
	
	function stringify(value) {
	  return (value === null || value === undefined) ? '' : String(value);
	}
	
	/* Get the length of `value`. */
	function lengthNoop(value) {
	  return String(value).length;
	}
	
	/* Get a string consisting of `length` `character`s. */
	function pad(length, character) {
	  return Array(length + 1).join(character || SPACE);
	}
	
	/* Get the position of the last dot in `value`. */
	function dotindex(value) {
	  var match = EXPRESSION_LAST_DOT.exec(value);
	
	  return match ? match.index + 1 : value.length;
	}


/***/ })
/******/ ])
});
;
//# sourceMappingURL=Tombstone.js.map