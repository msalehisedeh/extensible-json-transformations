import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
                }
                else {
                    for (var q = 0; q < right.length; q++) {
                        result.push((left.length > q ? left[q] : "") + delim + right[q]);
                    }
                }
            }
            else {
                for (var q = 0; q < left.length; q++) {
                    result.push(left[q] + delim + right);
                }
            }
        }
        else {
            if (right instanceof Array) {
                for (var q = 0; q < right.length; q++) {
                    result.push(left + delim + right[q]);
                }
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Styler = /** @class */ (function () {
    function Styler(transformations) {
        this.inquirer = new Inquirer();
        this.transformations = transformations;
        this.inquirer.initTemplates(this.transformations.templates);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    Styler.prototype.changeRootNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        this.inquirer.setRootNode(node);
    };
    /**
     * @return {?}
     */
    Styler.prototype.transform = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = [];
        /** @type {?} */
        var template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            /** @type {?} */
            var attrs = Object.keys(template.style);
            /** @type {?} */
            var nodeList = this.inquirer.templateNodes(template, this.inquirer.nodeList(null));
            for (var i = 0; i < nodeList.length; i++) {
                /** @type {?} */
                var currentNode = nodeList[i];
                /** @type {?} */
                var resultingNode = {};
                for (var j = 0; j < attrs.length; j++) {
                    /** @type {?} */
                    var attr = attrs[j];
                    resultingNode[attr] = this.inquirer.invoke(template.style[attr], currentNode);
                }
                result.push(resultingNode);
            }
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            /** @type {?} */
            var functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    };
    return Styler;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var XjsltComponent = /** @class */ (function () {
    function XjsltComponent() {
        this.node = {};
        this.ontransformation = new EventEmitter();
        this.onerror = new EventEmitter();
    }
    /**
     * @return {?}
     */
    XjsltComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.node && this.transformations) {
            if (!this.styler) {
                this.styler = new Styler(this.transformations);
            }
            this.styler.changeRootNode(this.node);
            try {
                this.ontransformation.emit(this.styler.transform());
            }
            catch (e) {
                console.log(e);
                this.onerror.emit(e);
            }
        }
    };
    /**
     * @param {?} chages
     * @return {?}
     */
    XjsltComponent.prototype.ngOnChanges = /**
     * @param {?} chages
     * @return {?}
     */
    function (chages) {
        if (chages.transformations) {
            this.styler = undefined;
            setTimeout(this.ngOnInit.bind(this), 333);
        }
        else if (chages.node) {
            setTimeout(this.ngOnInit.bind(this), 333);
        }
    };
    XjsltComponent.decorators = [
        { type: Component, args: [{
                    selector: 'xjslt',
                    template: ""
                }] }
    ];
    XjsltComponent.propDecorators = {
        node: [{ type: Input, args: ["node",] }],
        transformations: [{ type: Input, args: ["transformations",] }],
        ontransformation: [{ type: Output, args: ["ontransformation",] }],
        onerror: [{ type: Output, args: ["onerror",] }]
    };
    return XjsltComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var XjsltModule = /** @class */ (function () {
    function XjsltModule() {
    }
    XjsltModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        XjsltComponent,
                    ],
                    exports: [
                        XjsltComponent,
                    ],
                    entryComponents: [
                        XjsltComponent
                    ],
                    providers: [],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];
    return XjsltModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { XjsltComponent, Styler, JXPath, Inquirer, XjsltModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy9pbnF1aXJlci50cyIsIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy90cmFuc2Zvcm1hdGlvbnMudHMiLCJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogSW50ZW50aW9uYWxseSBhdm9pZGluZyB1c2Ugb2YgbWFwIGNhbGwgb24gbGlzdCB0byByZWR1Y2UgdGhlIGNhbGwgc3RhY2sgbnVtYmVycy5cclxuICogT24gbGFyZ2Ugc2NhbGUgSlNPTiwgY2FsbCBzdGFjayBiZWNvbWVzIGEgcHJvYmxlbSB0byBiZSBhdm9pZGVkLlxyXG4gKi9cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIG1hdGNoPzogc3RyaW5nLFxyXG4gICAgdmFsdWU/OiBzdHJpbmcsXHJcbiAgICBjb250ZXh0OiBzdHJpbmcsXHJcbiAgICBpblBvb2w/OiBzdHJpbmcsXHJcbiAgICBzdHlsZTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcGVyYXRpb24ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgYXJncz86IFF1ZXJ5T3BlcmF0aW9uW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEpYUGF0aCB7XHJcbiAgICBwcml2YXRlIHBhdGg7XHJcbiAgICBjb25zdHJ1Y3RvcihqcGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0ganBhdGguc3BsaXQoXCIuXCIpO1xyXG4gICAgfVxyXG4gICAgZnJvbUxhc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKWFBhdGgodGhpcy5wYXRoW3RoaXMucGF0aC5sZW5ndGggLSAxXSk7XHJcbiAgICB9XHJcbiAgICBub2RlT2Yobm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX25vZGVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBJdGVtW3FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9ub2RlT2YoaXRlbVtwYXRoW2ldXSwgcGF0aC5zbGljZShpKzEscGF0aC5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiB4ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcEl0ZW07XHJcbiAgICB9XHJcbiAgICB2YWx1ZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVPZihub2RlLCB0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfdmFsdWVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCB0aGlzLnBhdGgubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLl92YWx1ZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwSXRlbSA9IGxpc3Q7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW0gPyBwSXRlbVtwYXRoW2ldXSA6IHBJdGVtO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5xdWlyZXIgIHtcclxuXHJcbiAgICBwcml2YXRlIHN1cHBvcnRlZE1ldGhvZHMgPSB7fTtcclxuICAgIHByaXZhdGUgdGVtcGxhdGVzID0ge307XHJcbiAgICBwcml2YXRlIHJvb3ROb2RlO1xyXG4gICAgcHJpdmF0ZSBjb250ZXh0Tm9kZTsgLy8gc2hvdWxkIGJlIHNldCBiZWZvcmUgYW55IGNhbGwgaXMgbWFkZS4uLiB0aGlzIGlzIHRvIGF2b2lkIGNhbGwgc3RhY2sgb3ZlcmZsb3cgaW4gZXh0cmVtZWx0IGxhcmdlIEpTT05cclxuICAgIHByaXZhdGUgZ2xvYmFsUG9vbCA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYXRoUG9vbCA9IHt9Oy8vIHRvIGF2b2lkIHN0YWNrb3ZlcmZsb3cuLi4gYW5kIHBlcmZvcm0gZmFzdGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwidmFsdWVPZlwiLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVhY2hcIiwgdGhpcy5lYWNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzcGxpdFwiLCB0aGlzLnNwbGl0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJjb25jYXRcIiwgdGhpcy5jb25jYXRlbmF0ZSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZW5saXN0XCIsIHRoaXMuZW5saXN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJqb2luXCIsIHRoaXMuam9pbik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZmlsdGVyXCIsIHRoaXMuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInN0eWxlXCIsIHRoaXMuc3R5bGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcIm1hdGNoXCIsIHRoaXMubWF0Y2gpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImFwcGx5XCIsIHRoaXMuYXBwbHkpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJvZmZQb29sXCIsIHRoaXMub2ZmUG9vbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBqWFBhdGhGb3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHA6SlhQYXRoID0gdGhpcy5wYXRoUG9vbFtwYXRoXTtcclxuICAgICAgICBpZiAoIXApIHtcclxuICAgICAgICAgICAgcCA9IG5ldyBKWFBhdGgocGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aFBvb2xbcGF0aF0gPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSb290Tm9kZShub2RlOmFueSkge1xyXG4gICAgICAgIHRoaXMucm9vdE5vZGUgPSB0aGlzLm5vZGVMaXN0KG5vZGUpO1xyXG4gICAgICAgIHRoaXMuaW5pdFBvb2xzKHRoaXMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuICAgIHNldENvbnRleHROb2RlKG5vZGUpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgIH1cclxuICAgIHRlbXBsYXRlRm9yTmFtZShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzW25hbWVdO1xyXG4gICAgfVxyXG4gICAgLy8gaWYgbm9kZSBpcyBudWxsLCByb290IG5vZGUgd2lsbCBiZSB1c2VkLlxyXG4gICAgbm9kZUxpc3Qobm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBub2RlID09PSBudWxsID8gdGhpcy5yb290Tm9kZSA6IG5vZGU7XHJcbiAgICAgICAgbGV0IGxpc3Q7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgbGlzdCA9IGl0ZW07XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXMoaXRlbSk7XHJcbiAgICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHgubGVuZ3RoOyB0KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhJdGVtID0geFt0XTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3hJdGVtXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBlcmZvcm1zIHF1ZXJ5IG9mIG5lc3RlZCBmdW5jdGlvbiBjYWxscyBvbiB0aGUgZ2l2ZW4gbm9kZS5cclxuICAgIHF1ZXJ5KGNvbW1hbmQ6c3RyaW5nLCBub2RlKSB7XHJcbiAgICAgICAgY29uc3QgbW90aG9kcyA9dGhpcy50b1F1ZXJ5T3BlcmF0aW9uKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbm9kZS5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUl0ZW0gPSBub2RlW3FdO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KHRoaXMuaW52b2tlKG1vdGhvZHMsIG5vZGVJdGVtKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZShtb3Rob2RzLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSB3aXRoIGdpdmVuIGxpc3Qgb2YgcXVlcnkgb3BlcnRhdGlvbnNcclxuICAgIGludm9rZShvcGVyYXRpb246UXVlcnlPcGVyYXRpb24sIG5vZGUpIHtcclxuICAgICAgICBsZXQgbGlzdDphbnkgPSBbXTtcclxuICAgICAgICBpZiAoKHR5cGVvZiBub2RlID09PSBcIm9iamVjdFwiKSAmJiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSAmJiBub2RlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3BlcmF0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gdGhpcy5zdXBwb3J0ZWRNZXRob2RzW29wZXJhdGlvbi5uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uYXJncyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBvcGVyYXRpb24uYXJncy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmcgPSBvcGVyYXRpb24uYXJnc1thXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShhcmcsIG5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gob3BlcmF0aW9uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dE5vZGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBmLmFwcGx5KHRoaXMsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG9sZENvbnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25jYXRlbmF0ZShhLCBiLCBjKTogam9pbnMgYXJndW1lbnRzIGludG8gYSBzdHJpbmdcclxuICAgIC8vIGpvaW4gYXJnc1swLDEsMl1cclxuICAgIGNvbmNhdGVuYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gYXJnc1swXTtcclxuICAgICAgICBjb25zdCBkZWxpbT0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCByaWdodD0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGxlZnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQubGVuZ3RoID4gcmlnaHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyAocmlnaHQubGVuZ3RoID4gcSA/IHJpZ2h0W3FdIDogXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIChsZWZ0Lmxlbmd0aCA+IHEgPyBsZWZ0W3FdIDogXCJcIikgKyBkZWxpbSArIHJpZ2h0W3FdKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnRbcV0gKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCByaWdodC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0ICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGVmdCArIGRlbGltICsgcmlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQubGVuZ3RoID4gMSA/IHJlc3VsdCA6IHJlc3VsdFswXTtcclxuICAgIH1cclxuICAgIC8vIHNwbGl0KGl0ZW0sJywnKTogc3BsaXRzIHZhbHVlIGludG8gYSBsaXN0XHJcbiAgICAvLyBzcGxpdCBhcmdzWzBdIHdpdGggYXJnc1sxXVxyXG4gICAgc3BsaXQoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBhcmdzWzBdID8gYXJnc1swXS5zcGxpdChhcmdzWzFdKSA6IFtdO1xyXG4gICAgfVxyXG4gICAgLy8gdmFsdWVPZihwYXRoKTogIGV2YWx1YXRlcyB2YWx1ZSBvZiBhcmd1bWVudCBwYXRoXHJcbiAgICAvLyBwYXRoID0gYXJnc1swXSwgbm9kZSB0byBldmFsdWF0ZSA9IGFyZ3NbMV1cclxuICAgIHZhbHVlT2YoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgcmV0dXJuIGpwYXRoLnZhbHVlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICB9XHJcbiAgICAvLyBlYWNoKGxpc3QsbWV0aG9kKTogRm9yIGVhY2ggaXRlbSBpbiBsaXN0LCBpbnZvZGUgdGhlIGNhbGxiYWNrIG1ldGhvZFxyXG4gICAgLy8gZWFjaCBpdGVtIG9mIGFyZ3NbMF0gZXhlY3V0ZSBmdW5jdGlvbiBvZiBhcmdzWzFdXHJcbiAgICBlYWNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0ge25hbWU6IFwidmFsdWVPZlwiLCBhcmdzOiBhcmdzWzFdfTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGFyZ3NbMF0ubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGFyZ3NbMF1bcV07XHJcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShtZXRob2QsIG5vZGUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gZW5saXN0KC4uLik6IGluc2VydCBhcmd1bWVudCB2YWx1ZXMgaW50byBhIGxpc3RcclxuICAgIGVubGlzdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGFyZ3MubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSk7IC8vIG1ha2Ugc3VyZSBsYXN0IHR3byBpdGVtIGFyZSBub3Qgbm9kZSBhbmQgdGVtcGxhdGVcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gam9pbihhcnJheSwnLCcpOiBqb2lucyBpdGVtcyBvZiB0aGUgbGlzdCBpbnRvIGEgc3RyaW5nXHJcbiAgICBqb2luKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXS5sZW5ndGggPiAxID8gYXJnc1swXS5qb2luKGFyZ3NbMV0pIDogYXJnc1swXTtcclxuICAgIH1cclxuICAgIC8vIGFwcGx5KHRlbXBsYXRlLHBhdGgsYXJyYXkpOiBhcHBseSB0aGUgdGVtcGxhdGUgaW4gcm9vdCBjb250ZXh0IGZvciBlYWNoIHZhbHVlIFxyXG4gICAgLy8gdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBwYXRoLiBhcmdzWzBdIG5hbWUgdG8gYXBwbHlcclxuICAgIGFwcGx5KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1sxXSk7XHJcbiAgICAgICAgY29uc3QgcGF0aDI9IHBhdGguZnJvbUxhc3QoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5yb290Tm9kZS5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5yb290Tm9kZVtjXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LFwiPVwiLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuc3R5bGUoYXJnc1swXSwgbGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gbWF0Y2godGVtcGxhdGUscGF0aCxvcGVyYXRpb24sdmFsdWVzKTogLCBub2RlIGFyZ3NbNF1cclxuICAgIC8vIGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gZ2l2ZW4gdGVtcGxhdGUgbm9kZXMsIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFxyXG4gICAgbWF0Y2goLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUoYXJnc1swXSk7XHJcblxyXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb24gZm9yICdcIiArIGFyZ3NbMF0gKyBcIicuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzNdO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmNvbnRleHROb2RlKVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAobm9kZXMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IG5vZGVzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbY107XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGZpbHRlcihwYXRoLG9wZXJhdGlvbix2YWx1ZSk6IGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gY3VycmVudCBjb250ZXh0LCBcclxuICAgIC8vIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kIGZvciBzdHJpbmcgdmFsdWUgbWVhbnMgaW5kZXhPZi4gJyEnIG1lYW5zIG5vdCBlcXVhbCBvciBub3QgaW4uXHJcbiAgICBmaWx0ZXIoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSBhcmdzWzFdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb250ZXh0Tm9kZVthXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHYsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2YWx1ZSxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBzZWxlY3QocGF0aCk6IHNlbGVjdCB0aGUgbm9kZXMgd2l0aCBnaXZlbiBwYXRoIGluIGN1cnJlbnQgY29udGV4dFxyXG4gICAgc2VsZWN0KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0Tm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc3R5bGUodGVtcGxhdGUsIGFycmF5KTogYXBwbHkgdGhlIGdpdmVuIHRlbXBsYXRlIGZvciB0aGUgZ2l2ZW4gYXJyYXlcclxuICAgIHN0eWxlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKTtcclxuICAgIFxyXG4gICAgICAgIGlmIChhcmdzWzFdIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBhcmdzWzFdLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gYXJnc1sxXVthXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgYXR0cnMubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICBub2RlW2F0dHJdID0gdGhpcy5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGFyZ3NbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgYWRkU3VwcG9ydGluZ01ldGhvZChuYW1lLCBtZXRob2QpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZE1ldGhvZHNbbmFtZV0gPSBtZXRob2Q7XHJcbiAgICB9XHJcbiAgICAgcHJpdmF0ZSByZW1vdmVRdW90ZXMoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIChzdHIubGVuZ3RoICYmIHN0clswXSA9PT0gJ1xcJycgJiYgc3RyW3N0ci5sZW5ndGgtMV0gPT09ICdcXCcnKSA/IHN0ci5zdWJzdHJpbmcoMSxzdHIubGVuZ3RoLTEpIDogc3RyO1xyXG4gICAgfVxyXG4gICAgdG9RdWVyeU9wZXJhdGlvbihtZXRob2RzKSB7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IG1ldGhvZHMucmVwbGFjZSgvKFteJ10rKXwoJ1teJ10rJykvZywgZnVuY3Rpb24oJDAsICQxLCAkMikge1xyXG4gICAgICAgICAgICBpZiAoJDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMS5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQyOyBcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KS5yZXBsYWNlKC8nW14nXSsnL2csIGZ1bmN0aW9uIChtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2gucmVwbGFjZSgvLC9nLCAnficpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvRnVuY3Rpb25zKG9wZXJhdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB0b0Z1bmN0aW9ucyhpdGVtKXtcclxuICAgICAgICAvLyBpZiBpdGVtID0gam9pbihlbmxpc3QodmFsdWVPZihhZGRyZXNzLnN0cmVldCksdmFsdWVPZihhZGRyZXNzLmNpdHkpLHZhbHVlT2YoYWRkcmVzcy56aXBjb2RlKSksJywnKVxyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgbGV0IGogPSAtMTtcclxuICAgICAgICBsZXQgayA9IC0xO1xyXG4gICAgICAgIGxldCBjID0gMDtcclxuICAgICAgICBsZXQganNvbjogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgY2luZGV4ID0gMDsgY2luZGV4IDwgaXRlbS5sZW5ndGg7IGNpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtW2NpbmRleF0gPT09ICcoJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYysrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJyknKSB7XHJcbiAgICAgICAgICAgICAgICBjLS07XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBcnJ5ID0gKGpzb24gaW5zdGFuY2VvZiBBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGogPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkgJiYgKGogPT09IChpdGVtLmxlbmd0aCAtIDEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wibmFtZVwiXSA9IGl0ZW0uc3Vic3RyaW5nKDAsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wiYXJnc1wiXSA9IHRoaXMudG9GdW5jdGlvbnMoaXRlbS5zdWJzdHJpbmcoaSsxLGopKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbS5zdWJzdHJpbmcoaysxLCBpKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xICE9PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoayA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBjaW5kZXgpLnJlcGxhY2UoL34vZywgJywnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeC5pbmRleE9mKCcoJykgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMCAmJiAoY2luZGV4LTEgPT09IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA+PSAwICYmIGogPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcpJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChpPDAgJiYgaj4wKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcoJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfWVsc2UgaWYgKGkgPCAwICYmIGogPCAwICYmIGsgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1lbHNlIGlmIChjID09PSAwICYmIGsgPiBqKSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGpzb24ucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGpzb24uYXJncy5wdXNoKHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgaXRlbS5sZW5ndGgpLnJlcGxhY2UoL34vZywgJywnKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBsYXRlTm9kZXModGVtcGxhdGU6VGVtcGxhdGUsIG5vZGVzKSB7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBsZXQgbm9kZUxpc3QgPSBub2RlcztcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRleHQgPT09IFwicm9vdFwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGVMaXN0ID0gdGhpcy5ub2RlTGlzdCh0aGlzLnJvb3ROb2RlKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5tYXRjaCAmJiB0ZW1wbGF0ZS5tYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHRlbXBsYXRlLm1hdGNoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgbm9kZUxpc3QubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2RlTGlzdFt6XTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLnZhbHVlT2Yobm9kZSkgPT09IHRlbXBsYXRlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZXMpIHtcclxuICAgICAgICAgICAgbGlzdCA9IG5vZGVMaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kXHJcbiAgICAvLyBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZU9wZXJhdGlvbihsZWZ0LCBvcGVyYXRpb24sIHJpZ2h0KSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJpZ2h0W2ldLmluZGV4T2YobGVmdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAhZjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCJpblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocmlnaHQuaW5kZXhPZihsZWZ0KSA+PSAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiIVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAobGVmdCAhPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI+XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpID4gcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI8XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpIDwgcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb2ZmUG9vbCh0ZW1wbGF0ZSxrZXkpOiBXaWxsIHVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcG9vbCB0byBwaWNrIHVwIGl0ZW0ocykgd2l0aCBnaXZlbiBrZXkocylcclxuICAgIHByaXZhdGUgb2ZmUG9vbCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHBvb2wgPSB0aGlzLmdsb2JhbFBvb2xbYXJnc1swXV07XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IGFyZ3NbMV07XHJcbiAgICAgICAgaWYgKCFwb29sKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQXR0ZW1wdGluZyB0byBhY2Nlc3MgcG9vbCAnXCIgKyBhcmdzWzBdICsgXCInIHRoYXQgaXMgbm90IGNyZWF0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGtleXMgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHo9MDsgeiA8IGtleXMubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbel07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gcG9vbFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCB3ZSB0aHJvdyBoZXJlP1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5c107XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgaW5pdFRlbXBsYXRlcyhsaXN0KSB7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IGFueT0gbGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGVzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBzdHlsZXNbal07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSB0ZW1wbGF0ZS5zdHlsZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5zdHlsZVtrZXldID0gdGhpcy50b1F1ZXJ5T3BlcmF0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGUubmFtZV0gPSB0ZW1wbGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbml0UG9vbHModGVtcGxhdGVzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKHRlbXBsYXRlcyk7XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9ucy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsUG9vbCA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IHN0cmluZyA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZSh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIGlmICh0LmluUG9vbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9vbCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHQuaW5Qb29sKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoPSB0Lm1hdGNoO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZXM9IHRoaXMucm9vdE5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1wYXRoID0gdGhpcy5qWFBhdGhGb3IobWF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8IG5vZGVzLmxlbmd0aDsgaysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IG1wYXRoLnZhbHVlT2Yobm9kZXNba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiA9PT0gdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9vbFtwYXRoLnZhbHVlT2Yobm9kZXNba10pXSA9IG5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbFBvb2xbdC5uYW1lXSA9IHBvb2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSlhQYXRoLCBJbnF1aXJlciwgVGVtcGxhdGUgfSBmcm9tICcuL2lucXVpcmVyJztcclxuLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtYXRpb25zIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGltcG9ydFVybHM/OnN0cmluZ1tdLFxyXG4gICAgcm9vdFRlbXBsYXRlOiBzdHJpbmcsXHJcbiAgICBvblJlc3VsdD86IHN0cmluZyxcclxuICAgIHRlbXBsYXRlczogVGVtcGxhdGVbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3R5bGVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuICAgIHByaXZhdGUgaW5xdWlyZXI6SW5xdWlyZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtYXRpb25zOlRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIgPSBuZXcgSW5xdWlyZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9ucyA9IHRyYW5zZm9ybWF0aW9ucztcclxuICAgICAgICB0aGlzLmlucXVpcmVyLmluaXRUZW1wbGF0ZXModGhpcy50cmFuc2Zvcm1hdGlvbnMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlUm9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyLnNldFJvb3ROb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZUZvck5hbWUodGhpcy50cmFuc2Zvcm1hdGlvbnMucm9vdFRlbXBsYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVMaXN0ID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmlucXVpcmVyLm5vZGVMaXN0KG51bGwpKTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZUxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRpbmdOb2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IoIGxldCBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ05vZGVbYXR0cl0gPSB0aGlzLmlucXVpcmVyLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlc3VsdGluZ05vZGUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25zID0gdGhpcy5pbnF1aXJlci50b1F1ZXJ5T3BlcmF0aW9uKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0KTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnF1aXJlci5pbnZva2UoZnVuY3Rpb25zLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdHlsZXIsIFRyYW5zZm9ybWF0aW9ucyB9IGZyb20gJy4vdHJhbnNmb3JtYXRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAneGpzbHQnLFxyXG4gIHRlbXBsYXRlOiBgYCxcclxuICBzdHlsZXM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWGpzbHRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyAge1xyXG4gIFxyXG4gIHByaXZhdGUgc3R5bGVyO1xyXG5cclxuICBASW5wdXQoXCJub2RlXCIpXHJcbiAgbm9kZSA9IHt9O1xyXG5cclxuICBASW5wdXQoXCJ0cmFuc2Zvcm1hdGlvbnNcIilcclxuICB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuXHJcbiAgQE91dHB1dChcIm9udHJhbnNmb3JtYXRpb25cIilcclxuICBvbnRyYW5zZm9ybWF0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICBpZighdGhpcy5zdHlsZXIpIHtcclxuICAgICAgICB0aGlzLnN0eWxlciA9IG5ldyBTdHlsZXIodGhpcy50cmFuc2Zvcm1hdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc3R5bGVyLmNoYW5nZVJvb3ROb2RlKHRoaXMubm9kZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5vbnRyYW5zZm9ybWF0aW9uLmVtaXQodGhpcy5zdHlsZXIudHJhbnNmb3JtKCkpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYWdlcykge1xyXG4gICAgaWYgKGNoYWdlcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgdGhpcy5zdHlsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfSBlbHNlIGlmIChjaGFnZXMubm9kZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IFhqc2x0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMnO1xyXG5cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgWGpzbHRDb21wb25lbnQsXHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFhqc2x0TW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBb0JBO0lBRUksZ0JBQVksS0FBSztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNoQzs7OztJQUNELHlCQUFROzs7SUFBUjtRQUNJLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3REOzs7OztJQUNELHVCQUFNOzs7O0lBQU4sVUFBTyxJQUFJO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7Ozs7OztJQUNPLHdCQUFPOzs7OztjQUFDLElBQUksRUFBRSxJQUFjOztRQUNoQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTs7Z0JBQ3hCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztvQkFDdkMsSUFB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