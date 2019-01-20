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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvaW5xdWlyZXIudHMiLCJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL3RyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEludGVudGlvbmFsbHkgYXZvaWRpbmcgdXNlIG9mIG1hcCBjYWxsIG9uIGxpc3QgdG8gcmVkdWNlIHRoZSBjYWxsIHN0YWNrIG51bWJlcnMuXHJcbiAqIE9uIGxhcmdlIHNjYWxlIEpTT04sIGNhbGwgc3RhY2sgYmVjb21lcyBhIHByb2JsZW0gdG8gYmUgYXZvaWRlZC5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBtYXRjaD86IHN0cmluZyxcclxuICAgIHZhbHVlPzogc3RyaW5nLFxyXG4gICAgY29udGV4dDogc3RyaW5nLFxyXG4gICAgaW5Qb29sPzogc3RyaW5nLFxyXG4gICAgc3R5bGU6IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3BlcmF0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBRdWVyeU9wZXJhdGlvbltdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKWFBhdGgge1xyXG4gICAgcHJpdmF0ZSBwYXRoO1xyXG4gICAgY29uc3RydWN0b3IoanBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGpwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIH1cclxuICAgIGZyb21MYXN0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSlhQYXRoKHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gICAgbm9kZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9ub2RlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fbm9kZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgeCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG4gICAgdmFsdWVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3ZhbHVlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fdmFsdWVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucXVpcmVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRNZXRob2RzID0ge307XHJcbiAgICBwcml2YXRlIHRlbXBsYXRlcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSByb290Tm9kZTtcclxuICAgIHByaXZhdGUgY29udGV4dE5vZGU7IC8vIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBjYWxsIGlzIG1hZGUuLi4gdGhpcyBpcyB0byBhdm9pZCBjYWxsIHN0YWNrIG92ZXJmbG93IGluIGV4dHJlbWVsdCBsYXJnZSBKU09OXHJcbiAgICBwcml2YXRlIGdsb2JhbFBvb2wgPSB7fTtcclxuICAgIHByaXZhdGUgcGF0aFBvb2wgPSB7fTsvLyB0byBhdm9pZCBzdGFja292ZXJmbG93Li4uIGFuZCBwZXJmb3JtIGZhc3RlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInZhbHVlT2ZcIiwgdGhpcy52YWx1ZU9mKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlYWNoXCIsIHRoaXMuZWFjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3BsaXRcIiwgdGhpcy5zcGxpdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiY29uY2F0XCIsIHRoaXMuY29uY2F0ZW5hdGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVubGlzdFwiLCB0aGlzLmVubGlzdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiam9pblwiLCB0aGlzLmpvaW4pO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzdHlsZVwiLCB0aGlzLnN0eWxlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJtYXRjaFwiLCB0aGlzLm1hdGNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJhcHBseVwiLCB0aGlzLmFwcGx5KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwib2ZmUG9vbFwiLCB0aGlzLm9mZlBvb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgalhQYXRoRm9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBwOkpYUGF0aCA9IHRoaXMucGF0aFBvb2xbcGF0aF07XHJcbiAgICAgICAgaWYgKCFwKSB7XHJcbiAgICAgICAgICAgIHAgPSBuZXcgSlhQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGhQb29sW3BhdGhdID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3ROb2RlID0gdGhpcy5ub2RlTGlzdChub2RlKTtcclxuICAgICAgICB0aGlzLmluaXRQb29scyh0aGlzLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZXh0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICB0ZW1wbGF0ZUZvck5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIC8vIGlmIG5vZGUgaXMgbnVsbCwgcm9vdCBub2RlIHdpbGwgYmUgdXNlZC5cclxuICAgIG5vZGVMaXN0KG5vZGUpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbm9kZSA9PT0gbnVsbCA/IHRoaXMucm9vdE5vZGUgOiBub2RlO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBpdGVtO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCB4Lmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4SXRlbSA9IHhbdF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVt4SXRlbV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSBvZiBuZXN0ZWQgZnVuY3Rpb24gY2FsbHMgb24gdGhlIGdpdmVuIG5vZGUuXHJcbiAgICBxdWVyeShjb21tYW5kOnN0cmluZywgbm9kZSkge1xyXG4gICAgICAgIGNvbnN0IG1vdGhvZHMgPXRoaXMudG9RdWVyeU9wZXJhdGlvbihjb21tYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IG5vZGUubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJdGVtID0gbm9kZVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLmludm9rZShtb3Rob2RzLCBub2RlSXRlbSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2UobW90aG9kcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgd2l0aCBnaXZlbiBsaXN0IG9mIHF1ZXJ5IG9wZXJ0YXRpb25zXHJcbiAgICBpbnZva2Uob3BlcmF0aW9uOlF1ZXJ5T3BlcmF0aW9uLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6YW55ID0gW107XHJcbiAgICAgICAgaWYgKCh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgbm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tvcGVyYXRpb24ubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgb3BlcmF0aW9uLmFyZ3MubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gb3BlcmF0aW9uLmFyZ3NbYV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UoYXJnLCBub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9wZXJhdGlvbi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gZi5hcHBseSh0aGlzLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBvbGRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uY2F0ZW5hdGUoYSwgYiwgYyk6IGpvaW5zIGFyZ3VtZW50cyBpbnRvIGEgc3RyaW5nXHJcbiAgICAvLyBqb2luIGFyZ3NbMCwxLDJdXHJcbiAgICBjb25jYXRlbmF0ZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGFyZ3NbMF07XHJcbiAgICAgICAgY29uc3QgZGVsaW09IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgcmlnaHQ9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA+IHJpZ2h0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgKHJpZ2h0Lmxlbmd0aCA+IHEgPyByaWdodFtxXSA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCAobGVmdC5sZW5ndGggPiBxID8gbGVmdFtxXSA6IFwiXCIpICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdCArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxlZnQgKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDEgPyByZXN1bHQgOiByZXN1bHRbMF07XHJcbiAgICB9XHJcbiAgICAvLyBzcGxpdChpdGVtLCcsJyk6IHNwbGl0cyB2YWx1ZSBpbnRvIGEgbGlzdFxyXG4gICAgLy8gc3BsaXQgYXJnc1swXSB3aXRoIGFyZ3NbMV1cclxuICAgIHNwbGl0KC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXSA/IGFyZ3NbMF0uc3BsaXQoYXJnc1sxXSkgOiBbXTtcclxuICAgIH1cclxuICAgIC8vIHZhbHVlT2YocGF0aCk6ICBldmFsdWF0ZXMgdmFsdWUgb2YgYXJndW1lbnQgcGF0aFxyXG4gICAgLy8gcGF0aCA9IGFyZ3NbMF0sIG5vZGUgdG8gZXZhbHVhdGUgPSBhcmdzWzFdXHJcbiAgICB2YWx1ZU9mKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIHJldHVybiBqcGF0aC52YWx1ZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLy8gZWFjaChsaXN0LG1ldGhvZCk6IEZvciBlYWNoIGl0ZW0gaW4gbGlzdCwgaW52b2RlIHRoZSBjYWxsYmFjayBtZXRob2RcclxuICAgIC8vIGVhY2ggaXRlbSBvZiBhcmdzWzBdIGV4ZWN1dGUgZnVuY3Rpb24gb2YgYXJnc1sxXVxyXG4gICAgZWFjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHtuYW1lOiBcInZhbHVlT2ZcIiwgYXJnczogYXJnc1sxXX07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBhcmdzWzBdLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBhcmdzWzBdW3FdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UobWV0aG9kLCBub2RlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGVubGlzdCguLi4pOiBpbnNlcnQgYXJndW1lbnQgdmFsdWVzIGludG8gYSBsaXN0XHJcbiAgICBlbmxpc3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBhcmdzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pOyAvLyBtYWtlIHN1cmUgbGFzdCB0d28gaXRlbSBhcmUgbm90IG5vZGUgYW5kIHRlbXBsYXRlXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGpvaW4oYXJyYXksJywnKTogam9pbnMgaXRlbXMgb2YgdGhlIGxpc3QgaW50byBhIHN0cmluZ1xyXG4gICAgam9pbiguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0ubGVuZ3RoID4gMSA/IGFyZ3NbMF0uam9pbihhcmdzWzFdKSA6IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICAvLyBhcHBseSh0ZW1wbGF0ZSxwYXRoLGFycmF5KTogYXBwbHkgdGhlIHRlbXBsYXRlIGluIHJvb3QgY29udGV4dCBmb3IgZWFjaCB2YWx1ZSBcclxuICAgIC8vIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aC4gYXJnc1swXSBuYW1lIHRvIGFwcGx5XHJcbiAgICBhcHBseSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMucm9vdE5vZGUubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucm9vdE5vZGVbY107XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLnN0eWxlKGFyZ3NbMF0sIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIG1hdGNoKHRlbXBsYXRlLHBhdGgsb3BlcmF0aW9uLHZhbHVlcyk6ICwgbm9kZSBhcmdzWzRdXHJcbiAgICAvLyBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGdpdmVuIHRlbXBsYXRlIG5vZGVzLCBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBcclxuICAgIG1hdGNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1szXTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5jb250ZXh0Tm9kZSlcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBub2Rlcy5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2NdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIocGF0aCxvcGVyYXRpb24sdmFsdWUpOiBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGN1cnJlbnQgY29udGV4dCwgXHJcbiAgICAvLyBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZCBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgZmlsdGVyKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbYV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odmFsdWUsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0KHBhdGgpOiBzZWxlY3QgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gcGF0aCBpbiBjdXJyZW50IGNvbnRleHRcclxuICAgIHNlbGVjdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2RdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHN0eWxlKHRlbXBsYXRlLCBhcnJheSk6IGFwcGx5IHRoZSBnaXZlbiB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGFycmF5XHJcbiAgICBzdHlsZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoYXJnc1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYXJnc1sxXS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMV1bYV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGFkZFN1cHBvcnRpbmdNZXRob2QobmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRNZXRob2RzW25hbWVdID0gbWV0aG9kO1xyXG4gICAgfVxyXG4gICAgIHByaXZhdGUgcmVtb3ZlUXVvdGVzKHN0cikge1xyXG4gICAgICAgIHJldHVybiAoc3RyLmxlbmd0aCAmJiBzdHJbMF0gPT09ICdcXCcnICYmIHN0cltzdHIubGVuZ3RoLTFdID09PSAnXFwnJykgPyBzdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aC0xKSA6IHN0cjtcclxuICAgIH1cclxuICAgIHRvUXVlcnlPcGVyYXRpb24obWV0aG9kcykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBtZXRob2RzLnJlcGxhY2UoLyhbXiddKyl8KCdbXiddKycpL2csIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcclxuICAgICAgICAgICAgaWYgKCQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMjsgXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSkucmVwbGFjZSgvJ1teJ10rJy9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UoLywvZywgJ34nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0Z1bmN0aW9ucyhvcGVyYXRpb25zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9GdW5jdGlvbnMoaXRlbSl7XHJcbiAgICAgICAgLy8gaWYgaXRlbSA9IGpvaW4oZW5saXN0KHZhbHVlT2YoYWRkcmVzcy5zdHJlZXQpLHZhbHVlT2YoYWRkcmVzcy5jaXR5KSx2YWx1ZU9mKGFkZHJlc3MuemlwY29kZSkpLCcsJylcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBqID0gLTE7XHJcbiAgICAgICAgbGV0IGsgPSAtMTtcclxuICAgICAgICBsZXQgYyA9IDA7XHJcbiAgICAgICAgbGV0IGpzb246IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGNpbmRleCA9IDA7IGNpbmRleCA8IGl0ZW0ubGVuZ3RoOyBjaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtjaW5kZXhdID09PSAnKCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcpJykge1xyXG4gICAgICAgICAgICAgICAgYy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5ICYmIChqID09PSAoaXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcIm5hbWVcIl0gPSBpdGVtLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcImFyZ3NcIl0gPSB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uc3Vic3RyaW5nKGsrMSwgaSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwICYmIChjaW5kZXgtMSAhPT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaW5kZXhPZignKCcpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xID09PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKSdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaTwwICYmIGo+MCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKCdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNlIGlmIChpIDwgMCAmJiBqIDwgMCAmJiBrIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9ZWxzZSBpZiAoYyA9PT0gMCAmJiBrID4gaikge1xyXG4gICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlOlRlbXBsYXRlLCBub2Rlcykge1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IG5vZGVMaXN0ID0gbm9kZXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZXh0ID09PSBcInJvb3RcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlTGlzdCA9IHRoaXMubm9kZUxpc3QodGhpcy5yb290Tm9kZSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUubWF0Y2ggJiYgdGVtcGxhdGUubWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0ZW1wbGF0ZS5tYXRjaCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IG5vZGVMaXN0Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZUxpc3Rbel07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC52YWx1ZU9mKG5vZGUpID09PSB0ZW1wbGF0ZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZFxyXG4gICAgLy8gZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVPcGVyYXRpb24obGVmdCwgb3BlcmF0aW9uLCByaWdodCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodFtpXS5pbmRleE9mKGxlZnQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gIWY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ID09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJpZ2h0LmluZGV4T2YobGVmdCkgPj0gMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgIT09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA+IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA8IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9mZlBvb2wodGVtcGxhdGUsa2V5KTogV2lsbCB1c2UgdGhlIGdpdmVuIHRlbXBsYXRlIHBvb2wgdG8gcGljayB1cCBpdGVtKHMpIHdpdGggZ2l2ZW4ga2V5KHMpXHJcbiAgICBwcml2YXRlIG9mZlBvb2woLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5nbG9iYWxQb29sW2FyZ3NbMF1dO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBhcmdzWzFdO1xyXG4gICAgICAgIGlmICghcG9vbCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIHBvb2wgJ1wiICsgYXJnc1swXSArIFwiJyB0aGF0IGlzIG5vdCBjcmVhdGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB6PTA7IHogPCBrZXlzLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW3pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdGhyb3cgaGVyZT9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleXNdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICBcclxuICAgIGluaXRUZW1wbGF0ZXMobGlzdCkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBhbnk9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gc3R5bGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGVtcGxhdGUuc3R5bGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuc3R5bGVba2V5XSA9IHRoaXMudG9RdWVyeU9wZXJhdGlvbihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlLm5hbWVdID0gdGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFBvb2xzKHRlbXBsYXRlcykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZXMpO1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbnMuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbFBvb2wgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBzdHJpbmcgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICBpZiAodC5pblBvb2wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2wgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0LmluUG9vbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaD0gdC5tYXRjaDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzPSB0aGlzLnJvb3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtcGF0aCA9IHRoaXMualhQYXRoRm9yKG1hdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBtcGF0aC52YWx1ZU9mKG5vZGVzW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxQb29sW3QubmFtZV0gPSBwb29sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEpYUGF0aCwgSW5xdWlyZXIsIFRlbXBsYXRlIH0gZnJvbSAnLi9pbnF1aXJlcic7XHJcbi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybWF0aW9ucyB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBpbXBvcnRVcmxzPzpzdHJpbmdbXSxcclxuICAgIHJvb3RUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgb25SZXN1bHQ/OiBzdHJpbmcsXHJcbiAgICB0ZW1wbGF0ZXM6IFRlbXBsYXRlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0eWxlciAge1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcbiAgICBwcml2YXRlIGlucXVpcmVyOklucXVpcmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRyYW5zZm9ybWF0aW9uczpUcmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyID0gbmV3IElucXVpcmVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbnMgPSB0cmFuc2Zvcm1hdGlvbnM7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5pbml0VGVtcGxhdGVzKHRoaXMudHJhbnNmb3JtYXRpb25zLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZVJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5zZXRSb290Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVGb3JOYW1lKHRoaXMudHJhbnNmb3JtYXRpb25zLnJvb3RUZW1wbGF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlTGlzdCA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5pbnF1aXJlci5ub2RlTGlzdChudWxsKSk7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0aW5nTm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBhdHRycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdOb2RlW2F0dHJdID0gdGhpcy5pbnF1aXJlci5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyZXN1bHRpbmdOb2RlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IHRoaXMuaW5xdWlyZXIudG9RdWVyeU9wZXJhdGlvbih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKGZ1bmN0aW9ucywgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4gKiB0b29sIHRvIGRpc3BsYXkgcmVzdWx0IG9mIGEgc2VhcmNoIG9uIHNldCBvZiBwb2ludHMgb2YgaW50ZXJlc3RzIG9uIG9iamVjdHMuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3R5bGVyLCBUcmFuc2Zvcm1hdGlvbnMgfSBmcm9tICcuL3RyYW5zZm9ybWF0aW9ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3hqc2x0JyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgc3R5bGVzOiBbXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFhqc2x0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMgIHtcclxuICBcclxuICBwcml2YXRlIHN0eWxlcjtcclxuXHJcbiAgQElucHV0KFwibm9kZVwiKVxyXG4gIG5vZGUgPSB7fTtcclxuXHJcbiAgQElucHV0KFwidHJhbnNmb3JtYXRpb25zXCIpXHJcbiAgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcblxyXG4gIEBPdXRwdXQoXCJvbnRyYW5zZm9ybWF0aW9uXCIpXHJcbiAgb250cmFuc2Zvcm1hdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLm5vZGUgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgaWYoIXRoaXMuc3R5bGVyKSB7XHJcbiAgICAgICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKHRoaXMudHJhbnNmb3JtYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnN0eWxlci5jaGFuZ2VSb290Tm9kZSh0aGlzLm5vZGUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMub250cmFuc2Zvcm1hdGlvbi5lbWl0KHRoaXMuc3R5bGVyLnRyYW5zZm9ybSgpKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB0aGlzLm9uZXJyb3IuZW1pdChlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFnZXMpIHtcclxuICAgIGlmIChjaGFnZXMudHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgIHRoaXMuc3R5bGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH0gZWxzZSBpZiAoY2hhZ2VzLm5vZGUpIHtcclxuICAgICAgc2V0VGltZW91dCh0aGlzLm5nT25Jbml0LmJpbmQodGhpcyksIDMzMyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBYanNsdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zJztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBYanNsdENvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBYanNsdENvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBYanNsdE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQW9CQTtJQUVJLGdCQUFZLEtBQUs7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7Ozs7SUFDRCx5QkFBUTs7O0lBQVI7UUFDSSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0RDs7Ozs7SUFDRCx1QkFBTTs7OztJQUFOLFVBQU8sSUFBSTtRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7Ozs7SUFDTyx3QkFBTzs7Ozs7Y0FBQyxJQUFJLEVBQUUsSUFBYzs7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7O2dCQUN4QixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1B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