(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global['extensible-json-transformations'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

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
        var _this = this;
        var pItem = node;
        var _loop_1 = function (i) {
            if (pItem instanceof Array) {
                var list_1 = [];
                pItem.map(function (item) {
                    var x = _this._nodeOf(item[path[i]], path.slice(i + 1, path.length));
                    if (x && x !== null) {
                        list_1.push(x);
                    }
                });
                if (list_1.length) {
                    pItem = list_1;
                }
                return "break";
            }
            else {
                pItem = pItem ? pItem[path[i]] : pItem;
            }
        };
        for (var i = 0; i < this.path.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return pItem;
    };
    JXPath.prototype.valueOf = function (node) {
        return this._valueOf(node, this.path);
    };
    JXPath.prototype._valueOf = function (node, path) {
        var _this = this;
        var pItem = node;
        var _loop_2 = function (i) {
            if (pItem instanceof Array) {
                var list_2 = [];
                pItem.map(function (item) {
                    list_2.push(_this._valueOf(item[path[i]], path.slice(i + 1, path.length)));
                });
                pItem = list_2;
                return "break";
            }
            else if (path.length) {
                pItem = pItem ? pItem[path[i]] : pItem;
            }
            else {
                pItem = pItem;
            }
        };
        for (var i = 0; i < this.path.length; i++) {
            var state_2 = _loop_2(i);
            if (state_2 === "break")
                break;
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
    Inquirer.prototype.setRootNode = function (node) {
        this.rootNode = node;
        this.initPools(this.templates);
    };
    Inquirer.prototype.templateForName = function (name) {
        return this.templates[name];
    };
    Inquirer.prototype.nodeList = function (node) {
        var item = node === null ? this.rootNode : node;
        var list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            var x = Object.keys(item);
            list = [];
            x.map(function (xItem) {
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                }
                else {
                    list.push(item[xItem]);
                }
            });
        }
        return list;
    };
    Inquirer.prototype.query = function (command, node) {
        var _this = this;
        var mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            var list_3 = [];
            node.map(function (n) {
                list_3 = list_3.concat(_this.invoke(mothods, n));
            });
            return list_3;
        }
        return this.invoke(mothods, node);
    };
    Inquirer.prototype.invoke = function (method, node) {
        var _this = this;
        var list = [];
        if (typeof method === 'object') {
            if (method.args instanceof Array) {
                if (method.args.length)
                    method.args.map(function (arg) {
                        if (arg.name) {
                            list.push(_this.invoke(arg, node));
                        }
                        else {
                            list.push(arg);
                        }
                    });
            }
            else {
                list.push(method.args);
            }
            list.push(node);
            var f = this.supportedMethods[method.name];
            if (f) {
                list = f.apply(this, list);
            }
            else {
                list = method.name;
            }
        }
        else {
            list = method;
        }
        return list;
    };
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
                    left.map(function (item, index) {
                        var x = right.length > index ? right[index] : "";
                        result.push(item + delim + x);
                    });
                }
                else {
                    right.map(function (item, index) {
                        var x = left.length > index ? left[index] : "";
                        result.push(x + delim + item);
                    });
                }
            }
            else {
                left.map(function (item) {
                    result.push(item + delim + right);
                });
            }
        }
        else {
            if (right instanceof Array) {
                right.map(function (item) {
                    result.push(left + delim + item);
                });
            }
            else {
                result.push(left);
                result.push(delim);
                result.push(right);
            }
        }
        return result.join("");
    };
    Inquirer.prototype.split = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0] ? args[0].split(args[1]) : [];
    };
    Inquirer.prototype.valueOf = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var jpath = new JXPath(args[0]);
        return jpath.valueOf(args[1]);
    };
    Inquirer.prototype.each = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        args[0].map(function (item) {
            var method = {
                name: "valueOf",
                args: args[1]
            };
            list.push(_this.invoke(method, item));
        });
        return list;
    };
    Inquirer.prototype.enlist = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        args.slice(0, args.length - 1).map(function (item) {
            list.push(item);
        });
        return list;
    };
    Inquirer.prototype.join = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0].join(args[1]);
    };
    Inquirer.prototype.apply = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.match(args[0], args[1], "=", args[2], args[3]);
    };
    Inquirer.prototype.match = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templateForName(args[0]);
        if (!template) {
            throw "Missing Template definition for '" + args[0] + "'.";
        }
        var path = new JXPath(args[1]);
        var path2 = path.fromLast();
        var operation = args[2];
        var values = args[3];
        var nodes = this.templateNodes(template, args[4]);
        var list = [];
        if (nodes instanceof Array) {
            nodes.map(function (node) {
                var value = path.nodeOf(node);
                if (value instanceof Array) {
                    value.map(function (v) {
                        var x = path2.valueOf(v);
                        if (_this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    });
                }
                else {
                    var x = path2.valueOf(node);
                    if (_this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            });
        }
        else {
            var value = path.nodeOf(nodes);
            if (value instanceof Array) {
                value.map(function (v) {
                    var x = path2.valueOf(v);
                    if (_this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                });
            }
            else {
                var x = path2.valueOf(nodes);
                if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        }
        return this.style(args[0], list);
    };
    Inquirer.prototype.filter = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var path = new JXPath(args[0]);
        var operation = args[1];
        var values = args[2];
        var list = [];
        args[3].map(function (node) {
            var value = path.valueOf(node);
            if (value instanceof Array) {
                value.map(function (v) {
                    if (_this.evaluateOperation(v, operation, values)) {
                        list.push(node);
                    }
                });
            }
            else {
                if (_this.evaluateOperation(value, operation, values)) {
                    list.push(node);
                }
            }
        });
        return list;
    };
    Inquirer.prototype.select = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var path = new JXPath(args[0]);
        var list = [];
        if (args[1] instanceof Array) {
            args[1].map(function (node) {
                var value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            });
        }
        else {
            var value = path.nodeOf(args[1]);
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
    Inquirer.prototype.style = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templateForName(args[0]);
        if (!template) {
            throw "Missing Template definition for '" + args[0] + "'.";
        }
        var result = [];
        var attrs = Object.keys(template.style);
        args[1].map(function (item) {
            var node = {};
            attrs.map(function (attr) {
                node[attr] = _this.invoke(template.style[attr], item);
            });
            result.push(node);
        });
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
            throw "incorrect method call declaration. Missing ')'";
        }
        else if (i < 0 && j > 0) {
            throw "incorrect method call declaration. Missing '('";
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
        var n = nodes;
        if (template.context === "root") {
            if (!this.rootNode) {
                throw "Unable to find root node to perform operation.";
            }
            n = this.nodeList(this.rootNode);
        }
        if (template.match && template.match.length) {
            var path_1 = new JXPath(template.match);
            n.map(function (node) {
                if (path_1.valueOf(node) === template.value) {
                    list.push(node);
                }
            });
        }
        else if (nodes) {
            list = n;
        }
        return list;
    };
    Inquirer.prototype.evaluateOperation = function (left, operation, right) {
        var result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                right.map(function (k) {
                    if (left === k) {
                        result = true;
                    }
                });
            }
            else if (operation === "in") {
                right.map(function (k) {
                    if (k.indexOf(left) >= 0) {
                        result = true;
                    }
                });
            }
            else if (operation === "!") {
                var f_1 = false;
                right.map(function (k) {
                    if (left === k) {
                        f_1 = true;
                    }
                });
                result = !f_1;
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
    Inquirer.prototype.offPool = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var list = [];
        var pool = this.globalPool[args[0]];
        if (!pool) {
            throw "Attempting to access pool '" + args[0] + "' that is not created.";
        }
        if (args[1] instanceof Array) {
            args[1].map(function (key) {
                var x = pool[key];
                if (x) {
                    list.push(x);
                }
                else {
                }
            });
        }
        else {
            var x = pool[args[1]];
            if (x) {
                list.push(x);
            }
        }
        return list;
    };
    Inquirer.prototype.initTemplates = function (list) {
        var _this = this;
        list.map(function (template) {
            Object.keys(template.style).map(function (key) {
                template.style[key] = _this.toQueryOperation(template.style[key]);
            });
            _this.templates[template.name] = template;
        });
    };
    Inquirer.prototype.initPools = function (templates) {
        var _this = this;
        var list = Object.keys(templates);
        if (list.length === 0) {
            throw "Missing Template definitions.";
        }
        if (!this.rootNode) {
            throw "Unable to find root node to perform operation.";
        }
        this.globalPool = {};
        list.map(function (template) {
            var t = _this.templateForName(template);
            if (t.inPool) {
                var path = new JXPath(t.inPool);
                var path2_1 = path.fromLast();
                var nodes = path.nodeOf(_this.rootNode);
                _this.globalPool[t.name] = {};
                if (nodes instanceof Array) {
                    nodes.map(function (node) {
                        _this.globalPool[t.name][path2_1.valueOf(node)] = node;
                    });
                }
                else {
                    _this.globalPool[t.name][path2_1.valueOf(nodes)] = nodes;
                }
            }
        });
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
        var _this = this;
        var result = [];
        var template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            var list = this.inquirer.nodeList(null);
            var attrs_1 = Object.keys(template.style);
            list.map(function (item) {
                var node = {};
                attrs_1.map(function (attr) {
                    node[attr] = _this.inquirer.invoke(template.style[attr], item);
                });
                result.push(node);
            });
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
        this.ontransformation = new core.EventEmitter();
        this.onerror = new core.EventEmitter();
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
                this.onerror.emit(e.message);
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
    return XjsltComponent;
}());
XjsltComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'xjslt',
                template: "",
                styles: [],
            },] },
];
XjsltComponent.ctorParameters = function () { return []; };
XjsltComponent.propDecorators = {
    "node": [{ type: core.Input, args: ["node",] },],
    "transformations": [{ type: core.Input, args: ["transformations",] },],
    "ontransformation": [{ type: core.Output, args: ["ontransformation",] },],
    "onerror": [{ type: core.Output, args: ["onerror",] },],
};
var XjsltModule = /** @class */ (function () {
    function XjsltModule() {
    }
    return XjsltModule;
}());
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
            },] },
];
XjsltModule.ctorParameters = function () { return []; };

exports.XjsltComponent = XjsltComponent;
exports.Styler = Styler;
exports.JXPath = JXPath;
exports.Inquirer = Inquirer;
exports.XjsltModule = XjsltModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=extensible-json-transformations.umd.js.map
