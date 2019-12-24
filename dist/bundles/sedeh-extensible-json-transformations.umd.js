(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@sedeh/extensible-json-transformations', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.sedeh = global.sedeh || {}, global.sedeh['extensible-json-transformations'] = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

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
            core.Input("node")
        ], XjsltComponent.prototype, "node", void 0);
        __decorate([
            core.Input("transformations")
        ], XjsltComponent.prototype, "transformations", void 0);
        __decorate([
            core.Output("ontransformation")
        ], XjsltComponent.prototype, "ontransformation", void 0);
        __decorate([
            core.Output("onerror")
        ], XjsltComponent.prototype, "onerror", void 0);
        XjsltComponent = __decorate([
            core.Component({
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
            core.NgModule({
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
            })
        ], XjsltModule);
        return XjsltModule;
    }());

    exports.Inquirer = Inquirer;
    exports.JXPath = JXPath;
    exports.Styler = Styler;
    exports.XjsltComponent = XjsltComponent;
    exports.XjsltModule = XjsltModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sedeh-extensible-json-transformations.umd.js.map
