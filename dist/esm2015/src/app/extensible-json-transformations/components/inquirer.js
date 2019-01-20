/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function Template() { }
/** @type {?} */
Template.prototype.name;
/** @type {?|undefined} */
Template.prototype.match;
/** @type {?|undefined} */
Template.prototype.value;
/** @type {?} */
Template.prototype.context;
/** @type {?|undefined} */
Template.prototype.inPool;
/** @type {?} */
Template.prototype.style;
/**
 * @record
 */
export function QueryOperation() { }
/** @type {?} */
QueryOperation.prototype.name;
/** @type {?|undefined} */
QueryOperation.prototype.args;
export class JXPath {
    /**
     * @param {?} jpath
     */
    constructor(jpath) {
        this.path = jpath.split(".");
    }
    /**
     * @return {?}
     */
    fromLast() {
        return new JXPath(this.path[this.path.length - 1]);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    nodeOf(node) {
        return this._nodeOf(node, this.path);
    }
    /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    _nodeOf(node, path) {
        /** @type {?} */
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                /** @type {?} */
                const list = [];
                for (let q = 0; q < this.path.length; q++) {
                    /** @type {?} */
                    const item = pItem[q];
                    /** @type {?} */
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
    /**
     * @param {?} node
     * @return {?}
     */
    valueOf(node) {
        return this._valueOf(node, this.path);
    }
    /**
     * @param {?} node
     * @param {?} path
     * @return {?}
     */
    _valueOf(node, path) {
        /** @type {?} */
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                /** @type {?} */
                const list = [];
                for (let q = 0; q < this.path.length; q++) {
                    /** @type {?} */
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
if (false) {
    /** @type {?} */
    JXPath.prototype.path;
}
export class Inquirer {
    constructor() {
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
    jXPathFor(path) {
        /** @type {?} */
        let p = this.pathPool[path];
        if (!p) {
            p = new JXPath(path);
            this.pathPool[path] = p;
        }
        return p;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    setRootNode(node) {
        this.rootNode = this.nodeList(node);
        this.initPools(this.templates);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    setContextNode(node) {
        this.contextNode = node;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    templateForName(name) {
        return this.templates[name];
    }
    /**
     * @param {?} node
     * @return {?}
     */
    nodeList(node) {
        /** @type {?} */
        const item = node === null ? this.rootNode : node;
        /** @type {?} */
        let list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            /** @type {?} */
            const x = Object.keys(item);
            list = [];
            for (let t = 0; t < x.length; t++) {
                /** @type {?} */
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
    /**
     * @param {?} command
     * @param {?} node
     * @return {?}
     */
    query(command, node) {
        /** @type {?} */
        const mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            /** @type {?} */
            let list = [];
            for (let q = 0; q < node.length; q++) {
                /** @type {?} */
                const nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem));
            }
            ;
            return list;
        }
        return this.invoke(mothods, node);
    }
    /**
     * @param {?} operation
     * @param {?} node
     * @return {?}
     */
    invoke(operation, node) {
        /** @type {?} */
        let list = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        }
        else if (typeof operation === 'object') {
            /** @type {?} */
            const f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (let a = 0; a < operation.args.length; a++) {
                        /** @type {?} */
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
                /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    concatenate(...args) {
        /** @type {?} */
        const left = args[0];
        /** @type {?} */
        const delim = args[1];
        /** @type {?} */
        const right = args[2];
        /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    split(...args) {
        return args[0] ? args[0].split(args[1]) : [];
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    valueOf(...args) {
        /** @type {?} */
        const jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    each(...args) {
        /** @type {?} */
        const list = [];
        /** @type {?} */
        const method = { name: "valueOf", args: args[1] };
        for (let q = 0; q < args[0].length; q++) {
            /** @type {?} */
            const node = args[0][q];
            list.push(this.invoke(method, node));
        }
        ;
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    enlist(...args) {
        /** @type {?} */
        const list = [];
        args.map((item) => {
            list.push(item); // make sure last two item are not node and template
        });
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    join(...args) {
        return args[0].length > 1 ? args[0].join(args[1]) : args[0];
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    apply(...args) {
        /** @type {?} */
        const path = this.jXPathFor(args[1]);
        /** @type {?} */
        const path2 = path.fromLast();
        /** @type {?} */
        const values = args[2];
        /** @type {?} */
        let list = [];
        for (let c = 0; c < this.rootNode.length; c++) {
            /** @type {?} */
            const node = this.rootNode[c];
            /** @type {?} */
            const value = path.nodeOf(node);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    /** @type {?} */
                    const v = value[d];
                    /** @type {?} */
                    const x = path2.valueOf(v);
                    if (this.evaluateOperation(x, "=", values)) {
                        list.push(v);
                    }
                }
            }
            else {
                /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    match(...args) {
        /** @type {?} */
        const template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        /** @type {?} */
        const path = this.jXPathFor(args[1]);
        /** @type {?} */
        const path2 = path.fromLast();
        /** @type {?} */
        const operation = args[2];
        /** @type {?} */
        const values = args[3];
        /** @type {?} */
        const nodes = this.templateNodes(template, this.contextNode);
        /** @type {?} */
        const list = [];
        if (nodes instanceof Array) {
            for (let c = 0; c < nodes.length; c++) {
                /** @type {?} */
                const node = nodes[c];
                /** @type {?} */
                const value = path.nodeOf(node);
                if (value instanceof Array) {
                    for (let d = 0; d < value.length; d++) {
                        /** @type {?} */
                        const v = value[d];
                        /** @type {?} */
                        const x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    }
                }
                else {
                    /** @type {?} */
                    const x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            }
            ;
        }
        else {
            /** @type {?} */
            const value = path.nodeOf(nodes);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    /** @type {?} */
                    const v = value[d];
                    /** @type {?} */
                    const x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                }
            }
            else {
                /** @type {?} */
                const x = path2.valueOf(nodes);
                if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        }
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    filter(...args) {
        /** @type {?} */
        const path = this.jXPathFor(args[0]);
        /** @type {?} */
        const operation = args[1];
        /** @type {?} */
        const values = args[2];
        /** @type {?} */
        const list = [];
        for (let a = 0; a < this.contextNode.length; a++) {
            /** @type {?} */
            const node = this.contextNode[a];
            /** @type {?} */
            const value = path.valueOf(node);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    select(...args) {
        /** @type {?} */
        const path = this.jXPathFor(args[0]);
        /** @type {?} */
        let list = [];
        if (this.contextNode instanceof Array) {
            for (let d = 0; d < this.contextNode.length; d++) {
                /** @type {?} */
                const node = this.contextNode[d];
                /** @type {?} */
                const value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            }
        }
        else {
            /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    style(...args) {
        /** @type {?} */
        const template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        /** @type {?} */
        const result = [];
        /** @type {?} */
        const attrs = Object.keys(template.style);
        if (args[1] instanceof Array) {
            for (let a = 0; a < args[1].length; a++) {
                /** @type {?} */
                const item = args[1][a];
                /** @type {?} */
                const node = {};
                for (let d = 0; d < attrs.length; d++) {
                    /** @type {?} */
                    const attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        }
        else {
            /** @type {?} */
            const node = {};
            for (let d = 0; d < attrs.length; d++) {
                /** @type {?} */
                const attr = attrs[d];
                node[attr] = this.invoke(template.style[attr], args[1]);
            }
            result.push(node);
        }
        return result;
    }
    /**
     * @param {?} name
     * @param {?} method
     * @return {?}
     */
    addSupportingMethod(name, method) {
        this.supportedMethods[name] = method;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    removeQuotes(str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    }
    /**
     * @param {?} methods
     * @return {?}
     */
    toQueryOperation(methods) {
        /** @type {?} */
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
    /**
     * @param {?} item
     * @return {?}
     */
    toFunctions(item) {
        /** @type {?} */
        let i = -1;
        /** @type {?} */
        let j = -1;
        /** @type {?} */
        let k = -1;
        /** @type {?} */
        let c = 0;
        /** @type {?} */
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
                    /** @type {?} */
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
                    /** @type {?} */
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
                        /** @type {?} */
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
    /**
     * @param {?} template
     * @param {?} nodes
     * @return {?}
     */
    templateNodes(template, nodes) {
        /** @type {?} */
        let list = [];
        /** @type {?} */
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
            /** @type {?} */
            const path = this.jXPathFor(template.match);
            for (let z = 0; z < nodeList.length; z++) {
                /** @type {?} */
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
    /**
     * @param {?} left
     * @param {?} operation
     * @param {?} right
     * @return {?}
     */
    evaluateOperation(left, operation, right) {
        /** @type {?} */
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
                /** @type {?} */
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
    /**
     * @param {...?} args
     * @return {?}
     */
    offPool(...args) {
        /** @type {?} */
        const list = [];
        /** @type {?} */
        const pool = this.globalPool[args[0]];
        /** @type {?} */
        const keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array) {
            for (let z = 0; z < keys.length; z++) {
                /** @type {?} */
                const key = keys[z];
                /** @type {?} */
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
            /** @type {?} */
            const node = pool[keys];
            if (node) {
                list.push(node);
            }
        }
        return list;
    }
    /**
     * @param {?} list
     * @return {?}
     */
    initTemplates(list) {
        this.templates = {};
        for (let i = 0; i < list.length; i++) {
            /** @type {?} */
            const template = list[i];
            /** @type {?} */
            const styles = Object.keys(template.style);
            for (let j = 0; j < styles.length; j++) {
                /** @type {?} */
                const key = styles[j];
                /** @type {?} */
                const method = template.style[key];
                if (typeof method === "string") {
                    template.style[key] = this.toQueryOperation(method);
                }
            }
            this.templates[template.name] = template;
        }
    }
    /**
     * @param {?} templates
     * @return {?}
     */
    initPools(templates) {
        /** @type {?} */
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
            /** @type {?} */
            const template = list[i];
            /** @type {?} */
            const t = this.templateForName(template);
            if (t.inPool) {
                /** @type {?} */
                const pool = {};
                /** @type {?} */
                const path = this.jXPathFor(t.inPool);
                /** @type {?} */
                const match = t.match;
                /** @type {?} */
                const nodes = this.rootNode;
                if (match && t.value) {
                    /** @type {?} */
                    const mpath = this.jXPathFor(match);
                    for (let k = 0; k < nodes.length; k++) {
                        /** @type {?} */
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
if (false) {
    /** @type {?} */
    Inquirer.prototype.supportedMethods;
    /** @type {?} */
    Inquirer.prototype.templates;
    /** @type {?} */
    Inquirer.prototype.rootNode;
    /** @type {?} */
    Inquirer.prototype.contextNode;
    /** @type {?} */
    Inquirer.prototype.globalPool;
    /** @type {?} */
    Inquirer.prototype.pathPool;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTTs7OztJQUVGLFlBQVksS0FBSztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNoQzs7OztJQUNELFFBQVE7UUFDSixNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3REOzs7OztJQUNELE1BQU0sQ0FBQyxJQUFJO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7Ozs7O0lBQ08sT0FBTyxDQUFDLElBQUksRUFBRSxJQUFjOztRQUNoQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDOztnQkFDekIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7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LENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckQ7Ozs7O0lBRU8sU0FBUyxDQUFDLElBQVk7O1FBQzFCLElBQUksQ0FBQyxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLElB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QUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0M7aUJBQ0o7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ2xDO1NBQ0o7S0FDSjtDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogSW50ZW50aW9uYWxseSBhdm9pZGluZyB1c2Ugb2YgbWFwIGNhbGwgb24gbGlzdCB0byByZWR1Y2UgdGhlIGNhbGwgc3RhY2sgbnVtYmVycy5cclxuICogT24gbGFyZ2Ugc2NhbGUgSlNPTiwgY2FsbCBzdGFjayBiZWNvbWVzIGEgcHJvYmxlbSB0byBiZSBhdm9pZGVkLlxyXG4gKi9cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIG1hdGNoPzogc3RyaW5nLFxyXG4gICAgdmFsdWU/OiBzdHJpbmcsXHJcbiAgICBjb250ZXh0OiBzdHJpbmcsXHJcbiAgICBpblBvb2w/OiBzdHJpbmcsXHJcbiAgICBzdHlsZTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcGVyYXRpb24ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgYXJncz86IFF1ZXJ5T3BlcmF0aW9uW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEpYUGF0aCB7XHJcbiAgICBwcml2YXRlIHBhdGg7XHJcbiAgICBjb25zdHJ1Y3RvcihqcGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0ganBhdGguc3BsaXQoXCIuXCIpO1xyXG4gICAgfVxyXG4gICAgZnJvbUxhc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKWFBhdGgodGhpcy5wYXRoW3RoaXMucGF0aC5sZW5ndGggLSAxXSk7XHJcbiAgICB9XHJcbiAgICBub2RlT2Yobm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX25vZGVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBJdGVtW3FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9ub2RlT2YoaXRlbVtwYXRoW2ldXSwgcGF0aC5zbGljZShpKzEscGF0aC5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiB4ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcEl0ZW07XHJcbiAgICB9XHJcbiAgICB2YWx1ZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVPZihub2RlLCB0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfdmFsdWVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCB0aGlzLnBhdGgubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLl92YWx1ZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwSXRlbSA9IGxpc3Q7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW0gPyBwSXRlbVtwYXRoW2ldXSA6IHBJdGVtO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5xdWlyZXIgIHtcclxuXHJcbiAgICBwcml2YXRlIHN1cHBvcnRlZE1ldGhvZHMgPSB7fTtcclxuICAgIHByaXZhdGUgdGVtcGxhdGVzID0ge307XHJcbiAgICBwcml2YXRlIHJvb3ROb2RlO1xyXG4gICAgcHJpdmF0ZSBjb250ZXh0Tm9kZTsgLy8gc2hvdWxkIGJlIHNldCBiZWZvcmUgYW55IGNhbGwgaXMgbWFkZS4uLiB0aGlzIGlzIHRvIGF2b2lkIGNhbGwgc3RhY2sgb3ZlcmZsb3cgaW4gZXh0cmVtZWx0IGxhcmdlIEpTT05cclxuICAgIHByaXZhdGUgZ2xvYmFsUG9vbCA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYXRoUG9vbCA9IHt9Oy8vIHRvIGF2b2lkIHN0YWNrb3ZlcmZsb3cuLi4gYW5kIHBlcmZvcm0gZmFzdGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwidmFsdWVPZlwiLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVhY2hcIiwgdGhpcy5lYWNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzcGxpdFwiLCB0aGlzLnNwbGl0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJjb25jYXRcIiwgdGhpcy5jb25jYXRlbmF0ZSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZW5saXN0XCIsIHRoaXMuZW5saXN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJqb2luXCIsIHRoaXMuam9pbik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZmlsdGVyXCIsIHRoaXMuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInN0eWxlXCIsIHRoaXMuc3R5bGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcIm1hdGNoXCIsIHRoaXMubWF0Y2gpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImFwcGx5XCIsIHRoaXMuYXBwbHkpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJvZmZQb29sXCIsIHRoaXMub2ZmUG9vbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBqWFBhdGhGb3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHA6SlhQYXRoID0gdGhpcy5wYXRoUG9vbFtwYXRoXTtcclxuICAgICAgICBpZiAoIXApIHtcclxuICAgICAgICAgICAgcCA9IG5ldyBKWFBhdGgocGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aFBvb2xbcGF0aF0gPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSb290Tm9kZShub2RlOmFueSkge1xyXG4gICAgICAgIHRoaXMucm9vdE5vZGUgPSB0aGlzLm5vZGVMaXN0KG5vZGUpO1xyXG4gICAgICAgIHRoaXMuaW5pdFBvb2xzKHRoaXMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuICAgIHNldENvbnRleHROb2RlKG5vZGUpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgIH1cclxuICAgIHRlbXBsYXRlRm9yTmFtZShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzW25hbWVdO1xyXG4gICAgfVxyXG4gICAgLy8gaWYgbm9kZSBpcyBudWxsLCByb290IG5vZGUgd2lsbCBiZSB1c2VkLlxyXG4gICAgbm9kZUxpc3Qobm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBub2RlID09PSBudWxsID8gdGhpcy5yb290Tm9kZSA6IG5vZGU7XHJcbiAgICAgICAgbGV0IGxpc3Q7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgbGlzdCA9IGl0ZW07XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXMoaXRlbSk7XHJcbiAgICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHgubGVuZ3RoOyB0KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhJdGVtID0geFt0XTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3hJdGVtXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBlcmZvcm1zIHF1ZXJ5IG9mIG5lc3RlZCBmdW5jdGlvbiBjYWxscyBvbiB0aGUgZ2l2ZW4gbm9kZS5cclxuICAgIHF1ZXJ5KGNvbW1hbmQ6c3RyaW5nLCBub2RlKSB7XHJcbiAgICAgICAgY29uc3QgbW90aG9kcyA9dGhpcy50b1F1ZXJ5T3BlcmF0aW9uKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbm9kZS5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUl0ZW0gPSBub2RlW3FdO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KHRoaXMuaW52b2tlKG1vdGhvZHMsIG5vZGVJdGVtKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZShtb3Rob2RzLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSB3aXRoIGdpdmVuIGxpc3Qgb2YgcXVlcnkgb3BlcnRhdGlvbnNcclxuICAgIGludm9rZShvcGVyYXRpb246UXVlcnlPcGVyYXRpb24sIG5vZGUpIHtcclxuICAgICAgICBsZXQgbGlzdDphbnkgPSBbXTtcclxuICAgICAgICBpZiAoKHR5cGVvZiBub2RlID09PSBcIm9iamVjdFwiKSAmJiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSAmJiBub2RlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3BlcmF0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gdGhpcy5zdXBwb3J0ZWRNZXRob2RzW29wZXJhdGlvbi5uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uYXJncyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBvcGVyYXRpb24uYXJncy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmcgPSBvcGVyYXRpb24uYXJnc1thXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShhcmcsIG5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gob3BlcmF0aW9uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dE5vZGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBmLmFwcGx5KHRoaXMsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG9sZENvbnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25jYXRlbmF0ZShhLCBiLCBjKTogam9pbnMgYXJndW1lbnRzIGludG8gYSBzdHJpbmdcclxuICAgIC8vIGpvaW4gYXJnc1swLDEsMl1cclxuICAgIGNvbmNhdGVuYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gYXJnc1swXTtcclxuICAgICAgICBjb25zdCBkZWxpbT0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCByaWdodD0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGxlZnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQubGVuZ3RoID4gcmlnaHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyAocmlnaHQubGVuZ3RoID4gcSA/IHJpZ2h0W3FdIDogXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIChsZWZ0Lmxlbmd0aCA+IHEgPyBsZWZ0W3FdIDogXCJcIikgKyBkZWxpbSArIHJpZ2h0W3FdKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnRbcV0gKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCByaWdodC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0ICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGVmdCArIGRlbGltICsgcmlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQubGVuZ3RoID4gMSA/IHJlc3VsdCA6IHJlc3VsdFswXTtcclxuICAgIH1cclxuICAgIC8vIHNwbGl0KGl0ZW0sJywnKTogc3BsaXRzIHZhbHVlIGludG8gYSBsaXN0XHJcbiAgICAvLyBzcGxpdCBhcmdzWzBdIHdpdGggYXJnc1sxXVxyXG4gICAgc3BsaXQoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBhcmdzWzBdID8gYXJnc1swXS5zcGxpdChhcmdzWzFdKSA6IFtdO1xyXG4gICAgfVxyXG4gICAgLy8gdmFsdWVPZihwYXRoKTogIGV2YWx1YXRlcyB2YWx1ZSBvZiBhcmd1bWVudCBwYXRoXHJcbiAgICAvLyBwYXRoID0gYXJnc1swXSwgbm9kZSB0byBldmFsdWF0ZSA9IGFyZ3NbMV1cclxuICAgIHZhbHVlT2YoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgcmV0dXJuIGpwYXRoLnZhbHVlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICB9XHJcbiAgICAvLyBlYWNoKGxpc3QsbWV0aG9kKTogRm9yIGVhY2ggaXRlbSBpbiBsaXN0LCBpbnZvZGUgdGhlIGNhbGxiYWNrIG1ldGhvZFxyXG4gICAgLy8gZWFjaCBpdGVtIG9mIGFyZ3NbMF0gZXhlY3V0ZSBmdW5jdGlvbiBvZiBhcmdzWzFdXHJcbiAgICBlYWNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0ge25hbWU6IFwidmFsdWVPZlwiLCBhcmdzOiBhcmdzWzFdfTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGFyZ3NbMF0ubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGFyZ3NbMF1bcV07XHJcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShtZXRob2QsIG5vZGUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gZW5saXN0KC4uLik6IGluc2VydCBhcmd1bWVudCB2YWx1ZXMgaW50byBhIGxpc3RcclxuICAgIGVubGlzdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGFyZ3MubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSk7IC8vIG1ha2Ugc3VyZSBsYXN0IHR3byBpdGVtIGFyZSBub3Qgbm9kZSBhbmQgdGVtcGxhdGVcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gam9pbihhcnJheSwnLCcpOiBqb2lucyBpdGVtcyBvZiB0aGUgbGlzdCBpbnRvIGEgc3RyaW5nXHJcbiAgICBqb2luKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXS5sZW5ndGggPiAxID8gYXJnc1swXS5qb2luKGFyZ3NbMV0pIDogYXJnc1swXTtcclxuICAgIH1cclxuICAgIC8vIGFwcGx5KHRlbXBsYXRlLHBhdGgsYXJyYXkpOiBhcHBseSB0aGUgdGVtcGxhdGUgaW4gcm9vdCBjb250ZXh0IGZvciBlYWNoIHZhbHVlIFxyXG4gICAgLy8gdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBwYXRoLiBhcmdzWzBdIG5hbWUgdG8gYXBwbHlcclxuICAgIGFwcGx5KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1sxXSk7XHJcbiAgICAgICAgY29uc3QgcGF0aDI9IHBhdGguZnJvbUxhc3QoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5yb290Tm9kZS5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5yb290Tm9kZVtjXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LFwiPVwiLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuc3R5bGUoYXJnc1swXSwgbGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gbWF0Y2godGVtcGxhdGUscGF0aCxvcGVyYXRpb24sdmFsdWVzKTogLCBub2RlIGFyZ3NbNF1cclxuICAgIC8vIGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gZ2l2ZW4gdGVtcGxhdGUgbm9kZXMsIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFxyXG4gICAgbWF0Y2goLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUoYXJnc1swXSk7XHJcblxyXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb24gZm9yICdcIiArIGFyZ3NbMF0gKyBcIicuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzNdO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmNvbnRleHROb2RlKVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAobm9kZXMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IG5vZGVzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbY107XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGZpbHRlcihwYXRoLG9wZXJhdGlvbix2YWx1ZSk6IGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gY3VycmVudCBjb250ZXh0LCBcclxuICAgIC8vIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kIGZvciBzdHJpbmcgdmFsdWUgbWVhbnMgaW5kZXhPZi4gJyEnIG1lYW5zIG5vdCBlcXVhbCBvciBub3QgaW4uXHJcbiAgICBmaWx0ZXIoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSBhcmdzWzFdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb250ZXh0Tm9kZVthXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHYsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2YWx1ZSxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBzZWxlY3QocGF0aCk6IHNlbGVjdCB0aGUgbm9kZXMgd2l0aCBnaXZlbiBwYXRoIGluIGN1cnJlbnQgY29udGV4dFxyXG4gICAgc2VsZWN0KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0Tm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc3R5bGUodGVtcGxhdGUsIGFycmF5KTogYXBwbHkgdGhlIGdpdmVuIHRlbXBsYXRlIGZvciB0aGUgZ2l2ZW4gYXJyYXlcclxuICAgIHN0eWxlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKTtcclxuICAgIFxyXG4gICAgICAgIGlmIChhcmdzWzFdIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBhcmdzWzFdLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gYXJnc1sxXVthXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgYXR0cnMubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICBub2RlW2F0dHJdID0gdGhpcy5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGFyZ3NbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgYWRkU3VwcG9ydGluZ01ldGhvZChuYW1lLCBtZXRob2QpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZE1ldGhvZHNbbmFtZV0gPSBtZXRob2Q7XHJcbiAgICB9XHJcbiAgICAgcHJpdmF0ZSByZW1vdmVRdW90ZXMoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIChzdHIubGVuZ3RoICYmIHN0clswXSA9PT0gJ1xcJycgJiYgc3RyW3N0ci5sZW5ndGgtMV0gPT09ICdcXCcnKSA/IHN0ci5zdWJzdHJpbmcoMSxzdHIubGVuZ3RoLTEpIDogc3RyO1xyXG4gICAgfVxyXG4gICAgdG9RdWVyeU9wZXJhdGlvbihtZXRob2RzKSB7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IG1ldGhvZHMucmVwbGFjZSgvKFteJ10rKXwoJ1teJ10rJykvZywgZnVuY3Rpb24oJDAsICQxLCAkMikge1xyXG4gICAgICAgICAgICBpZiAoJDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMS5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQyOyBcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KS5yZXBsYWNlKC8nW14nXSsnL2csIGZ1bmN0aW9uIChtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2gucmVwbGFjZSgvLC9nLCAnficpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvRnVuY3Rpb25zKG9wZXJhdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB0b0Z1bmN0aW9ucyhpdGVtKXtcclxuICAgICAgICAvLyBpZiBpdGVtID0gam9pbihlbmxpc3QodmFsdWVPZihhZGRyZXNzLnN0cmVldCksdmFsdWVPZihhZGRyZXNzLmNpdHkpLHZhbHVlT2YoYWRkcmVzcy56aXBjb2RlKSksJywnKVxyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgbGV0IGogPSAtMTtcclxuICAgICAgICBsZXQgayA9IC0xO1xyXG4gICAgICAgIGxldCBjID0gMDtcclxuICAgICAgICBsZXQganNvbjogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgY2luZGV4ID0gMDsgY2luZGV4IDwgaXRlbS5sZW5ndGg7IGNpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtW2NpbmRleF0gPT09ICcoJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYysrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJyknKSB7XHJcbiAgICAgICAgICAgICAgICBjLS07XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBcnJ5ID0gKGpzb24gaW5zdGFuY2VvZiBBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGogPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkgJiYgKGogPT09IChpdGVtLmxlbmd0aCAtIDEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wibmFtZVwiXSA9IGl0ZW0uc3Vic3RyaW5nKDAsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wiYXJnc1wiXSA9IHRoaXMudG9GdW5jdGlvbnMoaXRlbS5zdWJzdHJpbmcoaSsxLGopKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbS5zdWJzdHJpbmcoaysxLCBpKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xICE9PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoayA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBjaW5kZXgpLnJlcGxhY2UoL34vZywgJywnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeC5pbmRleE9mKCcoJykgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMCAmJiAoY2luZGV4LTEgPT09IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA+PSAwICYmIGogPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcpJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChpPDAgJiYgaj4wKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcoJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfWVsc2UgaWYgKGkgPCAwICYmIGogPCAwICYmIGsgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1lbHNlIGlmIChjID09PSAwICYmIGsgPiBqKSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGpzb24ucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGpzb24uYXJncy5wdXNoKHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgaXRlbS5sZW5ndGgpLnJlcGxhY2UoL34vZywgJywnKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBsYXRlTm9kZXModGVtcGxhdGU6VGVtcGxhdGUsIG5vZGVzKSB7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBsZXQgbm9kZUxpc3QgPSBub2RlcztcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRleHQgPT09IFwicm9vdFwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGVMaXN0ID0gdGhpcy5ub2RlTGlzdCh0aGlzLnJvb3ROb2RlKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5tYXRjaCAmJiB0ZW1wbGF0ZS5tYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHRlbXBsYXRlLm1hdGNoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgbm9kZUxpc3QubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2RlTGlzdFt6XTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLnZhbHVlT2Yobm9kZSkgPT09IHRlbXBsYXRlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZXMpIHtcclxuICAgICAgICAgICAgbGlzdCA9IG5vZGVMaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kXHJcbiAgICAvLyBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZU9wZXJhdGlvbihsZWZ0LCBvcGVyYXRpb24sIHJpZ2h0KSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJpZ2h0W2ldLmluZGV4T2YobGVmdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAhZjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCJpblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocmlnaHQuaW5kZXhPZihsZWZ0KSA+PSAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiIVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAobGVmdCAhPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI+XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpID4gcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI8XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpIDwgcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb2ZmUG9vbCh0ZW1wbGF0ZSxrZXkpOiBXaWxsIHVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcG9vbCB0byBwaWNrIHVwIGl0ZW0ocykgd2l0aCBnaXZlbiBrZXkocylcclxuICAgIHByaXZhdGUgb2ZmUG9vbCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHBvb2wgPSB0aGlzLmdsb2JhbFBvb2xbYXJnc1swXV07XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IGFyZ3NbMV07XHJcbiAgICAgICAgaWYgKCFwb29sKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQXR0ZW1wdGluZyB0byBhY2Nlc3MgcG9vbCAnXCIgKyBhcmdzWzBdICsgXCInIHRoYXQgaXMgbm90IGNyZWF0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGtleXMgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHo9MDsgeiA8IGtleXMubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbel07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gcG9vbFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCB3ZSB0aHJvdyBoZXJlP1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5c107XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgaW5pdFRlbXBsYXRlcyhsaXN0KSB7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IGFueT0gbGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGVzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBzdHlsZXNbal07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSB0ZW1wbGF0ZS5zdHlsZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5zdHlsZVtrZXldID0gdGhpcy50b1F1ZXJ5T3BlcmF0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGUubmFtZV0gPSB0ZW1wbGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbml0UG9vbHModGVtcGxhdGVzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKHRlbXBsYXRlcyk7XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9ucy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsUG9vbCA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IHN0cmluZyA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZSh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIGlmICh0LmluUG9vbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9vbCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHQuaW5Qb29sKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoPSB0Lm1hdGNoO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZXM9IHRoaXMucm9vdE5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1wYXRoID0gdGhpcy5qWFBhdGhGb3IobWF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8IG5vZGVzLmxlbmd0aDsgaysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IG1wYXRoLnZhbHVlT2Yobm9kZXNba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiA9PT0gdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9vbFtwYXRoLnZhbHVlT2Yobm9kZXNba10pXSA9IG5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbFBvb2xbdC5uYW1lXSA9IHBvb2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19