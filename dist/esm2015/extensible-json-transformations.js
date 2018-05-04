import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @record
 */

class JXPath {
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
        let /** @type {?} */ pItem = node;
        for (let /** @type {?} */ i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const /** @type {?} */ list = [];
                for (let /** @type {?} */ q = 0; q < this.path.length; q++) {
                    const /** @type {?} */ item = pItem[q];
                    const /** @type {?} */ x = this._nodeOf(item[path[i]], path.slice(i + 1, path.length));
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
        let /** @type {?} */ pItem = node;
        for (let /** @type {?} */ i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const /** @type {?} */ list = [];
                for (let /** @type {?} */ q = 0; q < this.path.length; q++) {
                    const /** @type {?} */ item = pItem[q];
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
class Inquirer {
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
        let /** @type {?} */ p = this.pathPool[path];
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
        const /** @type {?} */ item = node === null ? this.rootNode : node;
        let /** @type {?} */ list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            const /** @type {?} */ x = Object.keys(item);
            list = [];
            for (let /** @type {?} */ t = 0; t < x.length; t++) {
                const /** @type {?} */ xItem = x[t];
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
        const /** @type {?} */ mothods = this.toQueryOperation(command);
        if (node instanceof Array) {
            let /** @type {?} */ list = [];
            for (let /** @type {?} */ q = 0; q < node.length; q++) {
                const /** @type {?} */ nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem));
            }
            
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
        let /** @type {?} */ list = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        }
        else if (typeof operation === 'object') {
            const /** @type {?} */ f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (let /** @type {?} */ a = 0; a < operation.args.length; a++) {
                        const /** @type {?} */ arg = operation.args[a];
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
                const /** @type {?} */ oldContext = this.contextNode;
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
        const /** @type {?} */ left = args[0];
        const /** @type {?} */ delim = args[1];
        const /** @type {?} */ right = args[2];
        const /** @type {?} */ result = [];
        if (left instanceof Array) {
            if (right instanceof Array) {
                if (left.length > right.length) {
                    for (let /** @type {?} */ q = 0; q < left.length; q++) {
                        result.push(left[q] + delim + (right.length > q ? right[q] : ""));
                    }
                    
                }
                else {
                    for (let /** @type {?} */ q = 0; q < right.length; q++) {
                        result.push((left.length > q ? left[q] : "") + delim + right[q]);
                    }
                    
                }
            }
            else {
                for (let /** @type {?} */ q = 0; q < left.length; q++) {
                    result.push(left[q] + delim + right);
                }
                
            }
        }
        else {
            if (right instanceof Array) {
                for (let /** @type {?} */ q = 0; q < right.length; q++) {
                    result.push(left + delim + right[q]);
                }
                
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
        const /** @type {?} */ jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    each(...args) {
        const /** @type {?} */ list = [];
        const /** @type {?} */ method = { name: "valueOf", args: args[1] };
        for (let /** @type {?} */ q = 0; q < args[0].length; q++) {
            const /** @type {?} */ node = args[0][q];
            list.push(this.invoke(method, node));
        }
        
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    enlist(...args) {
        const /** @type {?} */ list = [];
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
        const /** @type {?} */ path = this.jXPathFor(args[1]);
        const /** @type {?} */ path2 = path.fromLast();
        const /** @type {?} */ values = args[2];
        let /** @type {?} */ list = [];
        for (let /** @type {?} */ c = 0; c < this.rootNode.length; c++) {
            const /** @type {?} */ node = this.rootNode[c];
            const /** @type {?} */ value = path.nodeOf(node);
            if (value instanceof Array) {
                for (let /** @type {?} */ d = 0; d < value.length; d++) {
                    const /** @type {?} */ v = value[d];
                    const /** @type {?} */ x = path2.valueOf(v);
                    if (this.evaluateOperation(x, "=", values)) {
                        list.push(v);
                    }
                }
            }
            else {
                const /** @type {?} */ x = path2.valueOf(node);
                if (this.evaluateOperation(x, "=", values)) {
                    list.push(node);
                }
            }
        }
        
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
        const /** @type {?} */ template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        const /** @type {?} */ path = this.jXPathFor(args[1]);
        const /** @type {?} */ path2 = path.fromLast();
        const /** @type {?} */ operation = args[2];
        const /** @type {?} */ values = args[3];
        const /** @type {?} */ nodes = this.templateNodes(template, this.contextNode);
        const /** @type {?} */ list = [];
        if (nodes instanceof Array) {
            for (let /** @type {?} */ c = 0; c < nodes.length; c++) {
                const /** @type {?} */ node = nodes[c];
                const /** @type {?} */ value = path.nodeOf(node);
                if (value instanceof Array) {
                    for (let /** @type {?} */ d = 0; d < value.length; d++) {
                        const /** @type {?} */ v = value[d];
                        const /** @type {?} */ x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    }
                }
                else {
                    const /** @type {?} */ x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            }
            
        }
        else {
            const /** @type {?} */ value = path.nodeOf(nodes);
            if (value instanceof Array) {
                for (let /** @type {?} */ d = 0; d < value.length; d++) {
                    const /** @type {?} */ v = value[d];
                    const /** @type {?} */ x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                }
            }
            else {
                const /** @type {?} */ x = path2.valueOf(nodes);
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
        const /** @type {?} */ path = this.jXPathFor(args[0]);
        const /** @type {?} */ operation = args[1];
        const /** @type {?} */ values = args[2];
        const /** @type {?} */ list = [];
        for (let /** @type {?} */ a = 0; a < this.contextNode.length; a++) {
            const /** @type {?} */ node = this.contextNode[a];
            const /** @type {?} */ value = path.valueOf(node);
            if (value instanceof Array) {
                for (let /** @type {?} */ d = 0; d < value.length; d++) {
                    const /** @type {?} */ v = value[d];
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
        const /** @type {?} */ path = this.jXPathFor(args[0]);
        let /** @type {?} */ list = [];
        if (this.contextNode instanceof Array) {
            for (let /** @type {?} */ d = 0; d < this.contextNode.length; d++) {
                const /** @type {?} */ node = this.contextNode[d];
                const /** @type {?} */ value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            }
        }
        else {
            const /** @type {?} */ value = path.nodeOf(this.contextNode);
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
        const /** @type {?} */ template = this.templateForName(args[0]);
        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        const /** @type {?} */ result = [];
        const /** @type {?} */ attrs = Object.keys(template.style);
        if (args[1] instanceof Array) {
            for (let /** @type {?} */ a = 0; a < args[1].length; a++) {
                const /** @type {?} */ item = args[1][a];
                const /** @type {?} */ node = {};
                for (let /** @type {?} */ d = 0; d < attrs.length; d++) {
                    const /** @type {?} */ attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        }
        else {
            const /** @type {?} */ node = {};
            for (let /** @type {?} */ d = 0; d < attrs.length; d++) {
                const /** @type {?} */ attr = attrs[d];
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
        const /** @type {?} */ operations = methods.replace(/([^']+)|('[^']+')/g, function ($0, $1, $2) {
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
        // if item = join(enlist(valueOf(address.street),valueOf(address.city),valueOf(address.zipcode)),',')
        let /** @type {?} */ i = -1;
        let /** @type {?} */ j = -1;
        let /** @type {?} */ k = -1;
        let /** @type {?} */ c = 0;
        let /** @type {?} */ json = {};
        for (let /** @type {?} */ cindex = 0; cindex < item.length; cindex++) {
            if (item[cindex] === '(') {
                if (c === 0) {
                    i = cindex;
                }
                c++;
            }
            else if (item[cindex] === ')') {
                c--;
                if (c === 0) {
                    const /** @type {?} */ isArry = (json instanceof Array);
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
                    const /** @type {?} */ isArry = (json instanceof Array);
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
                        const /** @type {?} */ x = this.removeQuotes(item.substring(k + 1, cindex).replace(/~/g, ','));
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
        let /** @type {?} */ list = [];
        let /** @type {?} */ nodeList = nodes;
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
            const /** @type {?} */ path = this.jXPathFor(template.match);
            for (let /** @type {?} */ z = 0; z < nodeList.length; z++) {
                const /** @type {?} */ node = nodeList[z];
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
        let /** @type {?} */ result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                for (let /** @type {?} */ i = 0; i < right.length; i++) {
                    if (left == right[i]) {
                        result = true;
                        break;
                    }
                }
            }
            else if (operation === "in") {
                for (let /** @type {?} */ i = 0; i < right.length; i++) {
                    if (right[i].indexOf(left) >= 0) {
                        result = true;
                        break;
                    }
                }
                
            }
            else if (operation === "!") {
                let /** @type {?} */ f = false;
                for (let /** @type {?} */ i = 0; i < right.length; i++) {
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
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    offPool(...args) {
        const /** @type {?} */ list = [];
        const /** @type {?} */ pool = this.globalPool[args[0]];
        const /** @type {?} */ keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array) {
            for (let /** @type {?} */ z = 0; z < keys.length; z++) {
                const /** @type {?} */ key = keys[z];
                const /** @type {?} */ node = pool[key];
                if (node) {
                    list.push(node);
                }
                else {
                    // should we throw here?
                }
            }
        }
        else {
            const /** @type {?} */ node = pool[keys];
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
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
            const /** @type {?} */ template = list[i];
            const /** @type {?} */ styles = Object.keys(template.style);
            for (let /** @type {?} */ j = 0; j < styles.length; j++) {
                const /** @type {?} */ key = styles[j];
                const /** @type {?} */ method = template.style[key];
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
        const /** @type {?} */ list = Object.keys(templates);
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
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
            const /** @type {?} */ template = list[i];
            const /** @type {?} */ t = this.templateForName(template);
            if (t.inPool) {
                const /** @type {?} */ pool = {};
                const /** @type {?} */ path = this.jXPathFor(t.inPool);
                const /** @type {?} */ match = t.match;
                const /** @type {?} */ nodes = this.rootNode;
                if (match && t.value) {
                    const /** @type {?} */ mpath = this.jXPathFor(match);
                    for (let /** @type {?} */ k = 0; k < nodes.length; k++) {
                        const /** @type {?} */ v = mpath.valueOf(nodes[k]);
                        if (v === t.value) {
                            pool[path.valueOf(nodes[k])] = nodes[k];
                        }
                    }
                }
                else {
                    for (let /** @type {?} */ k = 0; k < nodes.length; k++) {
                        pool[path.valueOf(nodes[k])] = nodes[k];
                    }
                }
                this.globalPool[t.name] = pool;
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class Styler {
    /**
     * @param {?} transformations
     */
    constructor(transformations) {
        this.inquirer = new Inquirer();
        this.transformations = transformations;
        this.inquirer.initTemplates(this.transformations.templates);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    changeRootNode(node) {
        this.inquirer.setRootNode(node);
    }
    /**
     * @return {?}
     */
    transform() {
        let /** @type {?} */ result = [];
        const /** @type {?} */ template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            const /** @type {?} */ attrs = Object.keys(template.style);
            const /** @type {?} */ nodeList = this.inquirer.templateNodes(template, this.inquirer.nodeList(null));
            for (let /** @type {?} */ i = 0; i < nodeList.length; i++) {
                const /** @type {?} */ currentNode = nodeList[i];
                const /** @type {?} */ resultingNode = {};
                for (let /** @type {?} */ j = 0; j < attrs.length; j++) {
                    const /** @type {?} */ attr = attrs[j];
                    resultingNode[attr] = this.inquirer.invoke(template.style[attr], currentNode);
                }
                
                result.push(resultingNode);
            }
            
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            const /** @type {?} */ functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class XjsltComponent {
    constructor() {
        this.node = {};
        this.ontransformation = new EventEmitter();
        this.onerror = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.node && this.transformations) {
            if (!this.styler) {
                this.styler = new Styler(this.transformations);
            }
            this.styler.changeRootNode(this.node);
            try {
                this.ontransformation.emit(this.styler.transform());
            }
            catch (/** @type {?} */ e) {
                console.log(e);
                this.onerror.emit(e);
            }
        }
    }
    /**
     * @param {?} chages
     * @return {?}
     */
    ngOnChanges(chages) {
        if (chages.transformations) {
            this.styler = undefined;
            setTimeout(this.ngOnInit.bind(this), 333);
        }
        else if (chages.node) {
            setTimeout(this.ngOnInit.bind(this), 333);
        }
    }
}
XjsltComponent.decorators = [
    { type: Component, args: [{
                selector: 'xjslt',
                template: ``,
                styles: [],
            },] },
];
/** @nocollapse */
XjsltComponent.ctorParameters = () => [];
XjsltComponent.propDecorators = {
    "node": [{ type: Input, args: ["node",] },],
    "transformations": [{ type: Input, args: ["transformations",] },],
    "ontransformation": [{ type: Output, args: ["ontransformation",] },],
    "onerror": [{ type: Output, args: ["onerror",] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class XjsltModule {
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
            },] },
];
/** @nocollapse */
XjsltModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { XjsltComponent, Styler, JXPath, Inquirer, XjsltModule };
//# sourceMappingURL=extensible-json-transformations.js.map
