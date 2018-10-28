import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
                }
                else {
                    for (let q = 0; q < right.length; q++) {
                        result.push((left.length > q ? left[q] : "") + delim + right[q]);
                    }
                }
            }
            else {
                for (let q = 0; q < left.length; q++) {
                    result.push(left[q] + delim + right);
                }
            }
        }
        else {
            if (right instanceof Array) {
                for (let q = 0; q < right.length; q++) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
        /** @type {?} */
        let result = [];
        /** @type {?} */
        const template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            /** @type {?} */
            const attrs = Object.keys(template.style);
            /** @type {?} */
            const nodeList = this.inquirer.templateNodes(template, this.inquirer.nodeList(null));
            for (let i = 0; i < nodeList.length; i++) {
                /** @type {?} */
                const currentNode = nodeList[i];
                /** @type {?} */
                const resultingNode = {};
                for (let j = 0; j < attrs.length; j++) {
                    /** @type {?} */
                    const attr = attrs[j];
                    resultingNode[attr] = this.inquirer.invoke(template.style[attr], currentNode);
                }
                result.push(resultingNode);
            }
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            /** @type {?} */
            const functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
            catch (e) {
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
                template: ``
            }] }
];
XjsltComponent.propDecorators = {
    node: [{ type: Input, args: ["node",] }],
    transformations: [{ type: Input, args: ["transformations",] }],
    ontransformation: [{ type: Output, args: ["ontransformation",] }],
    onerror: [{ type: Output, args: ["onerror",] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { XjsltComponent, Styler, JXPath, Inquirer, XjsltModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy9pbnF1aXJlci50cyIsIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy90cmFuc2Zvcm1hdGlvbnMudHMiLCJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9zcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogSW50ZW50aW9uYWxseSBhdm9pZGluZyB1c2Ugb2YgbWFwIGNhbGwgb24gbGlzdCB0byByZWR1Y2UgdGhlIGNhbGwgc3RhY2sgbnVtYmVycy5cclxuICogT24gbGFyZ2Ugc2NhbGUgSlNPTiwgY2FsbCBzdGFjayBiZWNvbWVzIGEgcHJvYmxlbSB0byBiZSBhdm9pZGVkLlxyXG4gKi9cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIG1hdGNoPzogc3RyaW5nLFxyXG4gICAgdmFsdWU/OiBzdHJpbmcsXHJcbiAgICBjb250ZXh0OiBzdHJpbmcsXHJcbiAgICBpblBvb2w/OiBzdHJpbmcsXHJcbiAgICBzdHlsZTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcGVyYXRpb24ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgYXJncz86IFF1ZXJ5T3BlcmF0aW9uW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEpYUGF0aCB7XHJcbiAgICBwcml2YXRlIHBhdGg7XHJcbiAgICBjb25zdHJ1Y3RvcihqcGF0aCl7XHJcbiAgICAgICAgdGhpcy5wYXRoID0ganBhdGguc3BsaXQoXCIuXCIpO1xyXG4gICAgfVxyXG4gICAgZnJvbUxhc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKWFBhdGgodGhpcy5wYXRoW3RoaXMucGF0aC5sZW5ndGggLSAxXSk7XHJcbiAgICB9XHJcbiAgICBub2RlT2Yobm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX25vZGVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBJdGVtW3FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9ub2RlT2YoaXRlbVtwYXRoW2ldXSwgcGF0aC5zbGljZShpKzEscGF0aC5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiB4ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcEl0ZW07XHJcbiAgICB9XHJcbiAgICB2YWx1ZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVPZihub2RlLCB0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfdmFsdWVPZihub2RlLCBwYXRoOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBwSXRlbSA9IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBJdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCB0aGlzLnBhdGgubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLl92YWx1ZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBwSXRlbSA9IGxpc3Q7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW0gPyBwSXRlbVtwYXRoW2ldXSA6IHBJdGVtO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgIHBJdGVtID0gcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5xdWlyZXIgIHtcclxuXHJcbiAgICBwcml2YXRlIHN1cHBvcnRlZE1ldGhvZHMgPSB7fTtcclxuICAgIHByaXZhdGUgdGVtcGxhdGVzID0ge307XHJcbiAgICBwcml2YXRlIHJvb3ROb2RlO1xyXG4gICAgcHJpdmF0ZSBjb250ZXh0Tm9kZTsgLy8gc2hvdWxkIGJlIHNldCBiZWZvcmUgYW55IGNhbGwgaXMgbWFkZS4uLiB0aGlzIGlzIHRvIGF2b2lkIGNhbGwgc3RhY2sgb3ZlcmZsb3cgaW4gZXh0cmVtZWx0IGxhcmdlIEpTT05cclxuICAgIHByaXZhdGUgZ2xvYmFsUG9vbCA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYXRoUG9vbCA9IHt9Oy8vIHRvIGF2b2lkIHN0YWNrb3ZlcmZsb3cuLi4gYW5kIHBlcmZvcm0gZmFzdGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwidmFsdWVPZlwiLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVhY2hcIiwgdGhpcy5lYWNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzcGxpdFwiLCB0aGlzLnNwbGl0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJjb25jYXRcIiwgdGhpcy5jb25jYXRlbmF0ZSk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZW5saXN0XCIsIHRoaXMuZW5saXN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJqb2luXCIsIHRoaXMuam9pbik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiZmlsdGVyXCIsIHRoaXMuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3QpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInN0eWxlXCIsIHRoaXMuc3R5bGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcIm1hdGNoXCIsIHRoaXMubWF0Y2gpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImFwcGx5XCIsIHRoaXMuYXBwbHkpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJvZmZQb29sXCIsIHRoaXMub2ZmUG9vbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBqWFBhdGhGb3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHA6SlhQYXRoID0gdGhpcy5wYXRoUG9vbFtwYXRoXTtcclxuICAgICAgICBpZiAoIXApIHtcclxuICAgICAgICAgICAgcCA9IG5ldyBKWFBhdGgocGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aFBvb2xbcGF0aF0gPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSb290Tm9kZShub2RlOmFueSkge1xyXG4gICAgICAgIHRoaXMucm9vdE5vZGUgPSB0aGlzLm5vZGVMaXN0KG5vZGUpO1xyXG4gICAgICAgIHRoaXMuaW5pdFBvb2xzKHRoaXMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuICAgIHNldENvbnRleHROb2RlKG5vZGUpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgIH1cclxuICAgIHRlbXBsYXRlRm9yTmFtZShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzW25hbWVdO1xyXG4gICAgfVxyXG4gICAgLy8gaWYgbm9kZSBpcyBudWxsLCByb290IG5vZGUgd2lsbCBiZSB1c2VkLlxyXG4gICAgbm9kZUxpc3Qobm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBub2RlID09PSBudWxsID8gdGhpcy5yb290Tm9kZSA6IG5vZGU7XHJcbiAgICAgICAgbGV0IGxpc3Q7XHJcblxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgbGlzdCA9IGl0ZW07XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXMoaXRlbSk7XHJcbiAgICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHgubGVuZ3RoOyB0KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhJdGVtID0geFt0XTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW3hJdGVtXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW1beEl0ZW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBlcmZvcm1zIHF1ZXJ5IG9mIG5lc3RlZCBmdW5jdGlvbiBjYWxscyBvbiB0aGUgZ2l2ZW4gbm9kZS5cclxuICAgIHF1ZXJ5KGNvbW1hbmQ6c3RyaW5nLCBub2RlKSB7XHJcbiAgICAgICAgY29uc3QgbW90aG9kcyA9dGhpcy50b1F1ZXJ5T3BlcmF0aW9uKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbm9kZS5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUl0ZW0gPSBub2RlW3FdO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KHRoaXMuaW52b2tlKG1vdGhvZHMsIG5vZGVJdGVtKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZShtb3Rob2RzLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSB3aXRoIGdpdmVuIGxpc3Qgb2YgcXVlcnkgb3BlcnRhdGlvbnNcclxuICAgIGludm9rZShvcGVyYXRpb246UXVlcnlPcGVyYXRpb24sIG5vZGUpIHtcclxuICAgICAgICBsZXQgbGlzdDphbnkgPSBbXTtcclxuICAgICAgICBpZiAoKHR5cGVvZiBub2RlID09PSBcIm9iamVjdFwiKSAmJiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSAmJiBub2RlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3BlcmF0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gdGhpcy5zdXBwb3J0ZWRNZXRob2RzW29wZXJhdGlvbi5uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uYXJncyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBvcGVyYXRpb24uYXJncy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmcgPSBvcGVyYXRpb24uYXJnc1thXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShhcmcsIG5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gob3BlcmF0aW9uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dE5vZGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBmLmFwcGx5KHRoaXMsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG9sZENvbnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0ID0gb3BlcmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25jYXRlbmF0ZShhLCBiLCBjKTogam9pbnMgYXJndW1lbnRzIGludG8gYSBzdHJpbmdcclxuICAgIC8vIGpvaW4gYXJnc1swLDEsMl1cclxuICAgIGNvbmNhdGVuYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gYXJnc1swXTtcclxuICAgICAgICBjb25zdCBkZWxpbT0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCByaWdodD0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGxlZnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQubGVuZ3RoID4gcmlnaHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyAocmlnaHQubGVuZ3RoID4gcSA/IHJpZ2h0W3FdIDogXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIChsZWZ0Lmxlbmd0aCA+IHEgPyBsZWZ0W3FdIDogXCJcIikgKyBkZWxpbSArIHJpZ2h0W3FdKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBsZWZ0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIGxlZnRbcV0gKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCByaWdodC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0ICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGVmdCArIGRlbGltICsgcmlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQubGVuZ3RoID4gMSA/IHJlc3VsdCA6IHJlc3VsdFswXTtcclxuICAgIH1cclxuICAgIC8vIHNwbGl0KGl0ZW0sJywnKTogc3BsaXRzIHZhbHVlIGludG8gYSBsaXN0XHJcbiAgICAvLyBzcGxpdCBhcmdzWzBdIHdpdGggYXJnc1sxXVxyXG4gICAgc3BsaXQoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBhcmdzWzBdID8gYXJnc1swXS5zcGxpdChhcmdzWzFdKSA6IFtdO1xyXG4gICAgfVxyXG4gICAgLy8gdmFsdWVPZihwYXRoKTogIGV2YWx1YXRlcyB2YWx1ZSBvZiBhcmd1bWVudCBwYXRoXHJcbiAgICAvLyBwYXRoID0gYXJnc1swXSwgbm9kZSB0byBldmFsdWF0ZSA9IGFyZ3NbMV1cclxuICAgIHZhbHVlT2YoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgcmV0dXJuIGpwYXRoLnZhbHVlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICB9XHJcbiAgICAvLyBlYWNoKGxpc3QsbWV0aG9kKTogRm9yIGVhY2ggaXRlbSBpbiBsaXN0LCBpbnZvZGUgdGhlIGNhbGxiYWNrIG1ldGhvZFxyXG4gICAgLy8gZWFjaCBpdGVtIG9mIGFyZ3NbMF0gZXhlY3V0ZSBmdW5jdGlvbiBvZiBhcmdzWzFdXHJcbiAgICBlYWNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0ge25hbWU6IFwidmFsdWVPZlwiLCBhcmdzOiBhcmdzWzFdfTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IGFyZ3NbMF0ubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGFyZ3NbMF1bcV07XHJcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmludm9rZShtZXRob2QsIG5vZGUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gZW5saXN0KC4uLik6IGluc2VydCBhcmd1bWVudCB2YWx1ZXMgaW50byBhIGxpc3RcclxuICAgIGVubGlzdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGFyZ3MubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSk7IC8vIG1ha2Ugc3VyZSBsYXN0IHR3byBpdGVtIGFyZSBub3Qgbm9kZSBhbmQgdGVtcGxhdGVcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gam9pbihhcnJheSwnLCcpOiBqb2lucyBpdGVtcyBvZiB0aGUgbGlzdCBpbnRvIGEgc3RyaW5nXHJcbiAgICBqb2luKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXS5sZW5ndGggPiAxID8gYXJnc1swXS5qb2luKGFyZ3NbMV0pIDogYXJnc1swXTtcclxuICAgIH1cclxuICAgIC8vIGFwcGx5KHRlbXBsYXRlLHBhdGgsYXJyYXkpOiBhcHBseSB0aGUgdGVtcGxhdGUgaW4gcm9vdCBjb250ZXh0IGZvciBlYWNoIHZhbHVlIFxyXG4gICAgLy8gdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBwYXRoLiBhcmdzWzBdIG5hbWUgdG8gYXBwbHlcclxuICAgIGFwcGx5KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1sxXSk7XHJcbiAgICAgICAgY29uc3QgcGF0aDI9IHBhdGguZnJvbUxhc3QoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5yb290Tm9kZS5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5yb290Tm9kZVtjXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdmFsdWUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LFwiPVwiLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuc3R5bGUoYXJnc1swXSwgbGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gbWF0Y2godGVtcGxhdGUscGF0aCxvcGVyYXRpb24sdmFsdWVzKTogLCBub2RlIGFyZ3NbNF1cclxuICAgIC8vIGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gZ2l2ZW4gdGVtcGxhdGUgbm9kZXMsIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFxyXG4gICAgbWF0Y2goLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUoYXJnc1swXSk7XHJcblxyXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIFRlbXBsYXRlIGRlZmluaXRpb24gZm9yICdcIiArIGFyZ3NbMF0gKyBcIicuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1syXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzNdO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmNvbnRleHROb2RlKVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAobm9kZXMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IG5vZGVzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbY107XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yodik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGZpbHRlcihwYXRoLG9wZXJhdGlvbix2YWx1ZSk6IGZvciB2YWx1ZSBvZiB0YXJnZXQgaW4gY3VycmVudCBjb250ZXh0LCBcclxuICAgIC8vIGV2YWx1YXRlIG9wZXJhdGlvbiBmb3IgZ2l2ZW4gdmFsdWUocykuIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kIGZvciBzdHJpbmcgdmFsdWUgbWVhbnMgaW5kZXhPZi4gJyEnIG1lYW5zIG5vdCBlcXVhbCBvciBub3QgaW4uXHJcbiAgICBmaWx0ZXIoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzBdKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSBhcmdzWzFdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb250ZXh0Tm9kZVthXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLnZhbHVlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHYsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2YWx1ZSxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBzZWxlY3QocGF0aCk6IHNlbGVjdCB0aGUgbm9kZXMgd2l0aCBnaXZlbiBwYXRoIGluIGN1cnJlbnQgY29udGV4dFxyXG4gICAgc2VsZWN0KC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0Tm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgdGhpcy5jb250ZXh0Tm9kZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2YodGhpcy5jb250ZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc3R5bGUodGVtcGxhdGUsIGFycmF5KTogYXBwbHkgdGhlIGdpdmVuIHRlbXBsYXRlIGZvciB0aGUgZ2l2ZW4gYXJyYXlcclxuICAgIHN0eWxlKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKTtcclxuICAgIFxyXG4gICAgICAgIGlmIChhcmdzWzFdIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBhcmdzWzFdLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gYXJnc1sxXVthXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgYXR0cnMubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbZF07XHJcbiAgICAgICAgICAgICAgICBub2RlW2F0dHJdID0gdGhpcy5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGFyZ3NbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgYWRkU3VwcG9ydGluZ01ldGhvZChuYW1lLCBtZXRob2QpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRlZE1ldGhvZHNbbmFtZV0gPSBtZXRob2Q7XHJcbiAgICB9XHJcbiAgICAgcHJpdmF0ZSByZW1vdmVRdW90ZXMoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIChzdHIubGVuZ3RoICYmIHN0clswXSA9PT0gJ1xcJycgJiYgc3RyW3N0ci5sZW5ndGgtMV0gPT09ICdcXCcnKSA/IHN0ci5zdWJzdHJpbmcoMSxzdHIubGVuZ3RoLTEpIDogc3RyO1xyXG4gICAgfVxyXG4gICAgdG9RdWVyeU9wZXJhdGlvbihtZXRob2RzKSB7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IG1ldGhvZHMucmVwbGFjZSgvKFteJ10rKXwoJ1teJ10rJykvZywgZnVuY3Rpb24oJDAsICQxLCAkMikge1xyXG4gICAgICAgICAgICBpZiAoJDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMS5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQyOyBcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KS5yZXBsYWNlKC8nW14nXSsnL2csIGZ1bmN0aW9uIChtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2gucmVwbGFjZSgvLC9nLCAnficpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvRnVuY3Rpb25zKG9wZXJhdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB0b0Z1bmN0aW9ucyhpdGVtKXtcclxuICAgICAgICAvLyBpZiBpdGVtID0gam9pbihlbmxpc3QodmFsdWVPZihhZGRyZXNzLnN0cmVldCksdmFsdWVPZihhZGRyZXNzLmNpdHkpLHZhbHVlT2YoYWRkcmVzcy56aXBjb2RlKSksJywnKVxyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgbGV0IGogPSAtMTtcclxuICAgICAgICBsZXQgayA9IC0xO1xyXG4gICAgICAgIGxldCBjID0gMDtcclxuICAgICAgICBsZXQganNvbjogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgY2luZGV4ID0gMDsgY2luZGV4IDwgaXRlbS5sZW5ndGg7IGNpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtW2NpbmRleF0gPT09ICcoJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYysrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bY2luZGV4XSA9PT0gJyknKSB7XHJcbiAgICAgICAgICAgICAgICBjLS07XHJcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBcnJ5ID0gKGpzb24gaW5zdGFuY2VvZiBBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGogPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkgJiYgKGogPT09IChpdGVtLmxlbmd0aCAtIDEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wibmFtZVwiXSA9IGl0ZW0uc3Vic3RyaW5nKDAsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW1wiYXJnc1wiXSA9IHRoaXMudG9GdW5jdGlvbnMoaXRlbS5zdWJzdHJpbmcoaSsxLGopKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbS5zdWJzdHJpbmcoaysxLCBpKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xICE9PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoayA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBjaW5kZXgpLnJlcGxhY2UoL34vZywgJywnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeC5pbmRleE9mKCcoJykgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMCAmJiAoY2luZGV4LTEgPT09IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA+PSAwICYmIGogPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcpJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChpPDAgJiYgaj4wKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaW5jb3JyZWN0IG1ldGhvZCBjYWxsIGRlY2xhcmF0aW9uLiBNaXNzaW5nICcoJ1wiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfWVsc2UgaWYgKGkgPCAwICYmIGogPCAwICYmIGsgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1lbHNlIGlmIChjID09PSAwICYmIGsgPiBqKSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGpzb24ucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGpzb24uYXJncy5wdXNoKHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgaXRlbS5sZW5ndGgpLnJlcGxhY2UoL34vZywgJywnKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBsYXRlTm9kZXModGVtcGxhdGU6VGVtcGxhdGUsIG5vZGVzKSB7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBsZXQgbm9kZUxpc3QgPSBub2RlcztcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRleHQgPT09IFwicm9vdFwiKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6XCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGVMaXN0ID0gdGhpcy5ub2RlTGlzdCh0aGlzLnJvb3ROb2RlKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5tYXRjaCAmJiB0ZW1wbGF0ZS5tYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHRlbXBsYXRlLm1hdGNoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgbm9kZUxpc3QubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2RlTGlzdFt6XTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLnZhbHVlT2Yobm9kZSkgPT09IHRlbXBsYXRlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZXMpIHtcclxuICAgICAgICAgICAgbGlzdCA9IG5vZGVMaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIFN1cHBvcnRlZCBvcGVyYXRpb25zIGFyZSBgPSw8LD4saW4sIWAuICdpbicgZm9yIGxpc3QgdmFsdWVzIG1lYW4gY29udGFpbnMgYW5kXHJcbiAgICAvLyBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZU9wZXJhdGlvbihsZWZ0LCBvcGVyYXRpb24sIHJpZ2h0KSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09IFwiPVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJpZ2h0W2ldLmluZGV4T2YobGVmdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0ID09IHJpZ2h0W2ldKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAhZjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCJpblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocmlnaHQuaW5kZXhPZihsZWZ0KSA+PSAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiIVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAobGVmdCAhPT0gcmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI+XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpID4gcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCI8XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChwYXJzZUZsb2F0KGxlZnQpIDwgcGFyc2VGbG9hdChyaWdodCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb2ZmUG9vbCh0ZW1wbGF0ZSxrZXkpOiBXaWxsIHVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcG9vbCB0byBwaWNrIHVwIGl0ZW0ocykgd2l0aCBnaXZlbiBrZXkocylcclxuICAgIHByaXZhdGUgb2ZmUG9vbCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHBvb2wgPSB0aGlzLmdsb2JhbFBvb2xbYXJnc1swXV07XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IGFyZ3NbMV07XHJcbiAgICAgICAgaWYgKCFwb29sKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQXR0ZW1wdGluZyB0byBhY2Nlc3MgcG9vbCAnXCIgKyBhcmdzWzBdICsgXCInIHRoYXQgaXMgbm90IGNyZWF0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGtleXMgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHo9MDsgeiA8IGtleXMubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbel07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gcG9vbFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCB3ZSB0aHJvdyBoZXJlP1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5c107XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgaW5pdFRlbXBsYXRlcyhsaXN0KSB7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IGFueT0gbGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGVzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBzdHlsZXNbal07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSB0ZW1wbGF0ZS5zdHlsZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5zdHlsZVtrZXldID0gdGhpcy50b1F1ZXJ5T3BlcmF0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGUubmFtZV0gPSB0ZW1wbGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbml0UG9vbHModGVtcGxhdGVzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKHRlbXBsYXRlcyk7XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9ucy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gZmluZCByb290IG5vZGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsUG9vbCA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IHN0cmluZyA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZSh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIGlmICh0LmluUG9vbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9vbCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKHQuaW5Qb29sKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoPSB0Lm1hdGNoO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZXM9IHRoaXMucm9vdE5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1wYXRoID0gdGhpcy5qWFBhdGhGb3IobWF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8IG5vZGVzLmxlbmd0aDsgaysrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IG1wYXRoLnZhbHVlT2Yobm9kZXNba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiA9PT0gdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9vbFtwYXRoLnZhbHVlT2Yobm9kZXNba10pXSA9IG5vZGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbFBvb2xbdC5uYW1lXSA9IHBvb2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSlhQYXRoLCBJbnF1aXJlciwgVGVtcGxhdGUgfSBmcm9tICcuL2lucXVpcmVyJztcclxuLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtYXRpb25zIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGltcG9ydFVybHM/OnN0cmluZ1tdLFxyXG4gICAgcm9vdFRlbXBsYXRlOiBzdHJpbmcsXHJcbiAgICBvblJlc3VsdD86IHN0cmluZyxcclxuICAgIHRlbXBsYXRlczogVGVtcGxhdGVbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3R5bGVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuICAgIHByaXZhdGUgaW5xdWlyZXI6SW5xdWlyZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtYXRpb25zOlRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIgPSBuZXcgSW5xdWlyZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9ucyA9IHRyYW5zZm9ybWF0aW9ucztcclxuICAgICAgICB0aGlzLmlucXVpcmVyLmluaXRUZW1wbGF0ZXModGhpcy50cmFuc2Zvcm1hdGlvbnMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlUm9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyLnNldFJvb3ROb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZUZvck5hbWUodGhpcy50cmFuc2Zvcm1hdGlvbnMucm9vdFRlbXBsYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVMaXN0ID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmlucXVpcmVyLm5vZGVMaXN0KG51bGwpKTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZUxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRpbmdOb2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IoIGxldCBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ05vZGVbYXR0cl0gPSB0aGlzLmlucXVpcmVyLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlc3VsdGluZ05vZGUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25zID0gdGhpcy5pbnF1aXJlci50b1F1ZXJ5T3BlcmF0aW9uKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0KTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnF1aXJlci5pbnZva2UoZnVuY3Rpb25zLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdHlsZXIsIFRyYW5zZm9ybWF0aW9ucyB9IGZyb20gJy4vdHJhbnNmb3JtYXRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAneGpzbHQnLFxyXG4gIHRlbXBsYXRlOiBgYCxcclxuICBzdHlsZXM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWGpzbHRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyAge1xyXG4gIFxyXG4gIHByaXZhdGUgc3R5bGVyO1xyXG5cclxuICBASW5wdXQoXCJub2RlXCIpXHJcbiAgbm9kZSA9IHt9O1xyXG5cclxuICBASW5wdXQoXCJ0cmFuc2Zvcm1hdGlvbnNcIilcclxuICB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuXHJcbiAgQE91dHB1dChcIm9udHJhbnNmb3JtYXRpb25cIilcclxuICBvbnRyYW5zZm9ybWF0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICBpZighdGhpcy5zdHlsZXIpIHtcclxuICAgICAgICB0aGlzLnN0eWxlciA9IG5ldyBTdHlsZXIodGhpcy50cmFuc2Zvcm1hdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc3R5bGVyLmNoYW5nZVJvb3ROb2RlKHRoaXMubm9kZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5vbnRyYW5zZm9ybWF0aW9uLmVtaXQodGhpcy5zdHlsZXIudHJhbnNmb3JtKCkpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYWdlcykge1xyXG4gICAgaWYgKGNoYWdlcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgdGhpcy5zdHlsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfSBlbHNlIGlmIChjaGFnZXMubm9kZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IFhqc2x0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMnO1xyXG5cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgWGpzbHRDb21wb25lbnQsXHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFhqc2x0TW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQXNCSSxZQUFZLEtBQUs7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7Ozs7SUFDRCxRQUFRO1FBQ0osT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEQ7Ozs7O0lBQ0QsTUFBTSxDQUFDLElBQUk7UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7Ozs7O0lBQ08sT0FBTyxDQUFDLElBQUksRUFBRSxJQUFjOztRQUNoQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTs7Z0JBQ3hCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztvQkFDdkMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENB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