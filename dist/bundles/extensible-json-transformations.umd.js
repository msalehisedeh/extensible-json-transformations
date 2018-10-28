(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('extensible-json-transformations', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global['extensible-json-transformations'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var JXPath = (function () {
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
    var Inquirer = (function () {
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
    var Styler = (function () {
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
    var XjsltComponent = (function () {
        function XjsltComponent() {
            this.node = {};
            this.ontransformation = new core.EventEmitter();
            this.onerror = new core.EventEmitter();
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
            { type: core.Component, args: [{
                        selector: 'xjslt',
                        template: ""
                    }] }
        ];
        XjsltComponent.propDecorators = {
            node: [{ type: core.Input, args: ["node",] }],
            transformations: [{ type: core.Input, args: ["transformations",] }],
            ontransformation: [{ type: core.Output, args: ["ontransformation",] }],
            onerror: [{ type: core.Output, args: ["onerror",] }]
        };
        return XjsltComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var XjsltModule = (function () {
        function XjsltModule() {
        }
        XjsltModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
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
                        schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
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

    exports.XjsltComponent = XjsltComponent;
    exports.Styler = Styler;
    exports.JXPath = JXPath;
    exports.Inquirer = Inquirer;
    exports.XjsltModule = XjsltModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvaW5xdWlyZXIudHMiLCJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvdHJhbnNmb3JtYXRpb25zLnRzIiwibmc6Ly9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMudHMiLCJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEludGVudGlvbmFsbHkgYXZvaWRpbmcgdXNlIG9mIG1hcCBjYWxsIG9uIGxpc3QgdG8gcmVkdWNlIHRoZSBjYWxsIHN0YWNrIG51bWJlcnMuXHJcbiAqIE9uIGxhcmdlIHNjYWxlIEpTT04sIGNhbGwgc3RhY2sgYmVjb21lcyBhIHByb2JsZW0gdG8gYmUgYXZvaWRlZC5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBtYXRjaD86IHN0cmluZyxcclxuICAgIHZhbHVlPzogc3RyaW5nLFxyXG4gICAgY29udGV4dDogc3RyaW5nLFxyXG4gICAgaW5Qb29sPzogc3RyaW5nLFxyXG4gICAgc3R5bGU6IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3BlcmF0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBRdWVyeU9wZXJhdGlvbltdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKWFBhdGgge1xyXG4gICAgcHJpdmF0ZSBwYXRoO1xyXG4gICAgY29uc3RydWN0b3IoanBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGpwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIH1cclxuICAgIGZyb21MYXN0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSlhQYXRoKHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gICAgbm9kZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9ub2RlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fbm9kZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgeCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG4gICAgdmFsdWVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3ZhbHVlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fdmFsdWVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucXVpcmVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRNZXRob2RzID0ge307XHJcbiAgICBwcml2YXRlIHRlbXBsYXRlcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSByb290Tm9kZTtcclxuICAgIHByaXZhdGUgY29udGV4dE5vZGU7IC8vIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBjYWxsIGlzIG1hZGUuLi4gdGhpcyBpcyB0byBhdm9pZCBjYWxsIHN0YWNrIG92ZXJmbG93IGluIGV4dHJlbWVsdCBsYXJnZSBKU09OXHJcbiAgICBwcml2YXRlIGdsb2JhbFBvb2wgPSB7fTtcclxuICAgIHByaXZhdGUgcGF0aFBvb2wgPSB7fTsvLyB0byBhdm9pZCBzdGFja292ZXJmbG93Li4uIGFuZCBwZXJmb3JtIGZhc3RlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInZhbHVlT2ZcIiwgdGhpcy52YWx1ZU9mKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlYWNoXCIsIHRoaXMuZWFjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3BsaXRcIiwgdGhpcy5zcGxpdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiY29uY2F0XCIsIHRoaXMuY29uY2F0ZW5hdGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVubGlzdFwiLCB0aGlzLmVubGlzdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiam9pblwiLCB0aGlzLmpvaW4pO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzdHlsZVwiLCB0aGlzLnN0eWxlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJtYXRjaFwiLCB0aGlzLm1hdGNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJhcHBseVwiLCB0aGlzLmFwcGx5KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwib2ZmUG9vbFwiLCB0aGlzLm9mZlBvb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgalhQYXRoRm9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBwOkpYUGF0aCA9IHRoaXMucGF0aFBvb2xbcGF0aF07XHJcbiAgICAgICAgaWYgKCFwKSB7XHJcbiAgICAgICAgICAgIHAgPSBuZXcgSlhQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGhQb29sW3BhdGhdID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3ROb2RlID0gdGhpcy5ub2RlTGlzdChub2RlKTtcclxuICAgICAgICB0aGlzLmluaXRQb29scyh0aGlzLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZXh0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICB0ZW1wbGF0ZUZvck5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIC8vIGlmIG5vZGUgaXMgbnVsbCwgcm9vdCBub2RlIHdpbGwgYmUgdXNlZC5cclxuICAgIG5vZGVMaXN0KG5vZGUpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbm9kZSA9PT0gbnVsbCA/IHRoaXMucm9vdE5vZGUgOiBub2RlO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBpdGVtO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCB4Lmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4SXRlbSA9IHhbdF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVt4SXRlbV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSBvZiBuZXN0ZWQgZnVuY3Rpb24gY2FsbHMgb24gdGhlIGdpdmVuIG5vZGUuXHJcbiAgICBxdWVyeShjb21tYW5kOnN0cmluZywgbm9kZSkge1xyXG4gICAgICAgIGNvbnN0IG1vdGhvZHMgPXRoaXMudG9RdWVyeU9wZXJhdGlvbihjb21tYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IG5vZGUubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJdGVtID0gbm9kZVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLmludm9rZShtb3Rob2RzLCBub2RlSXRlbSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2UobW90aG9kcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgd2l0aCBnaXZlbiBsaXN0IG9mIHF1ZXJ5IG9wZXJ0YXRpb25zXHJcbiAgICBpbnZva2Uob3BlcmF0aW9uOlF1ZXJ5T3BlcmF0aW9uLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6YW55ID0gW107XHJcbiAgICAgICAgaWYgKCh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgbm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tvcGVyYXRpb24ubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgb3BlcmF0aW9uLmFyZ3MubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gb3BlcmF0aW9uLmFyZ3NbYV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UoYXJnLCBub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9wZXJhdGlvbi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gZi5hcHBseSh0aGlzLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBvbGRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uY2F0ZW5hdGUoYSwgYiwgYyk6IGpvaW5zIGFyZ3VtZW50cyBpbnRvIGEgc3RyaW5nXHJcbiAgICAvLyBqb2luIGFyZ3NbMCwxLDJdXHJcbiAgICBjb25jYXRlbmF0ZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGFyZ3NbMF07XHJcbiAgICAgICAgY29uc3QgZGVsaW09IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgcmlnaHQ9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA+IHJpZ2h0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgKHJpZ2h0Lmxlbmd0aCA+IHEgPyByaWdodFtxXSA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCAobGVmdC5sZW5ndGggPiBxID8gbGVmdFtxXSA6IFwiXCIpICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdCArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxlZnQgKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDEgPyByZXN1bHQgOiByZXN1bHRbMF07XHJcbiAgICB9XHJcbiAgICAvLyBzcGxpdChpdGVtLCcsJyk6IHNwbGl0cyB2YWx1ZSBpbnRvIGEgbGlzdFxyXG4gICAgLy8gc3BsaXQgYXJnc1swXSB3aXRoIGFyZ3NbMV1cclxuICAgIHNwbGl0KC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXSA/IGFyZ3NbMF0uc3BsaXQoYXJnc1sxXSkgOiBbXTtcclxuICAgIH1cclxuICAgIC8vIHZhbHVlT2YocGF0aCk6ICBldmFsdWF0ZXMgdmFsdWUgb2YgYXJndW1lbnQgcGF0aFxyXG4gICAgLy8gcGF0aCA9IGFyZ3NbMF0sIG5vZGUgdG8gZXZhbHVhdGUgPSBhcmdzWzFdXHJcbiAgICB2YWx1ZU9mKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIHJldHVybiBqcGF0aC52YWx1ZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLy8gZWFjaChsaXN0LG1ldGhvZCk6IEZvciBlYWNoIGl0ZW0gaW4gbGlzdCwgaW52b2RlIHRoZSBjYWxsYmFjayBtZXRob2RcclxuICAgIC8vIGVhY2ggaXRlbSBvZiBhcmdzWzBdIGV4ZWN1dGUgZnVuY3Rpb24gb2YgYXJnc1sxXVxyXG4gICAgZWFjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHtuYW1lOiBcInZhbHVlT2ZcIiwgYXJnczogYXJnc1sxXX07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBhcmdzWzBdLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBhcmdzWzBdW3FdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UobWV0aG9kLCBub2RlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGVubGlzdCguLi4pOiBpbnNlcnQgYXJndW1lbnQgdmFsdWVzIGludG8gYSBsaXN0XHJcbiAgICBlbmxpc3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBhcmdzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pOyAvLyBtYWtlIHN1cmUgbGFzdCB0d28gaXRlbSBhcmUgbm90IG5vZGUgYW5kIHRlbXBsYXRlXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGpvaW4oYXJyYXksJywnKTogam9pbnMgaXRlbXMgb2YgdGhlIGxpc3QgaW50byBhIHN0cmluZ1xyXG4gICAgam9pbiguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0ubGVuZ3RoID4gMSA/IGFyZ3NbMF0uam9pbihhcmdzWzFdKSA6IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICAvLyBhcHBseSh0ZW1wbGF0ZSxwYXRoLGFycmF5KTogYXBwbHkgdGhlIHRlbXBsYXRlIGluIHJvb3QgY29udGV4dCBmb3IgZWFjaCB2YWx1ZSBcclxuICAgIC8vIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aC4gYXJnc1swXSBuYW1lIHRvIGFwcGx5XHJcbiAgICBhcHBseSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMucm9vdE5vZGUubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucm9vdE5vZGVbY107XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLnN0eWxlKGFyZ3NbMF0sIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIG1hdGNoKHRlbXBsYXRlLHBhdGgsb3BlcmF0aW9uLHZhbHVlcyk6ICwgbm9kZSBhcmdzWzRdXHJcbiAgICAvLyBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGdpdmVuIHRlbXBsYXRlIG5vZGVzLCBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBcclxuICAgIG1hdGNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1szXTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5jb250ZXh0Tm9kZSlcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBub2Rlcy5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2NdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIocGF0aCxvcGVyYXRpb24sdmFsdWUpOiBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGN1cnJlbnQgY29udGV4dCwgXHJcbiAgICAvLyBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZCBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgZmlsdGVyKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbYV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odmFsdWUsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0KHBhdGgpOiBzZWxlY3QgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gcGF0aCBpbiBjdXJyZW50IGNvbnRleHRcclxuICAgIHNlbGVjdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2RdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHN0eWxlKHRlbXBsYXRlLCBhcnJheSk6IGFwcGx5IHRoZSBnaXZlbiB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGFycmF5XHJcbiAgICBzdHlsZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoYXJnc1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYXJnc1sxXS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMV1bYV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGFkZFN1cHBvcnRpbmdNZXRob2QobmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRNZXRob2RzW25hbWVdID0gbWV0aG9kO1xyXG4gICAgfVxyXG4gICAgIHByaXZhdGUgcmVtb3ZlUXVvdGVzKHN0cikge1xyXG4gICAgICAgIHJldHVybiAoc3RyLmxlbmd0aCAmJiBzdHJbMF0gPT09ICdcXCcnICYmIHN0cltzdHIubGVuZ3RoLTFdID09PSAnXFwnJykgPyBzdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aC0xKSA6IHN0cjtcclxuICAgIH1cclxuICAgIHRvUXVlcnlPcGVyYXRpb24obWV0aG9kcykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBtZXRob2RzLnJlcGxhY2UoLyhbXiddKyl8KCdbXiddKycpL2csIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcclxuICAgICAgICAgICAgaWYgKCQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMjsgXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSkucmVwbGFjZSgvJ1teJ10rJy9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UoLywvZywgJ34nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0Z1bmN0aW9ucyhvcGVyYXRpb25zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9GdW5jdGlvbnMoaXRlbSl7XHJcbiAgICAgICAgLy8gaWYgaXRlbSA9IGpvaW4oZW5saXN0KHZhbHVlT2YoYWRkcmVzcy5zdHJlZXQpLHZhbHVlT2YoYWRkcmVzcy5jaXR5KSx2YWx1ZU9mKGFkZHJlc3MuemlwY29kZSkpLCcsJylcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBqID0gLTE7XHJcbiAgICAgICAgbGV0IGsgPSAtMTtcclxuICAgICAgICBsZXQgYyA9IDA7XHJcbiAgICAgICAgbGV0IGpzb246IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGNpbmRleCA9IDA7IGNpbmRleCA8IGl0ZW0ubGVuZ3RoOyBjaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtjaW5kZXhdID09PSAnKCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcpJykge1xyXG4gICAgICAgICAgICAgICAgYy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5ICYmIChqID09PSAoaXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcIm5hbWVcIl0gPSBpdGVtLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcImFyZ3NcIl0gPSB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uc3Vic3RyaW5nKGsrMSwgaSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwICYmIChjaW5kZXgtMSAhPT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaW5kZXhPZignKCcpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xID09PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKSdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaTwwICYmIGo+MCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKCdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNlIGlmIChpIDwgMCAmJiBqIDwgMCAmJiBrIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9ZWxzZSBpZiAoYyA9PT0gMCAmJiBrID4gaikge1xyXG4gICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlOlRlbXBsYXRlLCBub2Rlcykge1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IG5vZGVMaXN0ID0gbm9kZXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZXh0ID09PSBcInJvb3RcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlTGlzdCA9IHRoaXMubm9kZUxpc3QodGhpcy5yb290Tm9kZSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUubWF0Y2ggJiYgdGVtcGxhdGUubWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0ZW1wbGF0ZS5tYXRjaCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IG5vZGVMaXN0Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZUxpc3Rbel07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC52YWx1ZU9mKG5vZGUpID09PSB0ZW1wbGF0ZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZFxyXG4gICAgLy8gZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVPcGVyYXRpb24obGVmdCwgb3BlcmF0aW9uLCByaWdodCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodFtpXS5pbmRleE9mKGxlZnQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gIWY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ID09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJpZ2h0LmluZGV4T2YobGVmdCkgPj0gMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgIT09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA+IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA8IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9mZlBvb2wodGVtcGxhdGUsa2V5KTogV2lsbCB1c2UgdGhlIGdpdmVuIHRlbXBsYXRlIHBvb2wgdG8gcGljayB1cCBpdGVtKHMpIHdpdGggZ2l2ZW4ga2V5KHMpXHJcbiAgICBwcml2YXRlIG9mZlBvb2woLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5nbG9iYWxQb29sW2FyZ3NbMF1dO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBhcmdzWzFdO1xyXG4gICAgICAgIGlmICghcG9vbCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIHBvb2wgJ1wiICsgYXJnc1swXSArIFwiJyB0aGF0IGlzIG5vdCBjcmVhdGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB6PTA7IHogPCBrZXlzLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW3pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdGhyb3cgaGVyZT9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleXNdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICBcclxuICAgIGluaXRUZW1wbGF0ZXMobGlzdCkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBhbnk9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gc3R5bGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGVtcGxhdGUuc3R5bGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuc3R5bGVba2V5XSA9IHRoaXMudG9RdWVyeU9wZXJhdGlvbihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlLm5hbWVdID0gdGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFBvb2xzKHRlbXBsYXRlcykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZXMpO1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbnMuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbFBvb2wgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBzdHJpbmcgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICBpZiAodC5pblBvb2wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2wgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0LmluUG9vbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaD0gdC5tYXRjaDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzPSB0aGlzLnJvb3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtcGF0aCA9IHRoaXMualhQYXRoRm9yKG1hdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBtcGF0aC52YWx1ZU9mKG5vZGVzW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxQb29sW3QubmFtZV0gPSBwb29sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEpYUGF0aCwgSW5xdWlyZXIsIFRlbXBsYXRlIH0gZnJvbSAnLi9pbnF1aXJlcic7XHJcbi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybWF0aW9ucyB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBpbXBvcnRVcmxzPzpzdHJpbmdbXSxcclxuICAgIHJvb3RUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgb25SZXN1bHQ/OiBzdHJpbmcsXHJcbiAgICB0ZW1wbGF0ZXM6IFRlbXBsYXRlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0eWxlciAge1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcbiAgICBwcml2YXRlIGlucXVpcmVyOklucXVpcmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRyYW5zZm9ybWF0aW9uczpUcmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyID0gbmV3IElucXVpcmVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbnMgPSB0cmFuc2Zvcm1hdGlvbnM7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5pbml0VGVtcGxhdGVzKHRoaXMudHJhbnNmb3JtYXRpb25zLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZVJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5zZXRSb290Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVGb3JOYW1lKHRoaXMudHJhbnNmb3JtYXRpb25zLnJvb3RUZW1wbGF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlTGlzdCA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5pbnF1aXJlci5ub2RlTGlzdChudWxsKSk7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0aW5nTm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBhdHRycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdOb2RlW2F0dHJdID0gdGhpcy5pbnF1aXJlci5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyZXN1bHRpbmdOb2RlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IHRoaXMuaW5xdWlyZXIudG9RdWVyeU9wZXJhdGlvbih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKGZ1bmN0aW9ucywgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4gKiB0b29sIHRvIGRpc3BsYXkgcmVzdWx0IG9mIGEgc2VhcmNoIG9uIHNldCBvZiBwb2ludHMgb2YgaW50ZXJlc3RzIG9uIG9iamVjdHMuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3R5bGVyLCBUcmFuc2Zvcm1hdGlvbnMgfSBmcm9tICcuL3RyYW5zZm9ybWF0aW9ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3hqc2x0JyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgc3R5bGVzOiBbXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFhqc2x0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMgIHtcclxuICBcclxuICBwcml2YXRlIHN0eWxlcjtcclxuXHJcbiAgQElucHV0KFwibm9kZVwiKVxyXG4gIG5vZGUgPSB7fTtcclxuXHJcbiAgQElucHV0KFwidHJhbnNmb3JtYXRpb25zXCIpXHJcbiAgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcblxyXG4gIEBPdXRwdXQoXCJvbnRyYW5zZm9ybWF0aW9uXCIpXHJcbiAgb250cmFuc2Zvcm1hdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLm5vZGUgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgaWYoIXRoaXMuc3R5bGVyKSB7XHJcbiAgICAgICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKHRoaXMudHJhbnNmb3JtYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnN0eWxlci5jaGFuZ2VSb290Tm9kZSh0aGlzLm5vZGUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMub250cmFuc2Zvcm1hdGlvbi5lbWl0KHRoaXMuc3R5bGVyLnRyYW5zZm9ybSgpKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB0aGlzLm9uZXJyb3IuZW1pdChlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFnZXMpIHtcclxuICAgIGlmIChjaGFnZXMudHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgIHRoaXMuc3R5bGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH0gZWxzZSBpZiAoY2hhZ2VzLm5vZGUpIHtcclxuICAgICAgc2V0VGltZW91dCh0aGlzLm5nT25Jbml0LmJpbmQodGhpcyksIDMzMyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBYanNsdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zJztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBYanNsdENvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBYanNsdENvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBYanNsdE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiSW5wdXQiLCJPdXRwdXQiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkNVU1RPTV9FTEVNRU5UU19TQ0hFTUEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFvQkE7UUFFSSxnQkFBWSxLQUFLO1lBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDOzs7O1FBQ0QseUJBQVE7OztZQUFSO2dCQUNJLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3REOzs7OztRQUNELHVCQUFNOzs7O1lBQU4sVUFBTyxJQUFJO2dCQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hDOzs7Ozs7UUFDTyx3QkFBTzs7Ozs7c0JBQUMsSUFBSSxFQUFFLElBQWM7O2dCQUNoQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFOzt3QkFDeEIsSUFBTSxJQUFJLEdBQUcsRUFBRSxD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