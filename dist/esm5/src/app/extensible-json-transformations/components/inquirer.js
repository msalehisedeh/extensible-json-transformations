/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function Template() { }
/** @type {?} */
Template.prototype.name;
/** @type {?|undefined} */
Template.prototype.match;
/** @type {?|undefined} */
Template.prototype.value;
/** @type {?} */
Template.prototype.context;
/** @type {?|undefined} */
Template.prototype.inPool;
/** @type {?} */
Template.prototype.style;
/**
 * @record
 */
export function QueryOperation() { }
/** @type {?} */
QueryOperation.prototype.name;
/** @type {?|undefined} */
QueryOperation.prototype.args;
var JXPath = /** @class */ (function () {
    function JXPath(jpath) {
        this.path = jpath.split(".");
    }
    /**
     * @return {?}
     */
    JXPath.prototype.fromLast = /**
     * @return {?}
     */
    function () {
        return new JXPath(this.path[this.path.length - 1]);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    JXPath.prototype.nodeOf = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return this._nodeOf(node, this.path);
    };
    /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    JXPath.prototype._nodeOf = /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    function (node, path) {
        /** @type {?} */
        var pItem = node;
        for (var i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                /** @type {?} */
                var list = [];
                for (var q = 0; q < this.path.length; q++) {
                    /** @type {?} */
                    var item = pItem[q];
                    /** @type {?} */
                    var x = this._nodeOf(item[path[i]], path.slice(i + 1, path.length));
                    if (x && x !== null) {
                        list.push(x);
                    }
                }
                ;
                if (list.length) {
                    pItem = list;
                }
                break;
            }
            else {
                pItem = pItem ? pItem[path[i]] : pItem;
            }
        }
        return pItem;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    JXPath.prototype.valueOf = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return this._valueOf(node, this.path);
    };
    /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    JXPath.prototype._valueOf = /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    function (node, path) {
        /** @type {?} */
        var pItem = node;
        for (var i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                /** @type {?} */
                var list = [];
                for (var q = 0; q < this.path.length; q++) {
                    /** @type {?} */
                    var item = pItem[q];
                    list.push(this._valueOf(item[path[i]], path.slice(i + 1, path.length)));
                }
                pItem = list;
                break;
            }
            else if (path.length) {
                pItem = pItem ? pItem[path[i]] : pItem;
            }
            else {
                pItem = pItem;
            }
        }
        return pItem;
    };
    return JXPath;
}());
export { JXPath };
if (false) {
    /** @type {?} */
    JXPath.prototype.path;
}
var Inquirer = /** @class */ (function () {
    function Inquirer() {
        this.supportedMethods = {};
        this.templates = {};
        this.globalPool = {};
        this.pathPool = {};
        this.addSupportingMethod("valueOf", this.valueOf);
        this.addSupportingMethod("each", this.each);
        this.addSupportingMethod("split", this.split);
        this.addSupportingMethod("concat", this.concatenate);
        this.addSupportingMethod("enlist", this.enlist);
        this.addSupportingMethod("join", this.join);
        this.addSupportingMethod("filter", this.filter);
        this.addSupportingMethod("select", this.select);
        this.addSupportingMethod("style", this.style);
        this.addSupportingMethod("match", this.match);
        this.addSupportingMethod("apply", this.apply);
        this.addSupportingMethod("filter", this.filter);
        this.addSupportingMethod("select", this.select);
        this.addSupportingMethod("offPool", this.offPool);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    Inquirer.prototype.jXPathFor = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var p = this.pathPool[path];
        if (!p) {
            p = new JXPath(path);
            this.pathPool[path] = p;
        }
        return p;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    Inquirer.prototype.setRootNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        this.rootNode = this.nodeList(node);
        this.initPools(this.templates);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    Inquirer.prototype.setContextNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        this.contextNode = node;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    Inquirer.prototype.templateForName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this.templates[name];
    };
    // if node is null, root node will be used.
    /**
     * @param {?} node
     * @return {?}
     */
    Inquirer.prototype.nodeList = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var item = node === null ? this.rootNode : node;
        /** @type {?} */
        var list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            /** @type {?} */
            var x = Object.keys(item);
            list = [];
            for (var t = 0; t < x.length; t++) {
                /** @type {?} */
                var xItem = x[t];
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                }
                else {
                    list.push(item[xItem]);
                }
            }
        }
        return list;
    };
    // performs query of nested function calls on the given node.
    /**
     * @param {?} command
     * @param {?} node
     * @return {?}
     */
    Inquirer.prototype.query = /**
     * @param {?} command
     * @param {?} node
     * @return {?}
     */
    function (command, node) {
        /** @type {?} */
        var mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            /** @type {?} */
            var list = [];
            for (var q = 0; q < node.length; q++) {
                /** @type {?} */
                var nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem));
            }
            ;
            return list;
        }
        return this.invoke(mothods, node);
    };
    // performs query with given list of query opertations
    /**
     * @param {?} operation
     * @param {?} node
     * @return {?}
     */
    Inquirer.prototype.invoke = /**
     * @param {?} operation
     * @param {?} node
     * @return {?}
     */
    function (operation, node) {
        /** @type {?} */
        var list = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        }
        else if (typeof operation === 'object') {
            /** @type {?} */
            var f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (var a = 0; a < operation.args.length; a++) {
                        /** @type {?} */
                        var arg = operation.args[a];
                        if (arg.name) {
                            list.push(this.invoke(arg, node));
                        }
                        else {
                            list.push(arg);
                        }
                    }
                }
                else {
                    list.push(operation.args);
                }
                /** @type {?} */
                var oldContext = this.contextNode;
                this.contextNode = node;
                list = f.apply(this, list);
                this.contextNode = oldContext;
            }
            else {
                list = operation.name;
            }
        }
        else {
            list = operation;
        }
        return list;
    };
    // concatenate(a, b, c): joins arguments into a string
    // join args[0,1,2]
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.concatenate = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var left = args[0];
        /** @type {?} */
        var delim = args[1];
        /** @type {?} */
        var right = args[2];
        /** @type {?} */
        var result = [];
        if (left instanceof Array) {
            if (right instanceof Array) {
                if (left.length > right.length) {
                    for (var q = 0; q < left.length; q++) {
                        result.push(left[q] + delim + (right.length > q ? right[q] : ""));
                    }
                    ;
                }
                else {
                    for (var q = 0; q < right.length; q++) {
                        result.push((left.length > q ? left[q] : "") + delim + right[q]);
                    }
                    ;
                }
            }
            else {
                for (var q = 0; q < left.length; q++) {
                    result.push(left[q] + delim + right);
                }
                ;
            }
        }
        else {
            if (right instanceof Array) {
                for (var q = 0; q < right.length; q++) {
                    result.push(left + delim + right[q]);
                }
                ;
            }
            else {
                result.push(left + delim + right);
            }
        }
        return result.length > 1 ? result : result[0];
    };
    // split(item,','): splits value into a list
    // split args[0] with args[1]
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.split = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0] ? args[0].split(args[1]) : [];
    };
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.valueOf = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    };
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1]
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.each = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var list = [];
        /** @type {?} */
        var method = { name: "valueOf", args: args[1] };
        for (var q = 0; q < args[0].length; q++) {
            /** @type {?} */
            var node = args[0][q];
            list.push(this.invoke(method, node));
        }
        ;
        return list;
    };
    // enlist(...): insert argument values into a list
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.enlist = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var list = [];
        args.map(function (item) {
            list.push(item); // make sure last two item are not node and template
        });
        return list;
    };
    // join(array,','): joins items of the list into a string
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.join = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0].length > 1 ? args[0].join(args[1]) : args[0];
    };
    // apply(template,path,array): apply the template in root context for each value 
    // that matches the given path. args[0] name to apply
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.apply = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var path = this.jXPathFor(args[1]);
        /** @type {?} */
        var path2 = path.fromLast();
        /** @type {?} */
        var values = args[2];
        /** @type {?} */
        var list = [];
        for (var c = 0; c < this.rootNode.length; c++) {
            /** @type {?} */
            var node = this.rootNode[c];
            /** @type {?} */
            var value = path.nodeOf(node);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
                    /** @type {?} */
                    var v = value[d];
                    /** @type {?} */
                    var x = path2.valueOf(v);
                    if (this.evaluateOperation(x, "=", values)) {
                        list.push(v);
                    }
                }
            }
            else {
                /** @type {?} */
                var x = path2.valueOf(node);
                if (this.evaluateOperation(x, "=", values)) {
                    list.push(node);
                }
            }
        }
        ;
        if (list.length) {
            list = this.style(args[0], list);
        }
        return list;
    };
    // match(template,path,operation,values): , node args[4]
    // for value of target in given template nodes, evaluate operation for given value(s). 
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.match = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        /** @type {?} */
        var path = this.jXPathFor(args[1]);
        /** @type {?} */
        var path2 = path.fromLast();
        /** @type {?} */
        var operation = args[2];
        /** @type {?} */
        var values = args[3];
        /** @type {?} */
        var nodes = this.templateNodes(template, this.contextNode);
        /** @type {?} */
        var list = [];
        if (nodes instanceof Array) {
            for (var c = 0; c < nodes.length; c++) {
                /** @type {?} */
                var node = nodes[c];
                /** @type {?} */
                var value = path.nodeOf(node);
                if (value instanceof Array) {
                    for (var d = 0; d < value.length; d++) {
                        /** @type {?} */
                        var v = value[d];
                        /** @type {?} */
                        var x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    }
                }
                else {
                    /** @type {?} */
                    var x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            }
            ;
        }
        else {
            /** @type {?} */
            var value = path.nodeOf(nodes);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
                    /** @type {?} */
                    var v = value[d];
                    /** @type {?} */
                    var x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                }
            }
            else {
                /** @type {?} */
                var x = path2.valueOf(nodes);
                if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        }
        return list;
    };
    // filter(path,operation,value): for value of target in current context, 
    // evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in.
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.filter = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var path = this.jXPathFor(args[0]);
        /** @type {?} */
        var operation = args[1];
        /** @type {?} */
        var values = args[2];
        /** @type {?} */
        var list = [];
        for (var a = 0; a < this.contextNode.length; a++) {
            /** @type {?} */
            var node = this.contextNode[a];
            /** @type {?} */
            var value = path.valueOf(node);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
                    /** @type {?} */
                    var v = value[d];
                    if (this.evaluateOperation(v, operation, values)) {
                        list.push(node);
                    }
                }
            }
            else {
                if (this.evaluateOperation(value, operation, values)) {
                    list.push(node);
                }
            }
        }
        return list;
    };
    // select(path): select the nodes with given path in current context
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.select = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var path = this.jXPathFor(args[0]);
        /** @type {?} */
        var list = [];
        if (this.contextNode instanceof Array) {
            for (var d = 0; d < this.contextNode.length; d++) {
                /** @type {?} */
                var node = this.contextNode[d];
                /** @type {?} */
                var value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            }
        }
        else {
            /** @type {?} */
            var value = path.nodeOf(this.contextNode);
            if (value && value.length) {
                if (value instanceof Array) {
                    list = value;
                }
                else {
                    list.push(value);
                }
            }
        }
        return list;
    };
    // style(template, array): apply the given template for the given array
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.style = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        /** @type {?} */
        var result = [];
        /** @type {?} */
        var attrs = Object.keys(template.style);
        if (args[1] instanceof Array) {
            for (var a = 0; a < args[1].length; a++) {
                /** @type {?} */
                var item = args[1][a];
                /** @type {?} */
                var node = {};
                for (var d = 0; d < attrs.length; d++) {
                    /** @type {?} */
                    var attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        }
        else {
            /** @type {?} */
            var node = {};
            for (var d = 0; d < attrs.length; d++) {
                /** @type {?} */
                var attr = attrs[d];
                node[attr] = this.invoke(template.style[attr], args[1]);
            }
            result.push(node);
        }
        return result;
    };
    /**
     * @param {?} name
     * @param {?} method
     * @return {?}
     */
    Inquirer.prototype.addSupportingMethod = /**
     * @param {?} name
     * @param {?} method
     * @return {?}
     */
    function (name, method) {
        this.supportedMethods[name] = method;
    };
    /**
     * @param {?} str
     * @return {?}
     */
    Inquirer.prototype.removeQuotes = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    };
    /**
     * @param {?} methods
     * @return {?}
     */
    Inquirer.prototype.toQueryOperation = /**
     * @param {?} methods
     * @return {?}
     */
    function (methods) {
        /** @type {?} */
        var operations = methods.replace(/([^']+)|('[^']+')/g, function ($0, $1, $2) {
            if ($1) {
                return $1.replace(/\s/g, '');
            }
            else {
                return $2;
            }
        }).replace(/'[^']+'/g, function (match) {
            return match.replace(/,/g, '~');
        });
        return this.toFunctions(operations);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Inquirer.prototype.toFunctions = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var i = -1;
        /** @type {?} */
        var j = -1;
        /** @type {?} */
        var k = -1;
        /** @type {?} */
        var c = 0;
        /** @type {?} */
        var json = {};
        for (var cindex = 0; cindex < item.length; cindex++) {
            if (item[cindex] === '(') {
                if (c === 0) {
                    i = cindex;
                }
                c++;
            }
            else if (item[cindex] === ')') {
                c--;
                if (c === 0) {
                    /** @type {?} */
                    var isArry = (json instanceof Array);
                    j = cindex;
                    if (!isArry && (j === (item.length - 1))) {
                        json["name"] = item.substring(0, i);
                        json["args"] = this.toFunctions(item.substring(i + 1, j));
                    }
                    else {
                        if (!isArry) {
                            json = [];
                        }
                        json.push({
                            name: item.substring(k + 1, i),
                            args: this.toFunctions(item.substring(i + 1, j))
                        });
                    }
                }
            }
            else if (item[cindex] === ',') {
                if (c === 0 && (cindex - 1 !== k)) {
                    /** @type {?} */
                    var isArry = (json instanceof Array);
                    if (k < 0) {
                        if (i < 0) {
                            if (!isArry) {
                                json = [];
                            }
                            json.push({
                                name: this.removeQuotes(item.substring(k + 1, cindex).replace(/~/g, ',')),
                                args: []
                            });
                        }
                        k = cindex;
                    }
                    else {
                        /** @type {?} */
                        var x = this.removeQuotes(item.substring(k + 1, cindex).replace(/~/g, ','));
                        if (x.indexOf('(') < 0) {
                            if (json instanceof Array) {
                                json.push(x);
                            }
                            else {
                                json.args.push(x);
                            }
                        }
                        k = cindex;
                    }
                }
                else if (c === 0 && (cindex - 1 === k)) {
                    k = cindex;
                }
            }
        }
        if (i >= 0 && j < 0) {
            throw {
                message: "incorrect method call declaration. Missing ')'",
                stack: new Error().stack
            };
        }
        else if (i < 0 && j > 0) {
            throw {
                message: "incorrect method call declaration. Missing '('",
                stack: new Error().stack
            };
        }
        else if (i < 0 && j < 0 && k < 0) {
            return item;
        }
        else if (c === 0 && k > j) {
            if (json instanceof Array) {
                json.push(this.removeQuotes(item.substring(k + 1, item.length).replace(/~/g, ',')));
            }
            else {
                json.args.push(this.removeQuotes(item.substring(k + 1, item.length).replace(/~/g, ',')));
            }
        }
        return json;
    };
    /**
     * @param {?} template
     * @param {?} nodes
     * @return {?}
     */
    Inquirer.prototype.templateNodes = /**
     * @param {?} template
     * @param {?} nodes
     * @return {?}
     */
    function (template, nodes) {
        /** @type {?} */
        var list = [];
        /** @type {?} */
        var nodeList = nodes;
        if (template.context === "root") {
            if (!this.rootNode) {
                throw {
                    message: "Unable to find root node to perform operation.",
                    stack: new Error().stack
                };
            }
            nodeList = this.nodeList(this.rootNode);
        }
        if (template.match && template.match.length) {
            /** @type {?} */
            var path = this.jXPathFor(template.match);
            for (var z = 0; z < nodeList.length; z++) {
                /** @type {?} */
                var node = nodeList[z];
                if (path.valueOf(node) === template.value) {
                    list.push(node);
                }
            }
        }
        else if (nodes) {
            list = nodeList;
        }
        return list;
    };
    /**
     * @param {?} left
     * @param {?} operation
     * @param {?} right
     * @return {?}
     */
    Inquirer.prototype.evaluateOperation = /**
     * @param {?} left
     * @param {?} operation
     * @param {?} right
     * @return {?}
     */
    function (left, operation, right) {
        /** @type {?} */
        var result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                for (var i = 0; i < right.length; i++) {
                    if (left == right[i]) {
                        result = true;
                        break;
                    }
                }
            }
            else if (operation === "in") {
                for (var i = 0; i < right.length; i++) {
                    if (right[i].indexOf(left) >= 0) {
                        result = true;
                        break;
                    }
                }
                ;
            }
            else if (operation === "!") {
                /** @type {?} */
                var f = false;
                for (var i = 0; i < right.length; i++) {
                    if (left == right[i]) {
                        f = true;
                        break;
                    }
                }
                ;
                result = !f;
            }
        }
        else {
            if (operation === "=") {
                result = (left == right);
            }
            else if (operation === "in") {
                result = (right.indexOf(left) >= 0);
            }
            else if (operation === "!") {
                result = (left !== right);
            }
            else if (operation === ">") {
                result = (parseFloat(left) > parseFloat(right));
            }
            else if (operation === "<") {
                result = (parseFloat(left) < parseFloat(right));
            }
        }
        return result;
    };
    /**
     * @param {...?} args
     * @return {?}
     */
    Inquirer.prototype.offPool = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** @type {?} */
        var list = [];
        /** @type {?} */
        var pool = this.globalPool[args[0]];
        /** @type {?} */
        var keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array) {
            for (var z = 0; z < keys.length; z++) {
                /** @type {?} */
                var key = keys[z];
                /** @type {?} */
                var node = pool[key];
                if (node) {
                    list.push(node);
                }
                else {
                    // should we throw here?
                }
            }
        }
        else {
            /** @type {?} */
            var node = pool[keys];
            if (node) {
                list.push(node);
            }
        }
        return list;
    };
    /**
     * @param {?} list
     * @return {?}
     */
    Inquirer.prototype.initTemplates = /**
     * @param {?} list
     * @return {?}
     */
    function (list) {
        this.templates = {};
        for (var i = 0; i < list.length; i++) {
            /** @type {?} */
            var template = list[i];
            /** @type {?} */
            var styles = Object.keys(template.style);
            for (var j = 0; j < styles.length; j++) {
                /** @type {?} */
                var key = styles[j];
                /** @type {?} */
                var method = template.style[key];
                if (typeof method === "string") {
                    template.style[key] = this.toQueryOperation(method);
                }
            }
            this.templates[template.name] = template;
        }
    };
    /**
     * @param {?} templates
     * @return {?}
     */
    Inquirer.prototype.initPools = /**
     * @param {?} templates
     * @return {?}
     */
    function (templates) {
        /** @type {?} */
        var list = Object.keys(templates);
        if (list.length === 0) {
            throw {
                message: "Missing Template definitions.",
                stack: new Error().stack
            };
        }
        if (!this.rootNode) {
            throw {
                message: "Unable to find root node to perform operation.",
                stack: new Error().stack
            };
        }
        this.globalPool = {};
        for (var i = 0; i < list.length; i++) {
            /** @type {?} */
            var template = list[i];
            /** @type {?} */
            var t = this.templateForName(template);
            if (t.inPool) {
                /** @type {?} */
                var pool = {};
                /** @type {?} */
                var path = this.jXPathFor(t.inPool);
                /** @type {?} */
                var match = t.match;
                /** @type {?} */
                var nodes = this.rootNode;
                if (match && t.value) {
                    /** @type {?} */
                    var mpath = this.jXPathFor(match);
                    for (var k = 0; k < nodes.length; k++) {
                        /** @type {?} */
                        var v = mpath.valueOf(nodes[k]);
                        if (v === t.value) {
                            pool[path.valueOf(nodes[k])] = nodes[k];
                        }
                    }
                }
                else {
                    for (var k = 0; k < nodes.length; k++) {
                        pool[path.valueOf(nodes[k])] = nodes[k];
                    }
                }
                this.globalPool[t.name] = pool;
            }
        }
    };
    return Inquirer;
}());
export { Inquirer };
if (false) {
    /** @type {?} */
    Inquirer.prototype.supportedMethods;
    /** @type {?} */
    Inquirer.prototype.templates;
    /** @type {?} */
    Inquirer.prototype.rootNode;
    /** @type {?} */
    Inquirer.prototype.contextNode;
    /** @type {?} */
    Inquirer.prototype.globalPool;
    /** @type {?} */
    Inquirer.prototype.pathPool;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsSUFBQTtJQUVJLGdCQUFZLEtBQUs7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7Ozs7SUFDRCx5QkFBUTs7O0lBQVI7UUFDSSxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3REOzs7OztJQUNELHVCQUFNOzs7O0lBQU4sVUFBTyxJQUFJO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7Ozs7O0lBQ08sd0JBQU87Ozs7O2NBQUMsSUFBSSxFQUFFLElBQWM7O1FBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7O2dCQUN6QixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUs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QUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckQ7Ozs7O0lBRU8sNEJBQVM7Ozs7Y0FBQyxJQUFZOztRQUMxQixJQUFJLENBQUMsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzNDO2lCQUNKO2dCQUNELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNsQztTQUNKO0tBQ0o7bUJBeHJCTDtJQXlyQkMsQ0FBQTtBQTVtQkQsb0JBNG1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEludGVudGlvbmFsbHkgYXZvaWRpbmcgdXNlIG9mIG1hcCBjYWxsIG9uIGxpc3QgdG8gcmVkdWNlIHRoZSBjYWxsIHN0YWNrIG51bWJlcnMuXHJcbiAqIE9uIGxhcmdlIHNjYWxlIEpTT04sIGNhbGwgc3RhY2sgYmVjb21lcyBhIHByb2JsZW0gdG8gYmUgYXZvaWRlZC5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBtYXRjaD86IHN0cmluZyxcclxuICAgIHZhbHVlPzogc3RyaW5nLFxyXG4gICAgY29udGV4dDogc3RyaW5nLFxyXG4gICAgaW5Qb29sPzogc3RyaW5nLFxyXG4gICAgc3R5bGU6IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3BlcmF0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBRdWVyeU9wZXJhdGlvbltdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKWFBhdGgge1xyXG4gICAgcHJpdmF0ZSBwYXRoO1xyXG4gICAgY29uc3RydWN0b3IoanBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGpwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIH1cclxuICAgIGZyb21MYXN0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSlhQYXRoKHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gICAgbm9kZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9ub2RlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fbm9kZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgeCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG4gICAgdmFsdWVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3ZhbHVlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fdmFsdWVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucXVpcmVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRNZXRob2RzID0ge307XHJcbiAgICBwcml2YXRlIHRlbXBsYXRlcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSByb290Tm9kZTtcclxuICAgIHByaXZhdGUgY29udGV4dE5vZGU7IC8vIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBjYWxsIGlzIG1hZGUuLi4gdGhpcyBpcyB0byBhdm9pZCBjYWxsIHN0YWNrIG92ZXJmbG93IGluIGV4dHJlbWVsdCBsYXJnZSBKU09OXHJcbiAgICBwcml2YXRlIGdsb2JhbFBvb2wgPSB7fTtcclxuICAgIHByaXZhdGUgcGF0aFBvb2wgPSB7fTsvLyB0byBhdm9pZCBzdGFja292ZXJmbG93Li4uIGFuZCBwZXJmb3JtIGZhc3RlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInZhbHVlT2ZcIiwgdGhpcy52YWx1ZU9mKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlYWNoXCIsIHRoaXMuZWFjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3BsaXRcIiwgdGhpcy5zcGxpdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiY29uY2F0XCIsIHRoaXMuY29uY2F0ZW5hdGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVubGlzdFwiLCB0aGlzLmVubGlzdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiam9pblwiLCB0aGlzLmpvaW4pO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzdHlsZVwiLCB0aGlzLnN0eWxlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJtYXRjaFwiLCB0aGlzLm1hdGNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJhcHBseVwiLCB0aGlzLmFwcGx5KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwib2ZmUG9vbFwiLCB0aGlzLm9mZlBvb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgalhQYXRoRm9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBwOkpYUGF0aCA9IHRoaXMucGF0aFBvb2xbcGF0aF07XHJcbiAgICAgICAgaWYgKCFwKSB7XHJcbiAgICAgICAgICAgIHAgPSBuZXcgSlhQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGhQb29sW3BhdGhdID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3ROb2RlID0gdGhpcy5ub2RlTGlzdChub2RlKTtcclxuICAgICAgICB0aGlzLmluaXRQb29scyh0aGlzLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZXh0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICB0ZW1wbGF0ZUZvck5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIC8vIGlmIG5vZGUgaXMgbnVsbCwgcm9vdCBub2RlIHdpbGwgYmUgdXNlZC5cclxuICAgIG5vZGVMaXN0KG5vZGUpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbm9kZSA9PT0gbnVsbCA/IHRoaXMucm9vdE5vZGUgOiBub2RlO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBpdGVtO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCB4Lmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4SXRlbSA9IHhbdF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVt4SXRlbV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSBvZiBuZXN0ZWQgZnVuY3Rpb24gY2FsbHMgb24gdGhlIGdpdmVuIG5vZGUuXHJcbiAgICBxdWVyeShjb21tYW5kOnN0cmluZywgbm9kZSkge1xyXG4gICAgICAgIGNvbnN0IG1vdGhvZHMgPXRoaXMudG9RdWVyeU9wZXJhdGlvbihjb21tYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IG5vZGUubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJdGVtID0gbm9kZVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLmludm9rZShtb3Rob2RzLCBub2RlSXRlbSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2UobW90aG9kcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgd2l0aCBnaXZlbiBsaXN0IG9mIHF1ZXJ5IG9wZXJ0YXRpb25zXHJcbiAgICBpbnZva2Uob3BlcmF0aW9uOlF1ZXJ5T3BlcmF0aW9uLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6YW55ID0gW107XHJcbiAgICAgICAgaWYgKCh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgbm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tvcGVyYXRpb24ubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgb3BlcmF0aW9uLmFyZ3MubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gb3BlcmF0aW9uLmFyZ3NbYV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UoYXJnLCBub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9wZXJhdGlvbi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gZi5hcHBseSh0aGlzLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBvbGRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uY2F0ZW5hdGUoYSwgYiwgYyk6IGpvaW5zIGFyZ3VtZW50cyBpbnRvIGEgc3RyaW5nXHJcbiAgICAvLyBqb2luIGFyZ3NbMCwxLDJdXHJcbiAgICBjb25jYXRlbmF0ZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGFyZ3NbMF07XHJcbiAgICAgICAgY29uc3QgZGVsaW09IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgcmlnaHQ9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA+IHJpZ2h0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgKHJpZ2h0Lmxlbmd0aCA+IHEgPyByaWdodFtxXSA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCAobGVmdC5sZW5ndGggPiBxID8gbGVmdFtxXSA6IFwiXCIpICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdCArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxlZnQgKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDEgPyByZXN1bHQgOiByZXN1bHRbMF07XHJcbiAgICB9XHJcbiAgICAvLyBzcGxpdChpdGVtLCcsJyk6IHNwbGl0cyB2YWx1ZSBpbnRvIGEgbGlzdFxyXG4gICAgLy8gc3BsaXQgYXJnc1swXSB3aXRoIGFyZ3NbMV1cclxuICAgIHNwbGl0KC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXSA/IGFyZ3NbMF0uc3BsaXQoYXJnc1sxXSkgOiBbXTtcclxuICAgIH1cclxuICAgIC8vIHZhbHVlT2YocGF0aCk6ICBldmFsdWF0ZXMgdmFsdWUgb2YgYXJndW1lbnQgcGF0aFxyXG4gICAgLy8gcGF0aCA9IGFyZ3NbMF0sIG5vZGUgdG8gZXZhbHVhdGUgPSBhcmdzWzFdXHJcbiAgICB2YWx1ZU9mKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIHJldHVybiBqcGF0aC52YWx1ZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLy8gZWFjaChsaXN0LG1ldGhvZCk6IEZvciBlYWNoIGl0ZW0gaW4gbGlzdCwgaW52b2RlIHRoZSBjYWxsYmFjayBtZXRob2RcclxuICAgIC8vIGVhY2ggaXRlbSBvZiBhcmdzWzBdIGV4ZWN1dGUgZnVuY3Rpb24gb2YgYXJnc1sxXVxyXG4gICAgZWFjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHtuYW1lOiBcInZhbHVlT2ZcIiwgYXJnczogYXJnc1sxXX07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBhcmdzWzBdLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBhcmdzWzBdW3FdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UobWV0aG9kLCBub2RlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGVubGlzdCguLi4pOiBpbnNlcnQgYXJndW1lbnQgdmFsdWVzIGludG8gYSBsaXN0XHJcbiAgICBlbmxpc3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBhcmdzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pOyAvLyBtYWtlIHN1cmUgbGFzdCB0d28gaXRlbSBhcmUgbm90IG5vZGUgYW5kIHRlbXBsYXRlXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGpvaW4oYXJyYXksJywnKTogam9pbnMgaXRlbXMgb2YgdGhlIGxpc3QgaW50byBhIHN0cmluZ1xyXG4gICAgam9pbiguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0ubGVuZ3RoID4gMSA/IGFyZ3NbMF0uam9pbihhcmdzWzFdKSA6IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICAvLyBhcHBseSh0ZW1wbGF0ZSxwYXRoLGFycmF5KTogYXBwbHkgdGhlIHRlbXBsYXRlIGluIHJvb3QgY29udGV4dCBmb3IgZWFjaCB2YWx1ZSBcclxuICAgIC8vIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aC4gYXJnc1swXSBuYW1lIHRvIGFwcGx5XHJcbiAgICBhcHBseSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMucm9vdE5vZGUubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucm9vdE5vZGVbY107XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLnN0eWxlKGFyZ3NbMF0sIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIG1hdGNoKHRlbXBsYXRlLHBhdGgsb3BlcmF0aW9uLHZhbHVlcyk6ICwgbm9kZSBhcmdzWzRdXHJcbiAgICAvLyBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGdpdmVuIHRlbXBsYXRlIG5vZGVzLCBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBcclxuICAgIG1hdGNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1szXTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5jb250ZXh0Tm9kZSlcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBub2Rlcy5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2NdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIocGF0aCxvcGVyYXRpb24sdmFsdWUpOiBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGN1cnJlbnQgY29udGV4dCwgXHJcbiAgICAvLyBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZCBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgZmlsdGVyKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbYV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odmFsdWUsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0KHBhdGgpOiBzZWxlY3QgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gcGF0aCBpbiBjdXJyZW50IGNvbnRleHRcclxuICAgIHNlbGVjdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2RdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHN0eWxlKHRlbXBsYXRlLCBhcnJheSk6IGFwcGx5IHRoZSBnaXZlbiB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGFycmF5XHJcbiAgICBzdHlsZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoYXJnc1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYXJnc1sxXS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMV1bYV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGFkZFN1cHBvcnRpbmdNZXRob2QobmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRNZXRob2RzW25hbWVdID0gbWV0aG9kO1xyXG4gICAgfVxyXG4gICAgIHByaXZhdGUgcmVtb3ZlUXVvdGVzKHN0cikge1xyXG4gICAgICAgIHJldHVybiAoc3RyLmxlbmd0aCAmJiBzdHJbMF0gPT09ICdcXCcnICYmIHN0cltzdHIubGVuZ3RoLTFdID09PSAnXFwnJykgPyBzdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aC0xKSA6IHN0cjtcclxuICAgIH1cclxuICAgIHRvUXVlcnlPcGVyYXRpb24obWV0aG9kcykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBtZXRob2RzLnJlcGxhY2UoLyhbXiddKyl8KCdbXiddKycpL2csIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcclxuICAgICAgICAgICAgaWYgKCQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMjsgXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSkucmVwbGFjZSgvJ1teJ10rJy9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UoLywvZywgJ34nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0Z1bmN0aW9ucyhvcGVyYXRpb25zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9GdW5jdGlvbnMoaXRlbSl7XHJcbiAgICAgICAgLy8gaWYgaXRlbSA9IGpvaW4oZW5saXN0KHZhbHVlT2YoYWRkcmVzcy5zdHJlZXQpLHZhbHVlT2YoYWRkcmVzcy5jaXR5KSx2YWx1ZU9mKGFkZHJlc3MuemlwY29kZSkpLCcsJylcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBqID0gLTE7XHJcbiAgICAgICAgbGV0IGsgPSAtMTtcclxuICAgICAgICBsZXQgYyA9IDA7XHJcbiAgICAgICAgbGV0IGpzb246IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGNpbmRleCA9IDA7IGNpbmRleCA8IGl0ZW0ubGVuZ3RoOyBjaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtjaW5kZXhdID09PSAnKCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcpJykge1xyXG4gICAgICAgICAgICAgICAgYy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5ICYmIChqID09PSAoaXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcIm5hbWVcIl0gPSBpdGVtLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcImFyZ3NcIl0gPSB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uc3Vic3RyaW5nKGsrMSwgaSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwICYmIChjaW5kZXgtMSAhPT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaW5kZXhPZignKCcpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xID09PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKSdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaTwwICYmIGo+MCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKCdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNlIGlmIChpIDwgMCAmJiBqIDwgMCAmJiBrIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9ZWxzZSBpZiAoYyA9PT0gMCAmJiBrID4gaikge1xyXG4gICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlOlRlbXBsYXRlLCBub2Rlcykge1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IG5vZGVMaXN0ID0gbm9kZXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZXh0ID09PSBcInJvb3RcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlTGlzdCA9IHRoaXMubm9kZUxpc3QodGhpcy5yb290Tm9kZSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUubWF0Y2ggJiYgdGVtcGxhdGUubWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0ZW1wbGF0ZS5tYXRjaCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IG5vZGVMaXN0Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZUxpc3Rbel07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC52YWx1ZU9mKG5vZGUpID09PSB0ZW1wbGF0ZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZFxyXG4gICAgLy8gZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVPcGVyYXRpb24obGVmdCwgb3BlcmF0aW9uLCByaWdodCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodFtpXS5pbmRleE9mKGxlZnQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gIWY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ID09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJpZ2h0LmluZGV4T2YobGVmdCkgPj0gMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgIT09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA+IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA8IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9mZlBvb2wodGVtcGxhdGUsa2V5KTogV2lsbCB1c2UgdGhlIGdpdmVuIHRlbXBsYXRlIHBvb2wgdG8gcGljayB1cCBpdGVtKHMpIHdpdGggZ2l2ZW4ga2V5KHMpXHJcbiAgICBwcml2YXRlIG9mZlBvb2woLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5nbG9iYWxQb29sW2FyZ3NbMF1dO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBhcmdzWzFdO1xyXG4gICAgICAgIGlmICghcG9vbCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIHBvb2wgJ1wiICsgYXJnc1swXSArIFwiJyB0aGF0IGlzIG5vdCBjcmVhdGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB6PTA7IHogPCBrZXlzLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW3pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdGhyb3cgaGVyZT9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleXNdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICBcclxuICAgIGluaXRUZW1wbGF0ZXMobGlzdCkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBhbnk9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gc3R5bGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGVtcGxhdGUuc3R5bGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuc3R5bGVba2V5XSA9IHRoaXMudG9RdWVyeU9wZXJhdGlvbihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlLm5hbWVdID0gdGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFBvb2xzKHRlbXBsYXRlcykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZXMpO1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbnMuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbFBvb2wgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBzdHJpbmcgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICBpZiAodC5pblBvb2wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2wgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0LmluUG9vbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaD0gdC5tYXRjaDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzPSB0aGlzLnJvb3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtcGF0aCA9IHRoaXMualhQYXRoRm9yKG1hdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBtcGF0aC52YWx1ZU9mKG5vZGVzW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxQb29sW3QubmFtZV0gPSBwb29sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==