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
var Styler = /** @class */ (function () {
    function Styler(transformations) {
        this.templates = {};
        this.globalPool = {};
        this.supportedMethods = {};
        this.transformations = transformations;
        this.registerMethods();
        this.prepareTransformations();
    }
    Styler.prototype.changeRootNode = function (node) {
        this.rootNode = node;
        this.globalPool = {};
        this.preparePools();
    };
    Styler.prototype.transform = function () {
        var _this = this;
        var result = [];
        var template = this.templates[this.transformations.rootTemplate];
        if (template) {
            var list = (this.rootNode instanceof Array) ? this.rootNode : Object.keys(this.rootNode);
            var attrs_1 = Object.keys(template.style);
            list.map(function (item) {
                var node = {};
                attrs_1.map(function (attr) {
                    node[attr] = _this.execute(template.style[attr], item);
                });
                result.push(node);
            });
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            var functions = this.parseFunctions(this.transformations.onResult);
            result = this.execute(functions, result);
        }
        return result;
    };
    Styler.prototype.apply = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.match(args[0], args[1], "=", args[2], args[3]);
    };
    Styler.prototype.execute = function (x, node) {
        var _this = this;
        var list = [];
        if (typeof x === 'object') {
            if (x.args instanceof Array) {
                if (x.args.length)
                    x.args.map(function (arg) {
                        if (arg.name) {
                            list.push(_this.execute(arg, node));
                        }
                        else {
                            list.push(arg);
                        }
                    });
            }
            else {
                list.push(x.args);
            }
            list.push(node);
            var f = this.supportedMethods[x.name];
            if (f) {
                list = f.apply(this, list);
            }
            else {
                list = x.name;
            }
        }
        else {
            list = x;
        }
        return list;
    };
    Styler.prototype.concatenate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.slice(0, args.length - 1).join("");
    };
    Styler.prototype.split = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0].split(args[1]);
    };
    Styler.prototype.valueOf = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var jpath = new JXPath(args[0]);
        return jpath.valueOf(args[1]);
    };
    Styler.prototype.each = function () {
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
            list.push(_this.execute(method, item));
        });
        return list;
    };
    Styler.prototype.enlist = function () {
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
    Styler.prototype.join = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0].join(args[1]);
    };
    Styler.prototype.evaluateOperation = function (left, operation, right) {
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
    Styler.prototype.templateNodes = function (template, nodes) {
        var list = [];
        var n = (this.rootNode instanceof Array) ? this.rootNode : Object.keys(this.rootNode);
        n = (template.context === "root") ? n : nodes;
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
    Styler.prototype.match = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templates[args[0]];
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
    Styler.prototype.filter = function () {
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
    Styler.prototype.select = function () {
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
    Styler.prototype.style = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template = this.templates[args[0]];
        var result = [];
        var attrs = Object.keys(template.style);
        args[1].map(function (item) {
            var node = {};
            attrs.map(function (attr) {
                node[attr] = _this.execute(template.style[attr], item);
            });
            result.push(node);
        });
        return result;
    };
    Styler.prototype.offPool = function () {
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
    Styler.prototype.registerMethods = function () {
        this.supportedMethods["apply"] = this.apply;
        this.supportedMethods["valueOf"] = this.valueOf;
        this.supportedMethods["each"] = this.each;
        this.supportedMethods["split"] = this.split;
        this.supportedMethods["concat"] = this.concatenate;
        this.supportedMethods["enlist"] = this.enlist;
        this.supportedMethods["join"] = this.join;
        this.supportedMethods["match"] = this.match;
        this.supportedMethods["filter"] = this.filter;
        this.supportedMethods["select"] = this.select;
        this.supportedMethods["style"] = this.style;
        this.supportedMethods["offPool"] = this.offPool;
    };
    Styler.prototype.prepareTransformations = function () {
        var _this = this;
        var list = this.transformations.templates;
        list.map(function (template) {
            Object.keys(template.style).map(function (key) {
                template.style[key] = _this.parseFunctions(template.style[key]);
            });
            _this.templates[template.name] = template;
        });
    };
    Styler.prototype.preparePools = function () {
        var _this = this;
        var list = Object.keys(this.templates);
        list.map(function (template) {
            var t = _this.templates[template];
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
    Styler.prototype.removeQuotes = function (str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    };
    Styler.prototype.parseFunctions = function (item) {
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
                        json["args"] = this.parseFunctions(item.substring(i + 1, j));
                    }
                    else {
                        if (!isArry) {
                            json = [];
                        }
                        json.push({
                            name: item.substring(k + 1, i),
                            args: this.parseFunctions(item.substring(i + 1, j))
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
                                name: this.removeQuotes(item.substring(k + 1, cindex)),
                                args: []
                            });
                        }
                        k = cindex;
                    }
                    else if ((item[cindex - 1] === '\'' || (item[cindex - 1] === ' ' && item[cindex - 2] === '\'')) &&
                        (((cindex < item.length - 1) && item[cindex + 1] === '\'') ||
                            ((cindex < item.length - 2) && item[cindex + 1] === ' ' && item[cindex + 2] === '\''))) {
                        if (json instanceof Array) {
                            json.push(",");
                        }
                        else {
                            json.args.push(",");
                        }
                        k = cindex + 1;
                    }
                    else {
                        var x = item.substring(k + 1, cindex);
                        if (x.indexOf('\'') < 0) {
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
                json.push(this.removeQuotes(item.substring(k + 1, item.length).trim()));
            }
            else {
                json.args.push(this.removeQuotes(item.substring(k + 1, item.length).trim()));
            }
        }
        return json;
    };
    return Styler;
}());
var XjsltComponent = /** @class */ (function () {
    function XjsltComponent() {
        this.node = {};
        this.ontransformation = new core.EventEmitter();
    }
    XjsltComponent.prototype.ngOnInit = function () {
        if (this.node && this.transformations) {
            if (!this.styler) {
                this.styler = new Styler(this.transformations);
            }
            this.styler.changeRootNode(this.node);
            this.ontransformation.emit(this.styler.transform());
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
exports.XjsltModule = XjsltModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=extensible-json-transformations.umd.js.map
