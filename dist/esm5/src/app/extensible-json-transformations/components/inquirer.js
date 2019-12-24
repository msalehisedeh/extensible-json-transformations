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
export { JXPath };
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
export { Inquirer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQWlCSDtJQUVJLGdCQUFZLEtBQUs7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELHlCQUFRLEdBQVI7UUFDSSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0QsdUJBQU0sR0FBTixVQUFPLElBQUk7UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ08sd0JBQU8sR0FBZixVQUFnQixJQUFJLEVBQUUsSUFBYztRQUNoQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtnQkFDeEIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO3dCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNoQjtpQkFDSjtnQkFBQSxDQUFDO2dCQUNGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDYixLQUFLLEdBQUcsSUFBSSxDQUFDO2lCQUNoQjtnQkFDRCxNQUFNO2FBQ1Q7aUJBQU07Z0JBQ0gsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDMUM7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRCx3QkFBTyxHQUFQLFVBQVEsSUFBSTtRQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDTyx5QkFBUSxHQUFoQixVQUFpQixJQUFJLEVBQUUsSUFBYztRQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtnQkFDMUIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEU7Z0JBQ0QsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDYixNQUFNO2FBQ1A7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUMxQztpQkFBTTtnQkFDRixLQUFLLEdBQUcsS0FBSyxDQUFDO2FBQ2xCO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ0wsYUFBQztBQUFELENBQUMsQUF2REQsSUF1REM7O0FBRUQ7SUFTSTtRQVBRLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN0QixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBR2YsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixhQUFRLEdBQUcsRUFBRSxDQUFDLENBQUEsK0NBQStDO1FBR2pFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTyw0QkFBUyxHQUFqQixVQUFrQixJQUFZO1FBQzFCLElBQUksQ0FBQyxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNKLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELDhCQUFXLEdBQVgsVUFBWSxJQUFRO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsaUNBQWMsR0FBZCxVQUFlLElBQUk7UUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBQ0Qsa0NBQWUsR0FBZixVQUFnQixJQUFJO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsMkNBQTJDO0lBQzNDLDJCQUFRLEdBQVIsVUFBUyxJQUFJO1FBQ1QsSUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDO1FBRVQsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxJQUFJLENBQUM7U0FDZDthQUFNO1lBQ0gsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hDLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksS0FBSyxFQUFFO29CQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbkM7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDMUI7YUFDSjtTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDakIsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCx3QkFBSyxHQUFMLFVBQU0sT0FBYyxFQUFFLElBQUk7UUFDdEIsSUFBTSxPQUFPLEdBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlDLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtZQUN2QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO2FBQ3JEO1lBQUEsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxzREFBc0Q7SUFDdEQseUJBQU0sR0FBTixVQUFPLFNBQXdCLEVBQUUsSUFBSTtRQUNqQyxJQUFJLElBQUksR0FBTyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzVFLElBQUksR0FBRyxFQUFFLENBQUM7U0FDYjthQUFNLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQ3RDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLEVBQUU7Z0JBQ0gsSUFBSSxTQUFTLENBQUMsSUFBSSxZQUFZLEtBQUssRUFBRTtvQkFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM1QyxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM3QixJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO3lCQUNyQzs2QkFBTTs0QkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQjtxQkFDSjtpQkFDSjtxQkFBTTtvQkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsbUJBQW1CO2dCQUNuQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDeEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQzthQUNqQztpQkFBTTtnQkFDSCxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQzthQUN6QjtTQUNKO2FBQU07WUFDSCxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxtQkFBbUI7SUFDbkIsOEJBQVcsR0FBWDtRQUFZLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ2YsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQU0sS0FBSyxHQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFNLEtBQUssR0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtZQUN2QixJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDdEU7b0JBQUEsQ0FBQztpQkFDTDtxQkFBTTtvQkFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDckU7b0JBQUEsQ0FBQztpQkFDTDthQUNKO2lCQUFNO2dCQUNILEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7aUJBQ3pDO2dCQUFBLENBQUM7YUFDTDtTQUNKO2FBQU07WUFDSCxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pDO2dCQUFBLENBQUM7YUFDTDtpQkFBTTtnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFDckM7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCw0Q0FBNEM7SUFDNUMsNkJBQTZCO0lBQzdCLHdCQUFLLEdBQUw7UUFBTSxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLHlCQUFPOztRQUNULE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUNELG1EQUFtRDtJQUNuRCw2Q0FBNkM7SUFDN0MsMEJBQU8sR0FBUDtRQUFRLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1gsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCx1RUFBdUU7SUFDdkUsbURBQW1EO0lBQ25ELHVCQUFJLEdBQUo7UUFBSyxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLHlCQUFPOztRQUNSLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFNLE1BQU0sR0FBRyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBRWhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFBQSxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELGtEQUFrRDtJQUNsRCx5QkFBTSxHQUFOO1FBQU8sY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDVixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFDLElBQUk7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsb0RBQW9EO1FBQ3pFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELHlEQUF5RDtJQUN6RCx1QkFBSSxHQUFKO1FBQUssY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDUixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELGlGQUFpRjtJQUNqRixxREFBcUQ7SUFDckQsd0JBQUssR0FBTDtRQUFNLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLEtBQUssR0FBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO2dCQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkMsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUFFO3dCQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNoQjtpQkFDSjthQUNKO2lCQUFNO2dCQUNILElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ25CO2FBQ0o7U0FDSjtRQUFBLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0Qsd0RBQXdEO0lBQ3hELHVGQUF1RjtJQUN2Rix3QkFBSyxHQUFMO1FBQU0sY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDVCxJQUFNLFFBQVEsR0FBWSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNO2dCQUNGLE9BQU8sRUFBRSxtQ0FBbUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtnQkFDN0QsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSzthQUMzQixDQUFDO1NBQ0w7UUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sS0FBSyxHQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM1RCxJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtvQkFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ25DLElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTs0QkFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDaEI7cUJBQ0o7aUJBQ0o7cUJBQU07b0JBQ0gsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTt3QkFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbkI7aUJBQ0o7YUFDSjtZQUFBLENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7d0JBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hCO2lCQUNKO2FBQ0o7aUJBQU07Z0JBQ0gsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTtvQkFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDcEI7YUFDSjtTQUVKO1FBQ0YsT0FBTyxJQUFJLENBQUM7SUFDZixDQUFDO0lBQ0QseUVBQXlFO0lBQ3pFLHNMQUFzTDtJQUN0TCx5QkFBTSxHQUFOO1FBQU8sY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDVixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO2dCQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkMsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFO3dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNuQjtpQkFDSjthQUNKO2lCQUFNO2dCQUNILElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ25CO2FBQ0o7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxvRUFBb0U7SUFDcEUseUJBQU0sR0FBTjtRQUFPLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1YsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkI7YUFDSjtTQUNKO2FBQU07WUFDSCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1QyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUN2QixJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7b0JBQ3hCLElBQUksR0FBRyxLQUFLLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNILElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3BCO2FBQ0o7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCx1RUFBdUU7SUFDdkUsd0JBQUssR0FBTDtRQUFNLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1QsSUFBTSxRQUFRLEdBQVksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsTUFBTTtnQkFDRixPQUFPLEVBQUUsbUNBQW1DLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7Z0JBQzdELEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7YUFDM0IsQ0FBQztTQUNMO1FBRUQsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssRUFBRTtZQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3hEO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckI7U0FDSjthQUFNO1lBQ0gsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0Q7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNELHNDQUFtQixHQUFuQixVQUFvQixJQUFJLEVBQUUsTUFBTTtRQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3pDLENBQUM7SUFDUSwrQkFBWSxHQUFwQixVQUFxQixHQUFHO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMvRyxDQUFDO0lBQ0QsbUNBQWdCLEdBQWhCLFVBQWlCLE9BQU87UUFDcEIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxVQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUN4RSxJQUFJLEVBQUUsRUFBRTtnQkFDSixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNO2dCQUNILE9BQU8sRUFBRSxDQUFDO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsS0FBSztZQUNsQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDTyw4QkFBVyxHQUFuQixVQUFvQixJQUFJO1FBQ3BCLHFHQUFxRztRQUNyRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLElBQUksR0FBUSxFQUFFLENBQUM7UUFDbkIsS0FBSyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDakQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ1QsQ0FBQyxHQUFHLE1BQU0sQ0FBQztpQkFDZDtnQkFDRCxDQUFDLEVBQUUsQ0FBQzthQUNQO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDN0IsQ0FBQyxFQUFFLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDO29CQUNSLElBQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDO29CQUV2QyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNYLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzFEO3lCQUFNO3dCQUNILElBQUksQ0FBQyxNQUFNLEVBQUU7NEJBQ1QsSUFBSSxHQUFHLEVBQUUsQ0FBQzt5QkFDYjt3QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDOzRCQUNOLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2hELENBQUMsQ0FBQztxQkFDTjtpQkFDSjthQUNKO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDN0IsSUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUM7b0JBRXZDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDUCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQ1AsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQ0FDVCxJQUFJLEdBQUcsRUFBRSxDQUFDOzZCQUNiOzRCQUNELElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ04sSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0NBQ3ZFLElBQUksRUFBRSxFQUFFOzZCQUNYLENBQUMsQ0FBQzt5QkFDTjt3QkFDRCxDQUFDLEdBQUcsTUFBTSxDQUFDO3FCQUNkO3lCQUFNO3dCQUNILElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDNUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTs0QkFDcEIsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO2dDQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNoQjtpQ0FBTTtnQ0FDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDckI7eUJBQ0o7d0JBQ0QsQ0FBQyxHQUFHLE1BQU0sQ0FBQztxQkFDZDtpQkFDSjtxQkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNwQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2lCQUNkO2FBQ0o7U0FDSjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLE1BQU07Z0JBQ0YsT0FBTyxFQUFFLGdEQUFnRDtnQkFDekQsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSzthQUMzQixDQUFDO1NBQ0w7YUFBTSxJQUFJLENBQUMsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRTtZQUNuQixNQUFNO2dCQUNGLE9BQU8sRUFBRSxnREFBZ0Q7Z0JBQ3pELEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7YUFDM0IsQ0FBQztTQUNMO2FBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvQixPQUFPLElBQUksQ0FBQztTQUNmO2FBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO2dCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyRjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUY7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQ0FBYSxHQUFiLFVBQWMsUUFBaUIsRUFBRSxLQUFLO1FBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUVyQixJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO1lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNoQixNQUFNO29CQUNGLE9BQU8sRUFBQyxnREFBZ0Q7b0JBQ3hELEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7aUJBQzNCLENBQUM7YUFDTDtZQUNELFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzQztRQUNELElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN6QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtvQkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkI7YUFDSjtTQUNKO2FBQU0sSUFBSSxLQUFLLEVBQUU7WUFDZCxJQUFJLEdBQUcsUUFBUSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELGdGQUFnRjtJQUNoRixpRUFBaUU7SUFDekQsb0NBQWlCLEdBQXpCLFVBQTBCLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSztRQUM1QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQ3hCLElBQUksU0FBUyxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQzVCLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQzt3QkFDakIsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDZCxNQUFNO3FCQUNUO2lCQUNKO2FBQ0o7aUJBQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUMzQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztvQkFDNUIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQzt3QkFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDZCxNQUFNO3FCQUNUO2lCQUNKO2dCQUFBLENBQUM7YUFDTDtpQkFBTSxJQUFJLFNBQVMsS0FBSyxHQUFHLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDZCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztvQkFDNUIsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO3dCQUNqQixDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUNULE1BQU07cUJBQ1Q7aUJBQ0o7Z0JBQUEsQ0FBQztnQkFDRixNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDZjtTQUVKO2FBQU07WUFDSCxJQUFJLFNBQVMsS0FBSyxHQUFHLEVBQUU7Z0JBQ25CLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQzthQUM1QjtpQkFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7Z0JBQzNCLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDdkM7aUJBQU0sSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO2dCQUMxQixNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO2dCQUMxQixNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDbkQ7aUJBQU0sSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO2dCQUMxQixNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDbkQ7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCwrRkFBK0Y7SUFDdkYsMEJBQU8sR0FBZjtRQUFnQixjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLHlCQUFPOztRQUNuQixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU07Z0JBQ0YsT0FBTyxFQUFFLDZCQUE2QixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyx3QkFBd0I7Z0JBQzNFLEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7YUFDM0IsQ0FBQztTQUNMO1FBQ0QsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFDO1lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxJQUFJLEVBQUU7b0JBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkI7cUJBQU07b0JBQ0gsd0JBQXdCO2lCQUMzQjthQUNKO1NBQ0o7YUFBTTtZQUNILElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QixJQUFJLElBQUksRUFBRTtnQkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsZ0NBQWEsR0FBYixVQUFjLElBQUk7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUMvQixJQUFNLFFBQVEsR0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7b0JBQzVCLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN2RDthQUNKO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQzVDO0lBQ0wsQ0FBQztJQUNELDRCQUFTLEdBQVQsVUFBVSxTQUFTO1FBQ2YsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU07Z0JBQ0YsT0FBTyxFQUFFLCtCQUErQjtnQkFDeEMsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSzthQUMzQixDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixNQUFNO2dCQUNGLE9BQU8sRUFBRSxnREFBZ0Q7Z0JBQ3pELEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7YUFDM0IsQ0FBQztTQUNMO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFckIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDL0IsSUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNWLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLElBQU0sS0FBSyxHQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JCLElBQU0sS0FBSyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzNCLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7b0JBQ2xCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXBDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO3dCQUNoQyxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFOzRCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMzQztxQkFDSjtpQkFDSjtxQkFBTTtvQkFDSCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQzt3QkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzNDO2lCQUNKO2dCQUNELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNsQztTQUNKO0lBQ0wsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQUFDLEFBNW1CRCxJQTRtQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBJbnRlbnRpb25hbGx5IGF2b2lkaW5nIHVzZSBvZiBtYXAgY2FsbCBvbiBsaXN0IHRvIHJlZHVjZSB0aGUgY2FsbCBzdGFjayBudW1iZXJzLlxyXG4gKiBPbiBsYXJnZSBzY2FsZSBKU09OLCBjYWxsIHN0YWNrIGJlY29tZXMgYSBwcm9ibGVtIHRvIGJlIGF2b2lkZWQuXHJcbiAqL1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgbWF0Y2g/OiBzdHJpbmcsXHJcbiAgICB2YWx1ZT86IHN0cmluZyxcclxuICAgIGNvbnRleHQ6IHN0cmluZyxcclxuICAgIGluUG9vbD86IHN0cmluZyxcclxuICAgIHN0eWxlOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wZXJhdGlvbiB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBhcmdzPzogUXVlcnlPcGVyYXRpb25bXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSlhQYXRoIHtcclxuICAgIHByaXZhdGUgcGF0aDtcclxuICAgIGNvbnN0cnVjdG9yKGpwYXRoKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBqcGF0aC5zcGxpdChcIi5cIik7XHJcbiAgICB9XHJcbiAgICBmcm9tTGFzdCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEpYUGF0aCh0aGlzLnBhdGhbdGhpcy5wYXRoLmxlbmd0aCAtIDFdKTtcclxuICAgIH1cclxuICAgIG5vZGVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVPZihub2RlLCB0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfbm9kZU9mKG5vZGUsIHBhdGg6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHBJdGVtID0gbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGF0aC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocEl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCB0aGlzLnBhdGgubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX25vZGVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ICYmIHggIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwSXRlbSA9IGxpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW0gPyBwSXRlbVtwYXRoW2ldXSA6IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxuICAgIHZhbHVlT2Yobm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF92YWx1ZU9mKG5vZGUsIHBhdGg6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHBJdGVtID0gbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGF0aC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocEl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBJdGVtW3FdO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3ZhbHVlT2YoaXRlbVtwYXRoW2ldXSwgcGF0aC5zbGljZShpKzEscGF0aC5sZW5ndGgpKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcEl0ZW07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnF1aXJlciAge1xyXG5cclxuICAgIHByaXZhdGUgc3VwcG9ydGVkTWV0aG9kcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZXMgPSB7fTtcclxuICAgIHByaXZhdGUgcm9vdE5vZGU7XHJcbiAgICBwcml2YXRlIGNvbnRleHROb2RlOyAvLyBzaG91bGQgYmUgc2V0IGJlZm9yZSBhbnkgY2FsbCBpcyBtYWRlLi4uIHRoaXMgaXMgdG8gYXZvaWQgY2FsbCBzdGFjayBvdmVyZmxvdyBpbiBleHRyZW1lbHQgbGFyZ2UgSlNPTlxyXG4gICAgcHJpdmF0ZSBnbG9iYWxQb29sID0ge307XHJcbiAgICBwcml2YXRlIHBhdGhQb29sID0ge307Ly8gdG8gYXZvaWQgc3RhY2tvdmVyZmxvdy4uLiBhbmQgcGVyZm9ybSBmYXN0ZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJ2YWx1ZU9mXCIsIHRoaXMudmFsdWVPZik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZWFjaFwiLCB0aGlzLmVhY2gpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNwbGl0XCIsIHRoaXMuc3BsaXQpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImNvbmNhdFwiLCB0aGlzLmNvbmNhdGVuYXRlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlbmxpc3RcIiwgdGhpcy5lbmxpc3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImpvaW5cIiwgdGhpcy5qb2luKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3R5bGVcIiwgdGhpcy5zdHlsZSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwibWF0Y2hcIiwgdGhpcy5tYXRjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiYXBwbHlcIiwgdGhpcy5hcHBseSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZmlsdGVyXCIsIHRoaXMuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcIm9mZlBvb2xcIiwgdGhpcy5vZmZQb29sKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGpYUGF0aEZvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgcDpKWFBhdGggPSB0aGlzLnBhdGhQb29sW3BhdGhdO1xyXG4gICAgICAgIGlmICghcCkge1xyXG4gICAgICAgICAgICBwID0gbmV3IEpYUGF0aChwYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5wYXRoUG9vbFtwYXRoXSA9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5yb290Tm9kZSA9IHRoaXMubm9kZUxpc3Qobm9kZSk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9vbHModGhpcy50ZW1wbGF0ZXMpO1xyXG4gICAgfVxyXG4gICAgc2V0Q29udGV4dE5vZGUobm9kZSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgdGVtcGxhdGVGb3JOYW1lKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNbbmFtZV07XHJcbiAgICB9XHJcbiAgICAvLyBpZiBub2RlIGlzIG51bGwsIHJvb3Qgbm9kZSB3aWxsIGJlIHVzZWQuXHJcbiAgICBub2RlTGlzdChub2RlKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IG5vZGUgPT09IG51bGwgPyB0aGlzLnJvb3ROb2RlIDogbm9kZTtcclxuICAgICAgICBsZXQgbGlzdDtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsaXN0ID0gaXRlbTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgIGNvbnN0IHggPSBPYmplY3Qua2V5cyhpdGVtKTtcclxuICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgeC5sZW5ndGg7IHQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeEl0ZW0gPSB4W3RdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1beEl0ZW1dIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoaXRlbVt4SXRlbV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goaXRlbVt4SXRlbV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgb2YgbmVzdGVkIGZ1bmN0aW9uIGNhbGxzIG9uIHRoZSBnaXZlbiBub2RlLlxyXG4gICAgcXVlcnkoY29tbWFuZDpzdHJpbmcsIG5vZGUpIHtcclxuICAgICAgICBjb25zdCBtb3Rob2RzID10aGlzLnRvUXVlcnlPcGVyYXRpb24oY29tbWFuZCk7XHJcblxyXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBub2RlLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlSXRlbSA9IG5vZGVbcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQodGhpcy5pbnZva2UobW90aG9kcywgbm9kZUl0ZW0pKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKG1vdGhvZHMsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBlcmZvcm1zIHF1ZXJ5IHdpdGggZ2l2ZW4gbGlzdCBvZiBxdWVyeSBvcGVydGF0aW9uc1xyXG4gICAgaW52b2tlKG9wZXJhdGlvbjpRdWVyeU9wZXJhdGlvbiwgbm9kZSkge1xyXG4gICAgICAgIGxldCBsaXN0OmFueSA9IFtdO1xyXG4gICAgICAgIGlmICgodHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIpICYmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpICYmIG5vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcGVyYXRpb24gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSB0aGlzLnN1cHBvcnRlZE1ldGhvZHNbb3BlcmF0aW9uLm5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5hcmdzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IG9wZXJhdGlvbi5hcmdzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZyA9IG9wZXJhdGlvbi5hcmdzW2FdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuaW52b2tlKGFyZywgbm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChvcGVyYXRpb24uYXJncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0Tm9kZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGYuYXBwbHkodGhpcywgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gb2xkQ29udGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBvcGVyYXRpb24ubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBvcGVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbmNhdGVuYXRlKGEsIGIsIGMpOiBqb2lucyBhcmd1bWVudHMgaW50byBhIHN0cmluZ1xyXG4gICAgLy8gam9pbiBhcmdzWzAsMSwyXVxyXG4gICAgY29uY2F0ZW5hdGUoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxlZnQgPSBhcmdzWzBdO1xyXG4gICAgICAgIGNvbnN0IGRlbGltPSBhcmdzWzFdO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0PSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBpZiAobGVmdCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdC5sZW5ndGggPiByaWdodC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGxlZnQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnRbcV0gKyBkZWxpbSArIChyaWdodC5sZW5ndGggPiBxID8gcmlnaHRbcV0gOiBcIlwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCByaWdodC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggKGxlZnQubGVuZ3RoID4gcSA/IGxlZnRbcV0gOiBcIlwiKSArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGxlZnQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgcmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnQgKyBkZWxpbSArIHJpZ2h0W3FdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsZWZ0ICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPiAxID8gcmVzdWx0IDogcmVzdWx0WzBdO1xyXG4gICAgfVxyXG4gICAgLy8gc3BsaXQoaXRlbSwnLCcpOiBzcGxpdHMgdmFsdWUgaW50byBhIGxpc3RcclxuICAgIC8vIHNwbGl0IGFyZ3NbMF0gd2l0aCBhcmdzWzFdXHJcbiAgICBzcGxpdCguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0gPyBhcmdzWzBdLnNwbGl0KGFyZ3NbMV0pIDogW107XHJcbiAgICB9XHJcbiAgICAvLyB2YWx1ZU9mKHBhdGgpOiAgZXZhbHVhdGVzIHZhbHVlIG9mIGFyZ3VtZW50IHBhdGhcclxuICAgIC8vIHBhdGggPSBhcmdzWzBdLCBub2RlIHRvIGV2YWx1YXRlID0gYXJnc1sxXVxyXG4gICAgdmFsdWVPZiguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QganBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICByZXR1cm4ganBhdGgudmFsdWVPZih0aGlzLmNvbnRleHROb2RlKTtcclxuICAgIH1cclxuICAgIC8vIGVhY2gobGlzdCxtZXRob2QpOiBGb3IgZWFjaCBpdGVtIGluIGxpc3QsIGludm9kZSB0aGUgY2FsbGJhY2sgbWV0aG9kXHJcbiAgICAvLyBlYWNoIGl0ZW0gb2YgYXJnc1swXSBleGVjdXRlIGZ1bmN0aW9uIG9mIGFyZ3NbMV1cclxuICAgIGVhY2goLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSB7bmFtZTogXCJ2YWx1ZU9mXCIsIGFyZ3M6IGFyZ3NbMV19O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgYXJnc1swXS5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gYXJnc1swXVtxXTtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuaW52b2tlKG1ldGhvZCwgbm9kZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBlbmxpc3QoLi4uKTogaW5zZXJ0IGFyZ3VtZW50IHZhbHVlcyBpbnRvIGEgbGlzdFxyXG4gICAgZW5saXN0KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgYXJncy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChpdGVtKTsgLy8gbWFrZSBzdXJlIGxhc3QgdHdvIGl0ZW0gYXJlIG5vdCBub2RlIGFuZCB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBqb2luKGFycmF5LCcsJyk6IGpvaW5zIGl0ZW1zIG9mIHRoZSBsaXN0IGludG8gYSBzdHJpbmdcclxuICAgIGpvaW4oLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBhcmdzWzBdLmxlbmd0aCA+IDEgPyBhcmdzWzBdLmpvaW4oYXJnc1sxXSkgOiBhcmdzWzBdO1xyXG4gICAgfVxyXG4gICAgLy8gYXBwbHkodGVtcGxhdGUscGF0aCxhcnJheSk6IGFwcGx5IHRoZSB0ZW1wbGF0ZSBpbiByb290IGNvbnRleHQgZm9yIGVhY2ggdmFsdWUgXHJcbiAgICAvLyB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHBhdGguIGFyZ3NbMF0gbmFtZSB0byBhcHBseVxyXG4gICAgYXBwbHkoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbMl07XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLnJvb3ROb2RlLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnJvb3ROb2RlW2NdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LFwiPVwiLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsaXN0ID0gdGhpcy5zdHlsZShhcmdzWzBdLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBtYXRjaCh0ZW1wbGF0ZSxwYXRoLG9wZXJhdGlvbix2YWx1ZXMpOiAsIG5vZGUgYXJnc1s0XVxyXG4gICAgLy8gZm9yIHZhbHVlIG9mIHRhcmdldCBpbiBnaXZlbiB0ZW1wbGF0ZSBub2RlcywgZXZhbHVhdGUgb3BlcmF0aW9uIGZvciBnaXZlbiB2YWx1ZShzKS4gXHJcbiAgICBtYXRjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1sxXSk7XHJcbiAgICAgICAgY29uc3QgcGF0aDI9IHBhdGguZnJvbUxhc3QoKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbM107XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLnRlbXBsYXRlTm9kZXModGVtcGxhdGUsIHRoaXMuY29udGV4dE5vZGUpXHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgbm9kZXMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGVzKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGVzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gZmlsdGVyKHBhdGgsb3BlcmF0aW9uLHZhbHVlKTogZm9yIHZhbHVlIG9mIHRhcmdldCBpbiBjdXJyZW50IGNvbnRleHQsIFxyXG4gICAgLy8gZXZhbHVhdGUgb3BlcmF0aW9uIGZvciBnaXZlbiB2YWx1ZShzKS4gU3VwcG9ydGVkIG9wZXJhdGlvbnMgYXJlIGA9LDwsPixpbiwhYC4gJ2luJyBmb3IgbGlzdCB2YWx1ZXMgbWVhbiBjb250YWlucyBhbmQgZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIGZpbHRlciguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCB0aGlzLmNvbnRleHROb2RlLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2FdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odixvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHZhbHVlLG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHNlbGVjdChwYXRoKTogc2VsZWN0IHRoZSBub2RlcyB3aXRoIGdpdmVuIHBhdGggaW4gY3VycmVudCBjb250ZXh0XHJcbiAgICBzZWxlY3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHROb2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB0aGlzLmNvbnRleHROb2RlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb250ZXh0Tm9kZVtkXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZih0aGlzLmNvbnRleHROb2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBzdHlsZSh0ZW1wbGF0ZSwgYXJyYXkpOiBhcHBseSB0aGUgZ2l2ZW4gdGVtcGxhdGUgZm9yIHRoZSBnaXZlbiBhcnJheVxyXG4gICAgc3R5bGUoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUoYXJnc1swXSk7XHJcblxyXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb24gZm9yICdcIiArIGFyZ3NbMF0gKyBcIicuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKGFyZ3NbMV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGFyZ3NbMV0ubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhcmdzWzFdW2FdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tkXTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlW2F0dHJdID0gdGhpcy5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgYXR0cnMubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tkXTtcclxuICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgYXJnc1sxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBhZGRTdXBwb3J0aW5nTWV0aG9kKG5hbWUsIG1ldGhvZCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tuYW1lXSA9IG1ldGhvZDtcclxuICAgIH1cclxuICAgICBwcml2YXRlIHJlbW92ZVF1b3RlcyhzdHIpIHtcclxuICAgICAgICByZXR1cm4gKHN0ci5sZW5ndGggJiYgc3RyWzBdID09PSAnXFwnJyAmJiBzdHJbc3RyLmxlbmd0aC0xXSA9PT0gJ1xcJycpID8gc3RyLnN1YnN0cmluZygxLHN0ci5sZW5ndGgtMSkgOiBzdHI7XHJcbiAgICB9XHJcbiAgICB0b1F1ZXJ5T3BlcmF0aW9uKG1ldGhvZHMpIHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gbWV0aG9kcy5yZXBsYWNlKC8oW14nXSspfCgnW14nXSsnKS9nLCBmdW5jdGlvbigkMCwgJDEsICQyKSB7XHJcbiAgICAgICAgICAgIGlmICgkMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQxLnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDI7IFxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH0pLnJlcGxhY2UoLydbXiddKycvZywgZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaC5yZXBsYWNlKC8sL2csICd+Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9GdW5jdGlvbnMob3BlcmF0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRvRnVuY3Rpb25zKGl0ZW0pe1xyXG4gICAgICAgIC8vIGlmIGl0ZW0gPSBqb2luKGVubGlzdCh2YWx1ZU9mKGFkZHJlc3Muc3RyZWV0KSx2YWx1ZU9mKGFkZHJlc3MuY2l0eSksdmFsdWVPZihhZGRyZXNzLnppcGNvZGUpKSwnLCcpXHJcbiAgICAgICAgbGV0IGkgPSAtMTtcclxuICAgICAgICBsZXQgaiA9IC0xO1xyXG4gICAgICAgIGxldCBrID0gLTE7XHJcbiAgICAgICAgbGV0IGMgPSAwO1xyXG4gICAgICAgIGxldCBqc29uOiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBjaW5kZXggPSAwOyBjaW5kZXggPCBpdGVtLmxlbmd0aDsgY2luZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJygnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjKys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnKScpIHtcclxuICAgICAgICAgICAgICAgIGMtLTtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaiA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSAmJiAoaiA9PT0gKGl0ZW0ubGVuZ3RoIC0gMSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bXCJuYW1lXCJdID0gaXRlbS5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bXCJhcmdzXCJdID0gdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpdGVtLnN1YnN0cmluZyhrKzEsIGkpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IHRoaXMudG9GdW5jdGlvbnMoaXRlbS5zdWJzdHJpbmcoaSsxLGopKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCAmJiAoY2luZGV4LTEgIT09IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBcnJ5ID0gKGpzb24gaW5zdGFuY2VvZiBBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBjaW5kZXgpLnJlcGxhY2UoL34vZywgJywnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4LmluZGV4T2YoJygnKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uYXJncy5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAwICYmIChjaW5kZXgtMSA9PT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpID49IDAgJiYgaiA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJpbmNvcnJlY3QgbWV0aG9kIGNhbGwgZGVjbGFyYXRpb24uIE1pc3NpbmcgJyknXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGk8MCAmJiBqPjApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJpbmNvcnJlY3QgbWV0aG9kIGNhbGwgZGVjbGFyYXRpb24uIE1pc3NpbmcgJygnXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9ZWxzZSBpZiAoaSA8IDAgJiYgaiA8IDAgJiYgayA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfWVsc2UgaWYgKGMgPT09IDAgJiYgayA+IGopIHtcclxuICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAganNvbi5wdXNoKHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgaXRlbS5sZW5ndGgpLnJlcGxhY2UoL34vZywgJywnKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcblxyXG4gICAgdGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZTpUZW1wbGF0ZSwgbm9kZXMpIHtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGxldCBub2RlTGlzdCA9IG5vZGVzO1xyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGUuY29udGV4dCA9PT0gXCJyb290XCIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTpcIlVuYWJsZSB0byBmaW5kIHJvb3Qgbm9kZSB0byBwZXJmb3JtIG9wZXJhdGlvbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZUxpc3QgPSB0aGlzLm5vZGVMaXN0KHRoaXMucm9vdE5vZGUpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLm1hdGNoICYmIHRlbXBsYXRlLm1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IodGVtcGxhdGUubWF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeiA9IDA7IHogPCBub2RlTGlzdC5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVMaXN0W3pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgudmFsdWVPZihub2RlKSA9PT0gdGVtcGxhdGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChub2Rlcykge1xyXG4gICAgICAgICAgICBsaXN0ID0gbm9kZUxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gU3VwcG9ydGVkIG9wZXJhdGlvbnMgYXJlIGA9LDwsPixpbiwhYC4gJ2luJyBmb3IgbGlzdCB2YWx1ZXMgbWVhbiBjb250YWlucyBhbmRcclxuICAgIC8vIGZvciBzdHJpbmcgdmFsdWUgbWVhbnMgaW5kZXhPZi4gJyEnIG1lYW5zIG5vdCBlcXVhbCBvciBub3QgaW4uXHJcbiAgICBwcml2YXRlIGV2YWx1YXRlT3BlcmF0aW9uKGxlZnQsIG9wZXJhdGlvbiwgcmlnaHQpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCJpblwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRbaV0uaW5kZXhPZihsZWZ0KSA+PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiIVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICFmO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAobGVmdCA9PSByaWdodCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyaWdodC5pbmRleE9mKGxlZnQpID49IDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ICE9PSByaWdodCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIj5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHBhcnNlRmxvYXQobGVmdCkgPiBwYXJzZUZsb2F0KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIjxcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHBhcnNlRmxvYXQobGVmdCkgPCBwYXJzZUZsb2F0KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvZmZQb29sKHRlbXBsYXRlLGtleSk6IFdpbGwgdXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZSBwb29sIHRvIHBpY2sgdXAgaXRlbShzKSB3aXRoIGdpdmVuIGtleShzKVxyXG4gICAgcHJpdmF0ZSBvZmZQb29sKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgY29uc3QgcG9vbCA9IHRoaXMuZ2xvYmFsUG9vbFthcmdzWzBdXTtcclxuICAgICAgICBjb25zdCBrZXlzID0gYXJnc1sxXTtcclxuICAgICAgICBpZiAoIXBvb2wpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJBdHRlbXB0aW5nIHRvIGFjY2VzcyBwb29sICdcIiArIGFyZ3NbMF0gKyBcIicgdGhhdCBpcyBub3QgY3JlYXRlZC5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa2V5cyBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgZm9yIChsZXQgej0wOyB6IDwga2V5cy5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1t6XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIHdlIHRocm93IGhlcmU/XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gcG9vbFtrZXlzXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgXHJcbiAgICBpbml0VGVtcGxhdGVzKGxpc3QpIHtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZTogYW55PSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZXMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSlcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHN0eWxlc1tqXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IHRlbXBsYXRlLnN0eWxlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLnN0eWxlW2tleV0gPSB0aGlzLnRvUXVlcnlPcGVyYXRpb24obWV0aG9kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZS5uYW1lXSA9IHRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGluaXRQb29scyh0ZW1wbGF0ZXMpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gT2JqZWN0LmtleXModGVtcGxhdGVzKTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb25zLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBmaW5kIHJvb3Qgbm9kZSB0byBwZXJmb3JtIG9wZXJhdGlvbi5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nbG9iYWxQb29sID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZTogc3RyaW5nID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKHRlbXBsYXRlKTtcclxuICAgICAgICAgICAgaWYgKHQuaW5Qb29sKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb29sID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IodC5pblBvb2wpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2g9IHQubWF0Y2g7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2Rlcz0gdGhpcy5yb290Tm9kZTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiB0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbXBhdGggPSB0aGlzLmpYUGF0aEZvcihtYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gbXBhdGgudmFsdWVPZihub2Rlc1trXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ID09PSB0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8IG5vZGVzLmxlbmd0aDsgaysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9vbFtwYXRoLnZhbHVlT2Yobm9kZXNba10pXSA9IG5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsUG9vbFt0Lm5hbWVdID0gcG9vbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=