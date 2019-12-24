/*
 * Intentionally avoiding use of map call on list to reduce the call stack numbers.
 * On large scale JSON, call stack becomes a problem to be avoided.
 */
export class JXPath {
    constructor(jpath) {
        this.path = jpath.split(".");
    }
    fromLast() {
        return new JXPath(this.path[this.path.length - 1]);
    }
    nodeOf(node) {
        return this._nodeOf(node, this.path);
    }
    _nodeOf(node, path) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const list = [];
                for (let q = 0; q < this.path.length; q++) {
                    const item = pItem[q];
                    const x = this._nodeOf(item[path[i]], path.slice(i + 1, path.length));
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
    }
    valueOf(node) {
        return this._valueOf(node, this.path);
    }
    _valueOf(node, path) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const list = [];
                for (let q = 0; q < this.path.length; q++) {
                    const item = pItem[q];
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
    }
}
export class Inquirer {
    constructor() {
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
    jXPathFor(path) {
        let p = this.pathPool[path];
        if (!p) {
            p = new JXPath(path);
            this.pathPool[path] = p;
        }
        return p;
    }
    setRootNode(node) {
        this.rootNode = this.nodeList(node);
        this.initPools(this.templates);
    }
    setContextNode(node) {
        this.contextNode = node;
    }
    templateForName(name) {
        return this.templates[name];
    }
    // if node is null, root node will be used.
    nodeList(node) {
        const item = node === null ? this.rootNode : node;
        let list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            const x = Object.keys(item);
            list = [];
            for (let t = 0; t < x.length; t++) {
                const xItem = x[t];
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                }
                else {
                    list.push(item[xItem]);
                }
            }
        }
        return list;
    }
    // performs query of nested function calls on the given node.
    query(command, node) {
        const mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            let list = [];
            for (let q = 0; q < node.length; q++) {
                const nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem));
            }
            ;
            return list;
        }
        return this.invoke(mothods, node);
    }
    // performs query with given list of query opertations
    invoke(operation, node) {
        let list = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        }
        else if (typeof operation === 'object') {
            const f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (let a = 0; a < operation.args.length; a++) {
                        const arg = operation.args[a];
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
                const oldContext = this.contextNode;
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
    }
    // concatenate(a, b, c): joins arguments into a string
    // join args[0,1,2]
    concatenate(...args) {
        const left = args[0];
        const delim = args[1];
        const right = args[2];
        const result = [];
        if (left instanceof Array) {
            if (right instanceof Array) {
                if (left.length > right.length) {
                    for (let q = 0; q < left.length; q++) {
                        result.push(left[q] + delim + (right.length > q ? right[q] : ""));
                    }
                    ;
                }
                else {
                    for (let q = 0; q < right.length; q++) {
                        result.push((left.length > q ? left[q] : "") + delim + right[q]);
                    }
                    ;
                }
            }
            else {
                for (let q = 0; q < left.length; q++) {
                    result.push(left[q] + delim + right);
                }
                ;
            }
        }
        else {
            if (right instanceof Array) {
                for (let q = 0; q < right.length; q++) {
                    result.push(left + delim + right[q]);
                }
                ;
            }
            else {
                result.push(left + delim + right);
            }
        }
        return result.length > 1 ? result : result[0];
    }
    // split(item,','): splits value into a list
    // split args[0] with args[1]
    split(...args) {
        return args[0] ? args[0].split(args[1]) : [];
    }
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    valueOf(...args) {
        const jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    }
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1]
    each(...args) {
        const list = [];
        const method = { name: "valueOf", args: args[1] };
        for (let q = 0; q < args[0].length; q++) {
            const node = args[0][q];
            list.push(this.invoke(method, node));
        }
        ;
        return list;
    }
    // enlist(...): insert argument values into a list
    enlist(...args) {
        const list = [];
        args.map((item) => {
            list.push(item); // make sure last two item are not node and template
        });
        return list;
    }
    // join(array,','): joins items of the list into a string
    join(...args) {
        return args[0].length > 1 ? args[0].join(args[1]) : args[0];
    }
    // apply(template,path,array): apply the template in root context for each value 
    // that matches the given path. args[0] name to apply
    apply(...args) {
        const path = this.jXPathFor(args[1]);
        const path2 = path.fromLast();
        const values = args[2];
        let list = [];
        for (let c = 0; c < this.rootNode.length; c++) {
            const node = this.rootNode[c];
            const value = path.nodeOf(node);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    const v = value[d];
                    const x = path2.valueOf(v);
                    if (this.evaluateOperation(x, "=", values)) {
                        list.push(v);
                    }
                }
            }
            else {
                const x = path2.valueOf(node);
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
    }
    // match(template,path,operation,values): , node args[4]
    // for value of target in given template nodes, evaluate operation for given value(s). 
    match(...args) {
        const template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        const path = this.jXPathFor(args[1]);
        const path2 = path.fromLast();
        const operation = args[2];
        const values = args[3];
        const nodes = this.templateNodes(template, this.contextNode);
        const list = [];
        if (nodes instanceof Array) {
            for (let c = 0; c < nodes.length; c++) {
                const node = nodes[c];
                const value = path.nodeOf(node);
                if (value instanceof Array) {
                    for (let d = 0; d < value.length; d++) {
                        const v = value[d];
                        const x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    }
                }
                else {
                    const x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            }
            ;
        }
        else {
            const value = path.nodeOf(nodes);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    const v = value[d];
                    const x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                }
            }
            else {
                const x = path2.valueOf(nodes);
                if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        }
        return list;
    }
    // filter(path,operation,value): for value of target in current context, 
    // evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in.
    filter(...args) {
        const path = this.jXPathFor(args[0]);
        const operation = args[1];
        const values = args[2];
        const list = [];
        for (let a = 0; a < this.contextNode.length; a++) {
            const node = this.contextNode[a];
            const value = path.valueOf(node);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    const v = value[d];
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
    }
    // select(path): select the nodes with given path in current context
    select(...args) {
        const path = this.jXPathFor(args[0]);
        let list = [];
        if (this.contextNode instanceof Array) {
            for (let d = 0; d < this.contextNode.length; d++) {
                const node = this.contextNode[d];
                const value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            }
        }
        else {
            const value = path.nodeOf(this.contextNode);
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
    }
    // style(template, array): apply the given template for the given array
    style(...args) {
        const template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        const result = [];
        const attrs = Object.keys(template.style);
        if (args[1] instanceof Array) {
            for (let a = 0; a < args[1].length; a++) {
                const item = args[1][a];
                const node = {};
                for (let d = 0; d < attrs.length; d++) {
                    const attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        }
        else {
            const node = {};
            for (let d = 0; d < attrs.length; d++) {
                const attr = attrs[d];
                node[attr] = this.invoke(template.style[attr], args[1]);
            }
            result.push(node);
        }
        return result;
    }
    addSupportingMethod(name, method) {
        this.supportedMethods[name] = method;
    }
    removeQuotes(str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    }
    toQueryOperation(methods) {
        const operations = methods.replace(/([^']+)|('[^']+')/g, function ($0, $1, $2) {
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
    }
    toFunctions(item) {
        // if item = join(enlist(valueOf(address.street),valueOf(address.city),valueOf(address.zipcode)),',')
        let i = -1;
        let j = -1;
        let k = -1;
        let c = 0;
        let json = {};
        for (let cindex = 0; cindex < item.length; cindex++) {
            if (item[cindex] === '(') {
                if (c === 0) {
                    i = cindex;
                }
                c++;
            }
            else if (item[cindex] === ')') {
                c--;
                if (c === 0) {
                    const isArry = (json instanceof Array);
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
                    const isArry = (json instanceof Array);
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
                        const x = this.removeQuotes(item.substring(k + 1, cindex).replace(/~/g, ','));
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
    }
    templateNodes(template, nodes) {
        let list = [];
        let nodeList = nodes;
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
            const path = this.jXPathFor(template.match);
            for (let z = 0; z < nodeList.length; z++) {
                const node = nodeList[z];
                if (path.valueOf(node) === template.value) {
                    list.push(node);
                }
            }
        }
        else if (nodes) {
            list = nodeList;
        }
        return list;
    }
    // Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and
    // for string value means indexOf. '!' means not equal or not in.
    evaluateOperation(left, operation, right) {
        let result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                for (let i = 0; i < right.length; i++) {
                    if (left == right[i]) {
                        result = true;
                        break;
                    }
                }
            }
            else if (operation === "in") {
                for (let i = 0; i < right.length; i++) {
                    if (right[i].indexOf(left) >= 0) {
                        result = true;
                        break;
                    }
                }
                ;
            }
            else if (operation === "!") {
                let f = false;
                for (let i = 0; i < right.length; i++) {
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
    }
    // offPool(template,key): Will use the given template pool to pick up item(s) with given key(s)
    offPool(...args) {
        const list = [];
        const pool = this.globalPool[args[0]];
        const keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array) {
            for (let z = 0; z < keys.length; z++) {
                const key = keys[z];
                const node = pool[key];
                if (node) {
                    list.push(node);
                }
                else {
                    // should we throw here?
                }
            }
        }
        else {
            const node = pool[keys];
            if (node) {
                list.push(node);
            }
        }
        return list;
    }
    initTemplates(list) {
        this.templates = {};
        for (let i = 0; i < list.length; i++) {
            const template = list[i];
            const styles = Object.keys(template.style);
            for (let j = 0; j < styles.length; j++) {
                const key = styles[j];
                const method = template.style[key];
                if (typeof method === "string") {
                    template.style[key] = this.toQueryOperation(method);
                }
            }
            this.templates[template.name] = template;
        }
    }
    initPools(templates) {
        const list = Object.keys(templates);
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
        for (let i = 0; i < list.length; i++) {
            const template = list[i];
            const t = this.templateForName(template);
            if (t.inPool) {
                const pool = {};
                const path = this.jXPathFor(t.inPool);
                const match = t.match;
                const nodes = this.rootNode;
                if (match && t.value) {
                    const mpath = this.jXPathFor(match);
                    for (let k = 0; k < nodes.length; k++) {
                        const v = mpath.valueOf(nodes[k]);
                        if (v === t.value) {
                            pool[path.valueOf(nodes[k])] = nodes[k];
                        }
                    }
                }
                else {
                    for (let k = 0; k < nodes.length; k++) {
                        pool[path.valueOf(nodes[k])] = nodes[k];
                    }
                }
                this.globalPool[t.name] = pool;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQWlCSCxNQUFNLE9BQU8sTUFBTTtJQUVmLFlBQVksS0FBSztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsUUFBUTtRQUNKLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSTtRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFDTyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQWM7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxHQUFH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LENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7d0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzQztpQkFDSjtnQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDbEM7U0FDSjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEludGVudGlvbmFsbHkgYXZvaWRpbmcgdXNlIG9mIG1hcCBjYWxsIG9uIGxpc3QgdG8gcmVkdWNlIHRoZSBjYWxsIHN0YWNrIG51bWJlcnMuXHJcbiAqIE9uIGxhcmdlIHNjYWxlIEpTT04sIGNhbGwgc3RhY2sgYmVjb21lcyBhIHByb2JsZW0gdG8gYmUgYXZvaWRlZC5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBtYXRjaD86IHN0cmluZyxcclxuICAgIHZhbHVlPzogc3RyaW5nLFxyXG4gICAgY29udGV4dDogc3RyaW5nLFxyXG4gICAgaW5Qb29sPzogc3RyaW5nLFxyXG4gICAgc3R5bGU6IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3BlcmF0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBRdWVyeU9wZXJhdGlvbltdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKWFBhdGgge1xyXG4gICAgcHJpdmF0ZSBwYXRoO1xyXG4gICAgY29uc3RydWN0b3IoanBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGpwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIH1cclxuICAgIGZyb21MYXN0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSlhQYXRoKHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gICAgbm9kZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9ub2RlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fbm9kZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgeCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG4gICAgdmFsdWVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3ZhbHVlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fdmFsdWVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucXVpcmVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRNZXRob2RzID0ge307XHJcbiAgICBwcml2YXRlIHRlbXBsYXRlcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSByb290Tm9kZTtcclxuICAgIHByaXZhdGUgY29udGV4dE5vZGU7IC8vIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBjYWxsIGlzIG1hZGUuLi4gdGhpcyBpcyB0byBhdm9pZCBjYWxsIHN0YWNrIG92ZXJmbG93IGluIGV4dHJlbWVsdCBsYXJnZSBKU09OXHJcbiAgICBwcml2YXRlIGdsb2JhbFBvb2wgPSB7fTtcclxuICAgIHByaXZhdGUgcGF0aFBvb2wgPSB7fTsvLyB0byBhdm9pZCBzdGFja292ZXJmbG93Li4uIGFuZCBwZXJmb3JtIGZhc3RlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInZhbHVlT2ZcIiwgdGhpcy52YWx1ZU9mKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlYWNoXCIsIHRoaXMuZWFjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3BsaXRcIiwgdGhpcy5zcGxpdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiY29uY2F0XCIsIHRoaXMuY29uY2F0ZW5hdGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVubGlzdFwiLCB0aGlzLmVubGlzdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiam9pblwiLCB0aGlzLmpvaW4pO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzdHlsZVwiLCB0aGlzLnN0eWxlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJtYXRjaFwiLCB0aGlzLm1hdGNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJhcHBseVwiLCB0aGlzLmFwcGx5KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwib2ZmUG9vbFwiLCB0aGlzLm9mZlBvb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgalhQYXRoRm9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBwOkpYUGF0aCA9IHRoaXMucGF0aFBvb2xbcGF0aF07XHJcbiAgICAgICAgaWYgKCFwKSB7XHJcbiAgICAgICAgICAgIHAgPSBuZXcgSlhQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGhQb29sW3BhdGhdID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3ROb2RlID0gdGhpcy5ub2RlTGlzdChub2RlKTtcclxuICAgICAgICB0aGlzLmluaXRQb29scyh0aGlzLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZXh0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICB0ZW1wbGF0ZUZvck5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIC8vIGlmIG5vZGUgaXMgbnVsbCwgcm9vdCBub2RlIHdpbGwgYmUgdXNlZC5cclxuICAgIG5vZGVMaXN0KG5vZGUpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbm9kZSA9PT0gbnVsbCA/IHRoaXMucm9vdE5vZGUgOiBub2RlO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBpdGVtO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCB4Lmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4SXRlbSA9IHhbdF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVt4SXRlbV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSBvZiBuZXN0ZWQgZnVuY3Rpb24gY2FsbHMgb24gdGhlIGdpdmVuIG5vZGUuXHJcbiAgICBxdWVyeShjb21tYW5kOnN0cmluZywgbm9kZSkge1xyXG4gICAgICAgIGNvbnN0IG1vdGhvZHMgPXRoaXMudG9RdWVyeU9wZXJhdGlvbihjb21tYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IG5vZGUubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJdGVtID0gbm9kZVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLmludm9rZShtb3Rob2RzLCBub2RlSXRlbSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2UobW90aG9kcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgd2l0aCBnaXZlbiBsaXN0IG9mIHF1ZXJ5IG9wZXJ0YXRpb25zXHJcbiAgICBpbnZva2Uob3BlcmF0aW9uOlF1ZXJ5T3BlcmF0aW9uLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6YW55ID0gW107XHJcbiAgICAgICAgaWYgKCh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgbm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tvcGVyYXRpb24ubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgb3BlcmF0aW9uLmFyZ3MubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gb3BlcmF0aW9uLmFyZ3NbYV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UoYXJnLCBub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9wZXJhdGlvbi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gZi5hcHBseSh0aGlzLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBvbGRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uY2F0ZW5hdGUoYSwgYiwgYyk6IGpvaW5zIGFyZ3VtZW50cyBpbnRvIGEgc3RyaW5nXHJcbiAgICAvLyBqb2luIGFyZ3NbMCwxLDJdXHJcbiAgICBjb25jYXRlbmF0ZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGFyZ3NbMF07XHJcbiAgICAgICAgY29uc3QgZGVsaW09IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgcmlnaHQ9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA+IHJpZ2h0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgKHJpZ2h0Lmxlbmd0aCA+IHEgPyByaWdodFtxXSA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCAobGVmdC5sZW5ndGggPiBxID8gbGVmdFtxXSA6IFwiXCIpICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdCArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxlZnQgKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDEgPyByZXN1bHQgOiByZXN1bHRbMF07XHJcbiAgICB9XHJcbiAgICAvLyBzcGxpdChpdGVtLCcsJyk6IHNwbGl0cyB2YWx1ZSBpbnRvIGEgbGlzdFxyXG4gICAgLy8gc3BsaXQgYXJnc1swXSB3aXRoIGFyZ3NbMV1cclxuICAgIHNwbGl0KC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXSA/IGFyZ3NbMF0uc3BsaXQoYXJnc1sxXSkgOiBbXTtcclxuICAgIH1cclxuICAgIC8vIHZhbHVlT2YocGF0aCk6ICBldmFsdWF0ZXMgdmFsdWUgb2YgYXJndW1lbnQgcGF0aFxyXG4gICAgLy8gcGF0aCA9IGFyZ3NbMF0sIG5vZGUgdG8gZXZhbHVhdGUgPSBhcmdzWzFdXHJcbiAgICB2YWx1ZU9mKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIHJldHVybiBqcGF0aC52YWx1ZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLy8gZWFjaChsaXN0LG1ldGhvZCk6IEZvciBlYWNoIGl0ZW0gaW4gbGlzdCwgaW52b2RlIHRoZSBjYWxsYmFjayBtZXRob2RcclxuICAgIC8vIGVhY2ggaXRlbSBvZiBhcmdzWzBdIGV4ZWN1dGUgZnVuY3Rpb24gb2YgYXJnc1sxXVxyXG4gICAgZWFjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHtuYW1lOiBcInZhbHVlT2ZcIiwgYXJnczogYXJnc1sxXX07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBhcmdzWzBdLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBhcmdzWzBdW3FdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UobWV0aG9kLCBub2RlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGVubGlzdCguLi4pOiBpbnNlcnQgYXJndW1lbnQgdmFsdWVzIGludG8gYSBsaXN0XHJcbiAgICBlbmxpc3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBhcmdzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pOyAvLyBtYWtlIHN1cmUgbGFzdCB0d28gaXRlbSBhcmUgbm90IG5vZGUgYW5kIHRlbXBsYXRlXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGpvaW4oYXJyYXksJywnKTogam9pbnMgaXRlbXMgb2YgdGhlIGxpc3QgaW50byBhIHN0cmluZ1xyXG4gICAgam9pbiguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0ubGVuZ3RoID4gMSA/IGFyZ3NbMF0uam9pbihhcmdzWzFdKSA6IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICAvLyBhcHBseSh0ZW1wbGF0ZSxwYXRoLGFycmF5KTogYXBwbHkgdGhlIHRlbXBsYXRlIGluIHJvb3QgY29udGV4dCBmb3IgZWFjaCB2YWx1ZSBcclxuICAgIC8vIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aC4gYXJnc1swXSBuYW1lIHRvIGFwcGx5XHJcbiAgICBhcHBseSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMucm9vdE5vZGUubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucm9vdE5vZGVbY107XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLnN0eWxlKGFyZ3NbMF0sIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIG1hdGNoKHRlbXBsYXRlLHBhdGgsb3BlcmF0aW9uLHZhbHVlcyk6ICwgbm9kZSBhcmdzWzRdXHJcbiAgICAvLyBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGdpdmVuIHRlbXBsYXRlIG5vZGVzLCBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBcclxuICAgIG1hdGNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1szXTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5jb250ZXh0Tm9kZSlcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBub2Rlcy5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2NdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIocGF0aCxvcGVyYXRpb24sdmFsdWUpOiBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGN1cnJlbnQgY29udGV4dCwgXHJcbiAgICAvLyBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZCBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgZmlsdGVyKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbYV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odmFsdWUsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0KHBhdGgpOiBzZWxlY3QgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gcGF0aCBpbiBjdXJyZW50IGNvbnRleHRcclxuICAgIHNlbGVjdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2RdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHN0eWxlKHRlbXBsYXRlLCBhcnJheSk6IGFwcGx5IHRoZSBnaXZlbiB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGFycmF5XHJcbiAgICBzdHlsZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoYXJnc1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYXJnc1sxXS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMV1bYV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGFkZFN1cHBvcnRpbmdNZXRob2QobmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRNZXRob2RzW25hbWVdID0gbWV0aG9kO1xyXG4gICAgfVxyXG4gICAgIHByaXZhdGUgcmVtb3ZlUXVvdGVzKHN0cikge1xyXG4gICAgICAgIHJldHVybiAoc3RyLmxlbmd0aCAmJiBzdHJbMF0gPT09ICdcXCcnICYmIHN0cltzdHIubGVuZ3RoLTFdID09PSAnXFwnJykgPyBzdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aC0xKSA6IHN0cjtcclxuICAgIH1cclxuICAgIHRvUXVlcnlPcGVyYXRpb24obWV0aG9kcykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBtZXRob2RzLnJlcGxhY2UoLyhbXiddKyl8KCdbXiddKycpL2csIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcclxuICAgICAgICAgICAgaWYgKCQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMjsgXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSkucmVwbGFjZSgvJ1teJ10rJy9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UoLywvZywgJ34nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0Z1bmN0aW9ucyhvcGVyYXRpb25zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9GdW5jdGlvbnMoaXRlbSl7XHJcbiAgICAgICAgLy8gaWYgaXRlbSA9IGpvaW4oZW5saXN0KHZhbHVlT2YoYWRkcmVzcy5zdHJlZXQpLHZhbHVlT2YoYWRkcmVzcy5jaXR5KSx2YWx1ZU9mKGFkZHJlc3MuemlwY29kZSkpLCcsJylcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBqID0gLTE7XHJcbiAgICAgICAgbGV0IGsgPSAtMTtcclxuICAgICAgICBsZXQgYyA9IDA7XHJcbiAgICAgICAgbGV0IGpzb246IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGNpbmRleCA9IDA7IGNpbmRleCA8IGl0ZW0ubGVuZ3RoOyBjaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtjaW5kZXhdID09PSAnKCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcpJykge1xyXG4gICAgICAgICAgICAgICAgYy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5ICYmIChqID09PSAoaXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcIm5hbWVcIl0gPSBpdGVtLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcImFyZ3NcIl0gPSB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uc3Vic3RyaW5nKGsrMSwgaSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwICYmIChjaW5kZXgtMSAhPT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaW5kZXhPZignKCcpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xID09PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKSdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaTwwICYmIGo+MCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKCdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNlIGlmIChpIDwgMCAmJiBqIDwgMCAmJiBrIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9ZWxzZSBpZiAoYyA9PT0gMCAmJiBrID4gaikge1xyXG4gICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlOlRlbXBsYXRlLCBub2Rlcykge1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IG5vZGVMaXN0ID0gbm9kZXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZXh0ID09PSBcInJvb3RcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlTGlzdCA9IHRoaXMubm9kZUxpc3QodGhpcy5yb290Tm9kZSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUubWF0Y2ggJiYgdGVtcGxhdGUubWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0ZW1wbGF0ZS5tYXRjaCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IG5vZGVMaXN0Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZUxpc3Rbel07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC52YWx1ZU9mKG5vZGUpID09PSB0ZW1wbGF0ZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZFxyXG4gICAgLy8gZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVPcGVyYXRpb24obGVmdCwgb3BlcmF0aW9uLCByaWdodCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodFtpXS5pbmRleE9mKGxlZnQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gIWY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ID09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJpZ2h0LmluZGV4T2YobGVmdCkgPj0gMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgIT09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA+IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA8IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9mZlBvb2wodGVtcGxhdGUsa2V5KTogV2lsbCB1c2UgdGhlIGdpdmVuIHRlbXBsYXRlIHBvb2wgdG8gcGljayB1cCBpdGVtKHMpIHdpdGggZ2l2ZW4ga2V5KHMpXHJcbiAgICBwcml2YXRlIG9mZlBvb2woLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5nbG9iYWxQb29sW2FyZ3NbMF1dO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBhcmdzWzFdO1xyXG4gICAgICAgIGlmICghcG9vbCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIHBvb2wgJ1wiICsgYXJnc1swXSArIFwiJyB0aGF0IGlzIG5vdCBjcmVhdGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB6PTA7IHogPCBrZXlzLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW3pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdGhyb3cgaGVyZT9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleXNdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICBcclxuICAgIGluaXRUZW1wbGF0ZXMobGlzdCkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBhbnk9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gc3R5bGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGVtcGxhdGUuc3R5bGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuc3R5bGVba2V5XSA9IHRoaXMudG9RdWVyeU9wZXJhdGlvbihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlLm5hbWVdID0gdGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFBvb2xzKHRlbXBsYXRlcykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZXMpO1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbnMuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbFBvb2wgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBzdHJpbmcgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICBpZiAodC5pblBvb2wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2wgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0LmluUG9vbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaD0gdC5tYXRjaDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzPSB0aGlzLnJvb3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtcGF0aCA9IHRoaXMualhQYXRoRm9yKG1hdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBtcGF0aC52YWx1ZU9mKG5vZGVzW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxQb29sW3QubmFtZV0gPSBwb29sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==