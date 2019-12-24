import { __decorate } from 'tslib';
import { EventEmitter, Input, Output, Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/*
 * Intentionally avoiding use of map call on list to reduce the call stack numbers.
 * On large scale JSON, call stack becomes a problem to be avoided.
 */
var JXPath = /** @class */ (function () {
    function JXPath(jpath) {
        this.path = jpath.split(".");
    }
    JXPath.prototype.fromLast = function () {
        return new JXPath(this.path[this.path.length - 1]);
    };
    JXPath.prototype.nodeOf = function (node) {
        return this._nodeOf(node, this.path);
    };
    JXPath.prototype._nodeOf = function (node, path) {
        var pItem = node;
        for (var i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                var list = [];
                for (var q = 0; q < this.path.length; q++) {
                    var item = pItem[q];
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
    JXPath.prototype.valueOf = function (node) {
        return this._valueOf(node, this.path);
    };
    JXPath.prototype._valueOf = function (node, path) {
        var pItem = node;
        for (var i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                var list = [];
                for (var q = 0; q < this.path.length; q++) {
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
        this.pathPool = {}; // to avoid stackoverflow... and perform faster
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
    Inquirer.prototype.jXPathFor = function (path) {
        var p = this.pathPool[path];
        if (!p) {
            p = new JXPath(path);
            this.pathPool[path] = p;
        }
        return p;
    };
    Inquirer.prototype.setRootNode = function (node) {
        this.rootNode = this.nodeList(node);
        this.initPools(this.templates);
    };
    Inquirer.prototype.setContextNode = function (node) {
        this.contextNode = node;
    };
    Inquirer.prototype.templateForName = function (name) {
        return this.templates[name];
    };
    // if node is null, root node will be used.
    Inquirer.prototype.nodeList = function (node) {
        var item = node === null ? this.rootNode : node;
        var list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            var x = Object.keys(item);
            list = [];
            for (var t = 0; t < x.length; t++) {
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
    Inquirer.prototype.query = function (command, node) {
        var mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            var list = [];
            for (var q = 0; q < node.length; q++) {
                var nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem));
            }
            ;
            return list;
        }
        return this.invoke(mothods, node);
    };
    // performs query with given list of query opertations
    Inquirer.prototype.invoke = function (operation, node) {
        var list = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        }
        else if (typeof operation === 'object') {
            var f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (var a = 0; a < operation.args.length; a++) {
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
                // list.push(node);
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
    Inquirer.prototype.concatenate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var left = args[0];
        var delim = args[1];
        var right = args[2];
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
    Inquirer.prototype.split = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0] ? args[0].split(args[1]) : [];
    };
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    Inquirer.prototype.valueOf = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    };
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1]
    Inquirer.prototype.each = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        var method = { name: "valueOf", args: args[1] };
        for (var q = 0; q < args[0].length; q++) {
            var node = args[0][q];
            list.push(this.invoke(method, node));
        }
        ;
        return list;
    };
    // enlist(...): insert argument values into a list
    Inquirer.prototype.enlist = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        args.map(function (item) {
            list.push(item); // make sure last two item are not node and template
        });
        return list;
    };
    // join(array,','): joins items of the list into a string
    Inquirer.prototype.join = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0].length > 1 ? args[0].join(args[1]) : args[0];
    };
    // apply(template,path,array): apply the template in root context for each value 
    // that matches the given path. args[0] name to apply
    Inquirer.prototype.apply = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var path = this.jXPathFor(args[1]);
        var path2 = path.fromLast();
        var values = args[2];
        var list = [];
        for (var c = 0; c < this.rootNode.length; c++) {
            var node = this.rootNode[c];
            var value = path.nodeOf(node);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
                    var v = value[d];
                    var x = path2.valueOf(v);
                    if (this.evaluateOperation(x, "=", values)) {
                        list.push(v);
                    }
                }
            }
            else {
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
    Inquirer.prototype.match = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        var path = this.jXPathFor(args[1]);
        var path2 = path.fromLast();
        var operation = args[2];
        var values = args[3];
        var nodes = this.templateNodes(template, this.contextNode);
        var list = [];
        if (nodes instanceof Array) {
            for (var c = 0; c < nodes.length; c++) {
                var node = nodes[c];
                var value = path.nodeOf(node);
                if (value instanceof Array) {
                    for (var d = 0; d < value.length; d++) {
                        var v = value[d];
                        var x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    }
                }
                else {
                    var x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            }
            ;
        }
        else {
            var value = path.nodeOf(nodes);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
                    var v = value[d];
                    var x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                }
            }
            else {
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
    Inquirer.prototype.filter = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var path = this.jXPathFor(args[0]);
        var operation = args[1];
        var values = args[2];
        var list = [];
        for (var a = 0; a < this.contextNode.length; a++) {
            var node = this.contextNode[a];
            var value = path.valueOf(node);
            if (value instanceof Array) {
                for (var d = 0; d < value.length; d++) {
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
    Inquirer.prototype.select = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var path = this.jXPathFor(args[0]);
        var list = [];
        if (this.contextNode instanceof Array) {
            for (var d = 0; d < this.contextNode.length; d++) {
                var node = this.contextNode[d];
                var value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            }
        }
        else {
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
    Inquirer.prototype.style = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        var result = [];
        var attrs = Object.keys(template.style);
        if (args[1] instanceof Array) {
            for (var a = 0; a < args[1].length; a++) {
                var item = args[1][a];
                var node = {};
                for (var d = 0; d < attrs.length; d++) {
                    var attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        }
        else {
            var node = {};
            for (var d = 0; d < attrs.length; d++) {
                var attr = attrs[d];
                node[attr] = this.invoke(template.style[attr], args[1]);
            }
            result.push(node);
        }
        return result;
    };
    Inquirer.prototype.addSupportingMethod = function (name, method) {
        this.supportedMethods[name] = method;
    };
    Inquirer.prototype.removeQuotes = function (str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    };
    Inquirer.prototype.toQueryOperation = function (methods) {
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
    Inquirer.prototype.toFunctions = function (item) {
        // if item = join(enlist(valueOf(address.street),valueOf(address.city),valueOf(address.zipcode)),',')
        var i = -1;
        var j = -1;
        var k = -1;
        var c = 0;
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
    Inquirer.prototype.templateNodes = function (template, nodes) {
        var list = [];
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
            var path = this.jXPathFor(template.match);
            for (var z = 0; z < nodeList.length; z++) {
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
    // Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and
    // for string value means indexOf. '!' means not equal or not in.
    Inquirer.prototype.evaluateOperation = function (left, operation, right) {
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
    // offPool(template,key): Will use the given template pool to pick up item(s) with given key(s)
    Inquirer.prototype.offPool = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        var pool = this.globalPool[args[0]];
        var keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array) {
            for (var z = 0; z < keys.length; z++) {
                var key = keys[z];
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
            var node = pool[keys];
            if (node) {
                list.push(node);
            }
        }
        return list;
    };
    Inquirer.prototype.initTemplates = function (list) {
        this.templates = {};
        for (var i = 0; i < list.length; i++) {
            var template = list[i];
            var styles = Object.keys(template.style);
            for (var j = 0; j < styles.length; j++) {
                var key = styles[j];
                var method = template.style[key];
                if (typeof method === "string") {
                    template.style[key] = this.toQueryOperation(method);
                }
            }
            this.templates[template.name] = template;
        }
    };
    Inquirer.prototype.initPools = function (templates) {
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
            var template = list[i];
            var t = this.templateForName(template);
            if (t.inPool) {
                var pool = {};
                var path = this.jXPathFor(t.inPool);
                var match = t.match;
                var nodes = this.rootNode;
                if (match && t.value) {
                    var mpath = this.jXPathFor(match);
                    for (var k = 0; k < nodes.length; k++) {
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

var Styler = /** @class */ (function () {
    function Styler(transformations) {
        this.inquirer = new Inquirer();
        this.transformations = transformations;
        this.inquirer.initTemplates(this.transformations.templates);
    }
    Styler.prototype.changeRootNode = function (node) {
        this.inquirer.setRootNode(node);
    };
    Styler.prototype.transform = function () {
        var result = [];
        var template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            var attrs = Object.keys(template.style);
            var nodeList = this.inquirer.templateNodes(template, this.inquirer.nodeList(null));
            for (var i = 0; i < nodeList.length; i++) {
                var currentNode = nodeList[i];
                var resultingNode = {};
                for (var j = 0; j < attrs.length; j++) {
                    var attr = attrs[j];
                    resultingNode[attr] = this.inquirer.invoke(template.style[attr], currentNode);
                }
                ;
                result.push(resultingNode);
            }
            ;
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            var functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    };
    return Styler;
}());

var XjsltComponent = /** @class */ (function () {
    function XjsltComponent() {
        this.node = {};
        this.ontransformation = new EventEmitter();
        this.onerror = new EventEmitter();
    }
    XjsltComponent.prototype.ngOnInit = function () {
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
    XjsltComponent.prototype.ngOnChanges = function (chages) {
        if (chages.transformations) {
            this.styler = undefined;
            setTimeout(this.ngOnInit.bind(this), 333);
        }
        else if (chages.node) {
            setTimeout(this.ngOnInit.bind(this), 333);
        }
    };
    __decorate([
        Input("node")
    ], XjsltComponent.prototype, "node", void 0);
    __decorate([
        Input("transformations")
    ], XjsltComponent.prototype, "transformations", void 0);
    __decorate([
        Output("ontransformation")
    ], XjsltComponent.prototype, "ontransformation", void 0);
    __decorate([
        Output("onerror")
    ], XjsltComponent.prototype, "onerror", void 0);
    XjsltComponent = __decorate([
        Component({
            selector: 'xjslt',
            template: ""
        })
    ], XjsltComponent);
    return XjsltComponent;
}());

var XjsltModule = /** @class */ (function () {
    function XjsltModule() {
    }
    XjsltModule = __decorate([
        NgModule({
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
        })
    ], XjsltModule);
    return XjsltModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Inquirer, JXPath, Styler, XjsltComponent, XjsltModule };
//# sourceMappingURL=sedeh-extensible-json-transformations.js.map
