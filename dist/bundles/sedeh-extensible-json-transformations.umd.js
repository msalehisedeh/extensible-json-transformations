(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@sedeh/extensible-json-transformations', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global.sedeh = global.sedeh || {}, global.sedeh['extensible-json-transformations'] = {}),global.ng.core,global.ng.common));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2lucXVpcmVyLnRzIiwibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy90cmFuc2Zvcm1hdGlvbnMudHMiLCJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMudHMiLCJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBJbnRlbnRpb25hbGx5IGF2b2lkaW5nIHVzZSBvZiBtYXAgY2FsbCBvbiBsaXN0IHRvIHJlZHVjZSB0aGUgY2FsbCBzdGFjayBudW1iZXJzLlxyXG4gKiBPbiBsYXJnZSBzY2FsZSBKU09OLCBjYWxsIHN0YWNrIGJlY29tZXMgYSBwcm9ibGVtIHRvIGJlIGF2b2lkZWQuXHJcbiAqL1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgbWF0Y2g/OiBzdHJpbmcsXHJcbiAgICB2YWx1ZT86IHN0cmluZyxcclxuICAgIGNvbnRleHQ6IHN0cmluZyxcclxuICAgIGluUG9vbD86IHN0cmluZyxcclxuICAgIHN0eWxlOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wZXJhdGlvbiB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBhcmdzPzogUXVlcnlPcGVyYXRpb25bXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSlhQYXRoIHtcclxuICAgIHByaXZhdGUgcGF0aDtcclxuICAgIGNvbnN0cnVjdG9yKGpwYXRoKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBqcGF0aC5zcGxpdChcIi5cIik7XHJcbiAgICB9XHJcbiAgICBmcm9tTGFzdCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEpYUGF0aCh0aGlzLnBhdGhbdGhpcy5wYXRoLmxlbmd0aCAtIDFdKTtcclxuICAgIH1cclxuICAgIG5vZGVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVPZihub2RlLCB0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfbm9kZU9mKG5vZGUsIHBhdGg6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHBJdGVtID0gbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGF0aC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocEl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCB0aGlzLnBhdGgubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX25vZGVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ICYmIHggIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwSXRlbSA9IGxpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW0gPyBwSXRlbVtwYXRoW2ldXSA6IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxuICAgIHZhbHVlT2Yobm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF92YWx1ZU9mKG5vZGUsIHBhdGg6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHBJdGVtID0gbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGF0aC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocEl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBJdGVtW3FdO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3ZhbHVlT2YoaXRlbVtwYXRoW2ldXSwgcGF0aC5zbGljZShpKzEscGF0aC5sZW5ndGgpKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcEl0ZW07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnF1aXJlciAge1xyXG5cclxuICAgIHByaXZhdGUgc3VwcG9ydGVkTWV0aG9kcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZXMgPSB7fTtcclxuICAgIHByaXZhdGUgcm9vdE5vZGU7XHJcbiAgICBwcml2YXRlIGNvbnRleHROb2RlOyAvLyBzaG91bGQgYmUgc2V0IGJlZm9yZSBhbnkgY2FsbCBpcyBtYWRlLi4uIHRoaXMgaXMgdG8gYXZvaWQgY2FsbCBzdGFjayBvdmVyZmxvdyBpbiBleHRyZW1lbHQgbGFyZ2UgSlNPTlxyXG4gICAgcHJpdmF0ZSBnbG9iYWxQb29sID0ge307XHJcbiAgICBwcml2YXRlIHBhdGhQb29sID0ge307Ly8gdG8gYXZvaWQgc3RhY2tvdmVyZmxvdy4uLiBhbmQgcGVyZm9ybSBmYXN0ZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJ2YWx1ZU9mXCIsIHRoaXMudmFsdWVPZik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZWFjaFwiLCB0aGlzLmVhY2gpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNwbGl0XCIsIHRoaXMuc3BsaXQpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImNvbmNhdFwiLCB0aGlzLmNvbmNhdGVuYXRlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlbmxpc3RcIiwgdGhpcy5lbmxpc3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImpvaW5cIiwgdGhpcy5qb2luKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3R5bGVcIiwgdGhpcy5zdHlsZSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwibWF0Y2hcIiwgdGhpcy5tYXRjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiYXBwbHlcIiwgdGhpcy5hcHBseSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZmlsdGVyXCIsIHRoaXMuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcIm9mZlBvb2xcIiwgdGhpcy5vZmZQb29sKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGpYUGF0aEZvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgcDpKWFBhdGggPSB0aGlzLnBhdGhQb29sW3BhdGhdO1xyXG4gICAgICAgIGlmICghcCkge1xyXG4gICAgICAgICAgICBwID0gbmV3IEpYUGF0aChwYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5wYXRoUG9vbFtwYXRoXSA9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5yb290Tm9kZSA9IHRoaXMubm9kZUxpc3Qobm9kZSk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9vbHModGhpcy50ZW1wbGF0ZXMpO1xyXG4gICAgfVxyXG4gICAgc2V0Q29udGV4dE5vZGUobm9kZSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgdGVtcGxhdGVGb3JOYW1lKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNbbmFtZV07XHJcbiAgICB9XHJcbiAgICAvLyBpZiBub2RlIGlzIG51bGwsIHJvb3Qgbm9kZSB3aWxsIGJlIHVzZWQuXHJcbiAgICBub2RlTGlzdChub2RlKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IG5vZGUgPT09IG51bGwgPyB0aGlzLnJvb3ROb2RlIDogbm9kZTtcclxuICAgICAgICBsZXQgbGlzdDtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsaXN0ID0gaXRlbTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgIGNvbnN0IHggPSBPYmplY3Qua2V5cyhpdGVtKTtcclxuICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgeC5sZW5ndGg7IHQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeEl0ZW0gPSB4W3RdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1beEl0ZW1dIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoaXRlbVt4SXRlbV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goaXRlbVt4SXRlbV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgb2YgbmVzdGVkIGZ1bmN0aW9uIGNhbGxzIG9uIHRoZSBnaXZlbiBub2RlLlxyXG4gICAgcXVlcnkoY29tbWFuZDpzdHJpbmcsIG5vZGUpIHtcclxuICAgICAgICBjb25zdCBtb3Rob2RzID10aGlzLnRvUXVlcnlPcGVyYXRpb24oY29tbWFuZCk7XHJcblxyXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBub2RlLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlSXRlbSA9IG5vZGVbcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQodGhpcy5pbnZva2UobW90aG9kcywgbm9kZUl0ZW0pKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKG1vdGhvZHMsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBlcmZvcm1zIHF1ZXJ5IHdpdGggZ2l2ZW4gbGlzdCBvZiBxdWVyeSBvcGVydGF0aW9uc1xyXG4gICAgaW52b2tlKG9wZXJhdGlvbjpRdWVyeU9wZXJhdGlvbiwgbm9kZSkge1xyXG4gICAgICAgIGxldCBsaXN0OmFueSA9IFtdO1xyXG4gICAgICAgIGlmICgodHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIpICYmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpICYmIG5vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcGVyYXRpb24gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSB0aGlzLnN1cHBvcnRlZE1ldGhvZHNbb3BlcmF0aW9uLm5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5hcmdzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IG9wZXJhdGlvbi5hcmdzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZyA9IG9wZXJhdGlvbi5hcmdzW2FdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuaW52b2tlKGFyZywgbm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChvcGVyYXRpb24uYXJncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0Tm9kZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGYuYXBwbHkodGhpcywgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gb2xkQ29udGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBvcGVyYXRpb24ubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBvcGVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbmNhdGVuYXRlKGEsIGIsIGMpOiBqb2lucyBhcmd1bWVudHMgaW50byBhIHN0cmluZ1xyXG4gICAgLy8gam9pbiBhcmdzWzAsMSwyXVxyXG4gICAgY29uY2F0ZW5hdGUoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxlZnQgPSBhcmdzWzBdO1xyXG4gICAgICAgIGNvbnN0IGRlbGltPSBhcmdzWzFdO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0PSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBpZiAobGVmdCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdC5sZW5ndGggPiByaWdodC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGxlZnQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnRbcV0gKyBkZWxpbSArIChyaWdodC5sZW5ndGggPiBxID8gcmlnaHRbcV0gOiBcIlwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCByaWdodC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggKGxlZnQubGVuZ3RoID4gcSA/IGxlZnRbcV0gOiBcIlwiKSArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGxlZnQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgcmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnQgKyBkZWxpbSArIHJpZ2h0W3FdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsZWZ0ICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPiAxID8gcmVzdWx0IDogcmVzdWx0WzBdO1xyXG4gICAgfVxyXG4gICAgLy8gc3BsaXQoaXRlbSwnLCcpOiBzcGxpdHMgdmFsdWUgaW50byBhIGxpc3RcclxuICAgIC8vIHNwbGl0IGFyZ3NbMF0gd2l0aCBhcmdzWzFdXHJcbiAgICBzcGxpdCguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0gPyBhcmdzWzBdLnNwbGl0KGFyZ3NbMV0pIDogW107XHJcbiAgICB9XHJcbiAgICAvLyB2YWx1ZU9mKHBhdGgpOiAgZXZhbHVhdGVzIHZhbHVlIG9mIGFyZ3VtZW50IHBhdGhcclxuICAgIC8vIHBhdGggPSBhcmdzWzBdLCBub2RlIHRvIGV2YWx1YXRlID0gYXJnc1sxXVxyXG4gICAgdmFsdWVPZiguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QganBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICByZXR1cm4ganBhdGgudmFsdWVPZih0aGlzLmNvbnRleHROb2RlKTtcclxuICAgIH1cclxuICAgIC8vIGVhY2gobGlzdCxtZXRob2QpOiBGb3IgZWFjaCBpdGVtIGluIGxpc3QsIGludm9kZSB0aGUgY2FsbGJhY2sgbWV0aG9kXHJcbiAgICAvLyBlYWNoIGl0ZW0gb2YgYXJnc1swXSBleGVjdXRlIGZ1bmN0aW9uIG9mIGFyZ3NbMV1cclxuICAgIGVhY2goLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSB7bmFtZTogXCJ2YWx1ZU9mXCIsIGFyZ3M6IGFyZ3NbMV19O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgYXJnc1swXS5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gYXJnc1swXVtxXTtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuaW52b2tlKG1ldGhvZCwgbm9kZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBlbmxpc3QoLi4uKTogaW5zZXJ0IGFyZ3VtZW50IHZhbHVlcyBpbnRvIGEgbGlzdFxyXG4gICAgZW5saXN0KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgYXJncy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChpdGVtKTsgLy8gbWFrZSBzdXJlIGxhc3QgdHdvIGl0ZW0gYXJlIG5vdCBub2RlIGFuZCB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBqb2luKGFycmF5LCcsJyk6IGpvaW5zIGl0ZW1zIG9mIHRoZSBsaXN0IGludG8gYSBzdHJpbmdcclxuICAgIGpvaW4oLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBhcmdzWzBdLmxlbmd0aCA+IDEgPyBhcmdzWzBdLmpvaW4oYXJnc1sxXSkgOiBhcmdzWzBdO1xyXG4gICAgfVxyXG4gICAgLy8gYXBwbHkodGVtcGxhdGUscGF0aCxhcnJheSk6IGFwcGx5IHRoZSB0ZW1wbGF0ZSBpbiByb290IGNvbnRleHQgZm9yIGVhY2ggdmFsdWUgXHJcbiAgICAvLyB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHBhdGguIGFyZ3NbMF0gbmFtZSB0byBhcHBseVxyXG4gICAgYXBwbHkoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbMl07XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLnJvb3ROb2RlLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnJvb3ROb2RlW2NdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LFwiPVwiLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsaXN0ID0gdGhpcy5zdHlsZShhcmdzWzBdLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBtYXRjaCh0ZW1wbGF0ZSxwYXRoLG9wZXJhdGlvbix2YWx1ZXMpOiAsIG5vZGUgYXJnc1s0XVxyXG4gICAgLy8gZm9yIHZhbHVlIG9mIHRhcmdldCBpbiBnaXZlbiB0ZW1wbGF0ZSBub2RlcywgZXZhbHVhdGUgb3BlcmF0aW9uIGZvciBnaXZlbiB2YWx1ZShzKS4gXHJcbiAgICBtYXRjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1sxXSk7XHJcbiAgICAgICAgY29uc3QgcGF0aDI9IHBhdGguZnJvbUxhc3QoKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbM107XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLnRlbXBsYXRlTm9kZXModGVtcGxhdGUsIHRoaXMuY29udGV4dE5vZGUpXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgbm9kZXMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGVzKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGVzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gZmlsdGVyKHBhdGgsb3BlcmF0aW9uLHZhbHVlKTogZm9yIHZhbHVlIG9mIHRhcmdldCBpbiBjdXJyZW50IGNvbnRleHQsIFxyXG4gICAgLy8gZXZhbHVhdGUgb3BlcmF0aW9uIGZvciBnaXZlbiB2YWx1ZShzKS4gU3VwcG9ydGVkIG9wZXJhdGlvbnMgYXJlIGA9LDwsPixpbiwhYC4gJ2luJyBmb3IgbGlzdCB2YWx1ZXMgbWVhbiBjb250YWlucyBhbmQgZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIGZpbHRlciguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCB0aGlzLmNvbnRleHROb2RlLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2FdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odixvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHZhbHVlLG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHNlbGVjdChwYXRoKTogc2VsZWN0IHRoZSBub2RlcyB3aXRoIGdpdmVuIHBhdGggaW4gY3VycmVudCBjb250ZXh0XHJcbiAgICBzZWxlY3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHROb2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB0aGlzLmNvbnRleHROb2RlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb250ZXh0Tm9kZVtkXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZih0aGlzLmNvbnRleHROb2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBzdHlsZSh0ZW1wbGF0ZSwgYXJyYXkpOiBhcHBseSB0aGUgZ2l2ZW4gdGVtcGxhdGUgZm9yIHRoZSBnaXZlbiBhcnJheVxyXG4gICAgc3R5bGUoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUoYXJnc1swXSk7XHJcblxyXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb24gZm9yICdcIiArIGFyZ3NbMF0gKyBcIicuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKGFyZ3NbMV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGFyZ3NbMV0ubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhcmdzWzFdW2FdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tkXTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlW2F0dHJdID0gdGhpcy5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgYXR0cnMubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tkXTtcclxuICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgYXJnc1sxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBhZGRTdXBwb3J0aW5nTWV0aG9kKG5hbWUsIG1ldGhvZCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tuYW1lXSA9IG1ldGhvZDtcclxuICAgIH1cclxuICAgICBwcml2YXRlIHJlbW92ZVF1b3RlcyhzdHIpIHtcclxuICAgICAgICByZXR1cm4gKHN0ci5sZW5ndGggJiYgc3RyWzBdID09PSAnXFwnJyAmJiBzdHJbc3RyLmxlbmd0aC0xXSA9PT0gJ1xcJycpID8gc3RyLnN1YnN0cmluZygxLHN0ci5sZW5ndGgtMSkgOiBzdHI7XHJcbiAgICB9XHJcbiAgICB0b1F1ZXJ5T3BlcmF0aW9uKG1ldGhvZHMpIHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gbWV0aG9kcy5yZXBsYWNlKC8oW14nXSspfCgnW14nXSsnKS9nLCBmdW5jdGlvbigkMCwgJDEsICQyKSB7XHJcbiAgICAgICAgICAgIGlmICgkMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQxLnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDI7IFxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pLnJlcGxhY2UoLydbXiddKycvZywgZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaC5yZXBsYWNlKC8sL2csICd+Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9GdW5jdGlvbnMob3BlcmF0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRvRnVuY3Rpb25zKGl0ZW0pe1xyXG4gICAgICAgIC8vIGlmIGl0ZW0gPSBqb2luKGVubGlzdCh2YWx1ZU9mKGFkZHJlc3Muc3RyZWV0KSx2YWx1ZU9mKGFkZHJlc3MuY2l0eSksdmFsdWVPZihhZGRyZXNzLnppcGNvZGUpKSwnLCcpXHJcbiAgICAgICAgbGV0IGkgPSAtMTtcclxuICAgICAgICBsZXQgaiA9IC0xO1xyXG4gICAgICAgIGxldCBrID0gLTE7XHJcbiAgICAgICAgbGV0IGMgPSAwO1xyXG4gICAgICAgIGxldCBqc29uOiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBjaW5kZXggPSAwOyBjaW5kZXggPCBpdGVtLmxlbmd0aDsgY2luZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJygnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjKys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnKScpIHtcclxuICAgICAgICAgICAgICAgIGMtLTtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaiA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSAmJiAoaiA9PT0gKGl0ZW0ubGVuZ3RoIC0gMSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bXCJuYW1lXCJdID0gaXRlbS5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bXCJhcmdzXCJdID0gdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpdGVtLnN1YnN0cmluZyhrKzEsIGkpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IHRoaXMudG9GdW5jdGlvbnMoaXRlbS5zdWJzdHJpbmcoaSsxLGopKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCAmJiAoY2luZGV4LTEgIT09IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBcnJ5ID0gKGpzb24gaW5zdGFuY2VvZiBBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBjaW5kZXgpLnJlcGxhY2UoL34vZywgJywnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4LmluZGV4T2YoJygnKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uYXJncy5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAwICYmIChjaW5kZXgtMSA9PT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpID49IDAgJiYgaiA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJpbmNvcnJlY3QgbWV0aG9kIGNhbGwgZGVjbGFyYXRpb24uIE1pc3NpbmcgJyknXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGk8MCAmJiBqPjApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJpbmNvcnJlY3QgbWV0aG9kIGNhbGwgZGVjbGFyYXRpb24uIE1pc3NpbmcgJygnXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9ZWxzZSBpZiAoaSA8IDAgJiYgaiA8IDAgJiYgayA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfWVsc2UgaWYgKGMgPT09IDAgJiYgayA+IGopIHtcclxuICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAganNvbi5wdXNoKHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgaXRlbS5sZW5ndGgpLnJlcGxhY2UoL34vZywgJywnKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcblxyXG4gICAgdGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZTpUZW1wbGF0ZSwgbm9kZXMpIHtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGxldCBub2RlTGlzdCA9IG5vZGVzO1xyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGUuY29udGV4dCA9PT0gXCJyb290XCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTpcIlVuYWJsZSB0byBmaW5kIHJvb3Qgbm9kZSB0byBwZXJmb3JtIG9wZXJhdGlvbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZUxpc3QgPSB0aGlzLm5vZGVMaXN0KHRoaXMucm9vdE5vZGUpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLm1hdGNoICYmIHRlbXBsYXRlLm1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IodGVtcGxhdGUubWF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeiA9IDA7IHogPCBub2RlTGlzdC5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVMaXN0W3pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgudmFsdWVPZihub2RlKSA9PT0gdGVtcGxhdGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChub2Rlcykge1xyXG4gICAgICAgICAgICBsaXN0ID0gbm9kZUxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gU3VwcG9ydGVkIG9wZXJhdGlvbnMgYXJlIGA9LDwsPixpbiwhYC4gJ2luJyBmb3IgbGlzdCB2YWx1ZXMgbWVhbiBjb250YWlucyBhbmRcclxuICAgIC8vIGZvciBzdHJpbmcgdmFsdWUgbWVhbnMgaW5kZXhPZi4gJyEnIG1lYW5zIG5vdCBlcXVhbCBvciBub3QgaW4uXHJcbiAgICBwcml2YXRlIGV2YWx1YXRlT3BlcmF0aW9uKGxlZnQsIG9wZXJhdGlvbiwgcmlnaHQpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCJpblwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRbaV0uaW5kZXhPZihsZWZ0KSA+PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiIVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICFmO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAobGVmdCA9PSByaWdodCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyaWdodC5pbmRleE9mKGxlZnQpID49IDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ICE9PSByaWdodCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIj5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHBhcnNlRmxvYXQobGVmdCkgPiBwYXJzZUZsb2F0KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIjxcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHBhcnNlRmxvYXQobGVmdCkgPCBwYXJzZUZsb2F0KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvZmZQb29sKHRlbXBsYXRlLGtleSk6IFdpbGwgdXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZSBwb29sIHRvIHBpY2sgdXAgaXRlbShzKSB3aXRoIGdpdmVuIGtleShzKVxyXG4gICAgcHJpdmF0ZSBvZmZQb29sKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgY29uc3QgcG9vbCA9IHRoaXMuZ2xvYmFsUG9vbFthcmdzWzBdXTtcclxuICAgICAgICBjb25zdCBrZXlzID0gYXJnc1sxXTtcclxuICAgICAgICBpZiAoIXBvb2wpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJBdHRlbXB0aW5nIHRvIGFjY2VzcyBwb29sICdcIiArIGFyZ3NbMF0gKyBcIicgdGhhdCBpcyBub3QgY3JlYXRlZC5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa2V5cyBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgZm9yIChsZXQgej0wOyB6IDwga2V5cy5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1t6XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIHdlIHRocm93IGhlcmU/XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gcG9vbFtrZXlzXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgXHJcbiAgICBpbml0VGVtcGxhdGVzKGxpc3QpIHtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZTogYW55PSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZXMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSlcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHN0eWxlc1tqXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IHRlbXBsYXRlLnN0eWxlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLnN0eWxlW2tleV0gPSB0aGlzLnRvUXVlcnlPcGVyYXRpb24obWV0aG9kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZS5uYW1lXSA9IHRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGluaXRQb29scyh0ZW1wbGF0ZXMpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gT2JqZWN0LmtleXModGVtcGxhdGVzKTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb25zLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBmaW5kIHJvb3Qgbm9kZSB0byBwZXJmb3JtIG9wZXJhdGlvbi5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nbG9iYWxQb29sID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZTogc3RyaW5nID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKHRlbXBsYXRlKTtcclxuICAgICAgICAgICAgaWYgKHQuaW5Qb29sKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb29sID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IodC5pblBvb2wpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2g9IHQubWF0Y2g7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2Rlcz0gdGhpcy5yb290Tm9kZTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiB0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbXBhdGggPSB0aGlzLmpYUGF0aEZvcihtYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gbXBhdGgudmFsdWVPZihub2Rlc1trXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ID09PSB0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8IG5vZGVzLmxlbmd0aDsgaysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9vbFtwYXRoLnZhbHVlT2Yobm9kZXNba10pXSA9IG5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsUG9vbFt0Lm5hbWVdID0gcG9vbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBKWFBhdGgsIElucXVpcmVyLCBUZW1wbGF0ZSB9IGZyb20gJy4vaW5xdWlyZXInO1xyXG4vKlxyXG4gKiB0b29sIHRvIGRpc3BsYXkgcmVzdWx0IG9mIGEgc2VhcmNoIG9uIHNldCBvZiBwb2ludHMgb2YgaW50ZXJlc3RzIG9uIG9iamVjdHMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2Zvcm1hdGlvbnMge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgaW1wb3J0VXJscz86c3RyaW5nW10sXHJcbiAgICByb290VGVtcGxhdGU6IHN0cmluZyxcclxuICAgIG9uUmVzdWx0Pzogc3RyaW5nLFxyXG4gICAgdGVtcGxhdGVzOiBUZW1wbGF0ZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdHlsZXIgIHtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybWF0aW9uczogVHJhbnNmb3JtYXRpb25zO1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlcjpJbnF1aXJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0cmFuc2Zvcm1hdGlvbnM6VHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlciA9IG5ldyBJbnF1aXJlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25zID0gdHJhbnNmb3JtYXRpb25zO1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIuaW5pdFRlbXBsYXRlcyh0aGlzLnRyYW5zZm9ybWF0aW9ucy50ZW1wbGF0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VSb290Tm9kZShub2RlOmFueSkge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIuc2V0Um9vdE5vZGUobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zZm9ybSgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLmlucXVpcmVyLnRlbXBsYXRlRm9yTmFtZSh0aGlzLnRyYW5zZm9ybWF0aW9ucy5yb290VGVtcGxhdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKTtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZUxpc3QgPSB0aGlzLmlucXVpcmVyLnRlbXBsYXRlTm9kZXModGVtcGxhdGUsIHRoaXMuaW5xdWlyZXIubm9kZUxpc3QobnVsbCkpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBub2RlTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdGluZ05vZGUgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciggbGV0IGogPSAwOyBqIDwgYXR0cnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nTm9kZVthdHRyXSA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocmVzdWx0aW5nTm9kZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0ICYmIHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbnMgPSB0aGlzLmlucXVpcmVyLnRvUXVlcnlPcGVyYXRpb24odGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQpO1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmlucXVpcmVyLmludm9rZShmdW5jdGlvbnMsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuIiwiLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN0eWxlciwgVHJhbnNmb3JtYXRpb25zIH0gZnJvbSAnLi90cmFuc2Zvcm1hdGlvbnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd4anNsdCcsXHJcbiAgdGVtcGxhdGU6IGBgLFxyXG4gIHN0eWxlczogW10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBYanNsdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzICB7XHJcbiAgXHJcbiAgcHJpdmF0ZSBzdHlsZXI7XHJcblxyXG4gIEBJbnB1dChcIm5vZGVcIilcclxuICBub2RlID0ge307XHJcblxyXG4gIEBJbnB1dChcInRyYW5zZm9ybWF0aW9uc1wiKVxyXG4gIHRyYW5zZm9ybWF0aW9uczogVHJhbnNmb3JtYXRpb25zO1xyXG5cclxuICBAT3V0cHV0KFwib250cmFuc2Zvcm1hdGlvblwiKVxyXG4gIG9udHJhbnNmb3JtYXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmVycm9yXCIpXHJcbiAgb25lcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5ub2RlICYmIHRoaXMudHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgIGlmKCF0aGlzLnN0eWxlcikge1xyXG4gICAgICAgIHRoaXMuc3R5bGVyID0gbmV3IFN0eWxlcih0aGlzLnRyYW5zZm9ybWF0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zdHlsZXIuY2hhbmdlUm9vdE5vZGUodGhpcy5ub2RlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLm9udHJhbnNmb3JtYXRpb24uZW1pdCh0aGlzLnN0eWxlci50cmFuc2Zvcm0oKSk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgdGhpcy5vbmVycm9yLmVtaXQoZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgbmdPbkNoYW5nZXMoY2hhZ2VzKSB7XHJcbiAgICBpZiAoY2hhZ2VzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICB0aGlzLnN0eWxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgc2V0VGltZW91dCh0aGlzLm5nT25Jbml0LmJpbmQodGhpcyksIDMzMyk7XHJcbiAgICB9IGVsc2UgaWYgKGNoYWdlcy5ub2RlKSB7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgWGpzbHRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucyc7XHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgWGpzbHRDb21wb25lbnQsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBYanNsdENvbXBvbmVudCxcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgWGpzbHRDb21wb25lbnRcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gIF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgWGpzbHRNb2R1bGUge31cclxuIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJDVVNUT01fRUxFTUVOVFNfU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBb0JBO1FBRUksZ0JBQVksS0FBSztZQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNoQzs7OztRQUNELHlCQUFROzs7WUFBUjtnQkFDSSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RDs7Ozs7UUFDRCx1QkFBTTs7OztZQUFOLFVBQU8sSUFBSTtnQkFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4Qzs7Ozs7O1FBQ08sd0JBQU87Ozs7O3NCQUFDLElBQUksRUFBRSxJQUFjOztnQkFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQUksS0FBSyxZQUFZLEtBQUss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