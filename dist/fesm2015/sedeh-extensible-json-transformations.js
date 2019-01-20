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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvaW5xdWlyZXIudHMiLCJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL3NyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL3RyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyIsIm5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvc3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEludGVudGlvbmFsbHkgYXZvaWRpbmcgdXNlIG9mIG1hcCBjYWxsIG9uIGxpc3QgdG8gcmVkdWNlIHRoZSBjYWxsIHN0YWNrIG51bWJlcnMuXHJcbiAqIE9uIGxhcmdlIHNjYWxlIEpTT04sIGNhbGwgc3RhY2sgYmVjb21lcyBhIHByb2JsZW0gdG8gYmUgYXZvaWRlZC5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBtYXRjaD86IHN0cmluZyxcclxuICAgIHZhbHVlPzogc3RyaW5nLFxyXG4gICAgY29udGV4dDogc3RyaW5nLFxyXG4gICAgaW5Qb29sPzogc3RyaW5nLFxyXG4gICAgc3R5bGU6IGFueVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3BlcmF0aW9uIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBRdWVyeU9wZXJhdGlvbltdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKWFBhdGgge1xyXG4gICAgcHJpdmF0ZSBwYXRoO1xyXG4gICAgY29uc3RydWN0b3IoanBhdGgpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IGpwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIH1cclxuICAgIGZyb21MYXN0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSlhQYXRoKHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gICAgbm9kZU9mKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU9mKG5vZGUsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9ub2RlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucGF0aC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwSXRlbVtxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fbm9kZU9mKGl0ZW1bcGF0aFtpXV0sIHBhdGguc2xpY2UoaSsxLHBhdGgubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgeCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBJdGVtID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcEl0ZW0gPSBwSXRlbSA/IHBJdGVtW3BhdGhbaV1dIDogcEl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBJdGVtO1xyXG4gICAgfVxyXG4gICAgdmFsdWVPZihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlT2Yobm9kZSwgdGhpcy5wYXRoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3ZhbHVlT2Yobm9kZSwgcGF0aDogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgcEl0ZW0gPSBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgdGhpcy5wYXRoLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcEl0ZW1bcV07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fdmFsdWVPZihpdGVtW3BhdGhbaV1dLCBwYXRoLnNsaWNlKGkrMSxwYXRoLmxlbmd0aCkpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcEl0ZW0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtID8gcEl0ZW1bcGF0aFtpXV0gOiBwSXRlbTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICBwSXRlbSA9IHBJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwSXRlbTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucXVpcmVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRNZXRob2RzID0ge307XHJcbiAgICBwcml2YXRlIHRlbXBsYXRlcyA9IHt9O1xyXG4gICAgcHJpdmF0ZSByb290Tm9kZTtcclxuICAgIHByaXZhdGUgY29udGV4dE5vZGU7IC8vIHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBjYWxsIGlzIG1hZGUuLi4gdGhpcyBpcyB0byBhdm9pZCBjYWxsIHN0YWNrIG92ZXJmbG93IGluIGV4dHJlbWVsdCBsYXJnZSBKU09OXHJcbiAgICBwcml2YXRlIGdsb2JhbFBvb2wgPSB7fTtcclxuICAgIHByaXZhdGUgcGF0aFBvb2wgPSB7fTsvLyB0byBhdm9pZCBzdGFja292ZXJmbG93Li4uIGFuZCBwZXJmb3JtIGZhc3RlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInZhbHVlT2ZcIiwgdGhpcy52YWx1ZU9mKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJlYWNoXCIsIHRoaXMuZWFjaCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic3BsaXRcIiwgdGhpcy5zcGxpdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiY29uY2F0XCIsIHRoaXMuY29uY2F0ZW5hdGUpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImVubGlzdFwiLCB0aGlzLmVubGlzdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwiam9pblwiLCB0aGlzLmpvaW4pO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcImZpbHRlclwiLCB0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwic2VsZWN0XCIsIHRoaXMuc2VsZWN0KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJzdHlsZVwiLCB0aGlzLnN0eWxlKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJtYXRjaFwiLCB0aGlzLm1hdGNoKTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJhcHBseVwiLCB0aGlzLmFwcGx5KTtcclxuICAgICAgICB0aGlzLmFkZFN1cHBvcnRpbmdNZXRob2QoXCJmaWx0ZXJcIiwgdGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkU3VwcG9ydGluZ01ldGhvZChcInNlbGVjdFwiLCB0aGlzLnNlbGVjdCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdXBwb3J0aW5nTWV0aG9kKFwib2ZmUG9vbFwiLCB0aGlzLm9mZlBvb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgalhQYXRoRm9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBwOkpYUGF0aCA9IHRoaXMucGF0aFBvb2xbcGF0aF07XHJcbiAgICAgICAgaWYgKCFwKSB7XHJcbiAgICAgICAgICAgIHAgPSBuZXcgSlhQYXRoKHBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGhQb29sW3BhdGhdID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3ROb2RlID0gdGhpcy5ub2RlTGlzdChub2RlKTtcclxuICAgICAgICB0aGlzLmluaXRQb29scyh0aGlzLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZXh0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICB0ZW1wbGF0ZUZvck5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIC8vIGlmIG5vZGUgaXMgbnVsbCwgcm9vdCBub2RlIHdpbGwgYmUgdXNlZC5cclxuICAgIG5vZGVMaXN0KG5vZGUpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbm9kZSA9PT0gbnVsbCA/IHRoaXMucm9vdE5vZGUgOiBub2RlO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBpdGVtO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKGl0ZW0pO1xyXG4gICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCB4Lmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4SXRlbSA9IHhbdF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVt4SXRlbV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpdGVtW3hJdGVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwZXJmb3JtcyBxdWVyeSBvZiBuZXN0ZWQgZnVuY3Rpb24gY2FsbHMgb24gdGhlIGdpdmVuIG5vZGUuXHJcbiAgICBxdWVyeShjb21tYW5kOnN0cmluZywgbm9kZSkge1xyXG4gICAgICAgIGNvbnN0IG1vdGhvZHMgPXRoaXMudG9RdWVyeU9wZXJhdGlvbihjb21tYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IG5vZGUubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJdGVtID0gbm9kZVtxXTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCh0aGlzLmludm9rZShtb3Rob2RzLCBub2RlSXRlbSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2UobW90aG9kcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGVyZm9ybXMgcXVlcnkgd2l0aCBnaXZlbiBsaXN0IG9mIHF1ZXJ5IG9wZXJ0YXRpb25zXHJcbiAgICBpbnZva2Uob3BlcmF0aW9uOlF1ZXJ5T3BlcmF0aW9uLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6YW55ID0gW107XHJcbiAgICAgICAgaWYgKCh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgbm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHRoaXMuc3VwcG9ydGVkTWV0aG9kc1tvcGVyYXRpb24ubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLmFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgb3BlcmF0aW9uLmFyZ3MubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnID0gb3BlcmF0aW9uLmFyZ3NbYV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UoYXJnLCBub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9wZXJhdGlvbi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gZi5hcHBseSh0aGlzLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE5vZGUgPSBvbGRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdCA9IG9wZXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uY2F0ZW5hdGUoYSwgYiwgYyk6IGpvaW5zIGFyZ3VtZW50cyBpbnRvIGEgc3RyaW5nXHJcbiAgICAvLyBqb2luIGFyZ3NbMCwxLDJdXHJcbiAgICBjb25jYXRlbmF0ZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGFyZ3NbMF07XHJcbiAgICAgICAgY29uc3QgZGVsaW09IGFyZ3NbMV07XHJcbiAgICAgICAgY29uc3QgcmlnaHQ9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA+IHJpZ2h0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdFtxXSArIGRlbGltICsgKHJpZ2h0Lmxlbmd0aCA+IHEgPyByaWdodFtxXSA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHJpZ2h0Lmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCAobGVmdC5sZW5ndGggPiBxID8gbGVmdFtxXSA6IFwiXCIpICsgZGVsaW0gKyByaWdodFtxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgbGVmdC5sZW5ndGg7IHErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBsZWZ0W3FdICsgZGVsaW0gKyByaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHEgPSAwOyBxIDwgcmlnaHQubGVuZ3RoOyBxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggbGVmdCArIGRlbGltICsgcmlnaHRbcV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxlZnQgKyBkZWxpbSArIHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDEgPyByZXN1bHQgOiByZXN1bHRbMF07XHJcbiAgICB9XHJcbiAgICAvLyBzcGxpdChpdGVtLCcsJyk6IHNwbGl0cyB2YWx1ZSBpbnRvIGEgbGlzdFxyXG4gICAgLy8gc3BsaXQgYXJnc1swXSB3aXRoIGFyZ3NbMV1cclxuICAgIHNwbGl0KC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXJnc1swXSA/IGFyZ3NbMF0uc3BsaXQoYXJnc1sxXSkgOiBbXTtcclxuICAgIH1cclxuICAgIC8vIHZhbHVlT2YocGF0aCk6ICBldmFsdWF0ZXMgdmFsdWUgb2YgYXJndW1lbnQgcGF0aFxyXG4gICAgLy8gcGF0aCA9IGFyZ3NbMF0sIG5vZGUgdG8gZXZhbHVhdGUgPSBhcmdzWzFdXHJcbiAgICB2YWx1ZU9mKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIHJldHVybiBqcGF0aC52YWx1ZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLy8gZWFjaChsaXN0LG1ldGhvZCk6IEZvciBlYWNoIGl0ZW0gaW4gbGlzdCwgaW52b2RlIHRoZSBjYWxsYmFjayBtZXRob2RcclxuICAgIC8vIGVhY2ggaXRlbSBvZiBhcmdzWzBdIGV4ZWN1dGUgZnVuY3Rpb24gb2YgYXJnc1sxXVxyXG4gICAgZWFjaCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHtuYW1lOiBcInZhbHVlT2ZcIiwgYXJnczogYXJnc1sxXX07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgcSA9IDA7IHEgPCBhcmdzWzBdLmxlbmd0aDsgcSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBhcmdzWzBdW3FdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5pbnZva2UobWV0aG9kLCBub2RlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGVubGlzdCguLi4pOiBpbnNlcnQgYXJndW1lbnQgdmFsdWVzIGludG8gYSBsaXN0XHJcbiAgICBlbmxpc3QoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBhcmdzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pOyAvLyBtYWtlIHN1cmUgbGFzdCB0d28gaXRlbSBhcmUgbm90IG5vZGUgYW5kIHRlbXBsYXRlXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIGpvaW4oYXJyYXksJywnKTogam9pbnMgaXRlbXMgb2YgdGhlIGxpc3QgaW50byBhIHN0cmluZ1xyXG4gICAgam9pbiguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0ubGVuZ3RoID4gMSA/IGFyZ3NbMF0uam9pbihhcmdzWzFdKSA6IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICAvLyBhcHBseSh0ZW1wbGF0ZSxwYXRoLGFycmF5KTogYXBwbHkgdGhlIHRlbXBsYXRlIGluIHJvb3QgY29udGV4dCBmb3IgZWFjaCB2YWx1ZSBcclxuICAgIC8vIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aC4gYXJnc1swXSBuYW1lIHRvIGFwcGx5XHJcbiAgICBhcHBseSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMV0pO1xyXG4gICAgICAgIGNvbnN0IHBhdGgyPSBwYXRoLmZyb21MYXN0KCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1syXTtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMucm9vdE5vZGUubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucm9vdE5vZGVbY107XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHZhbHVlLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2YWx1YXRlT3BlcmF0aW9uKHgsXCI9XCIsIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxcIj1cIiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLnN0eWxlKGFyZ3NbMF0sIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIG1hdGNoKHRlbXBsYXRlLHBhdGgsb3BlcmF0aW9uLHZhbHVlcyk6ICwgbm9kZSBhcmdzWzRdXHJcbiAgICAvLyBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGdpdmVuIHRlbXBsYXRlIG5vZGVzLCBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBcclxuICAgIG1hdGNoKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVGb3JOYW1lKGFyZ3NbMF0pO1xyXG5cclxuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBUZW1wbGF0ZSBkZWZpbml0aW9uIGZvciAnXCIgKyBhcmdzWzBdICsgXCInLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcihhcmdzWzFdKTtcclxuICAgICAgICBjb25zdCBwYXRoMj0gcGF0aC5mcm9tTGFzdCgpO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGFyZ3NbMl07XHJcbiAgICAgICAgY29uc3QgdmFsdWVzID0gYXJnc1szXTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5jb250ZXh0Tm9kZSlcclxuICAgICAgICBjb25zdCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBub2Rlcy5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2NdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdmFsdWVbZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBwYXRoMi52YWx1ZU9mKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC5ub2RlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gcGF0aDIudmFsdWVPZih2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih4LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgyLnZhbHVlT2Yobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24oeCxvcGVyYXRpb24sIHZhbHVlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIocGF0aCxvcGVyYXRpb24sdmFsdWUpOiBmb3IgdmFsdWUgb2YgdGFyZ2V0IGluIGN1cnJlbnQgY29udGV4dCwgXHJcbiAgICAvLyBldmFsdWF0ZSBvcGVyYXRpb24gZm9yIGdpdmVuIHZhbHVlKHMpLiBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZCBmb3Igc3RyaW5nIHZhbHVlIG1lYW5zIGluZGV4T2YuICchJyBtZWFucyBub3QgZXF1YWwgb3Igbm90IGluLlxyXG4gICAgZmlsdGVyKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5qWFBhdGhGb3IoYXJnc1swXSk7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gYXJnc1sxXTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBhcmdzWzJdO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29udGV4dE5vZGVbYV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF0aC52YWx1ZU9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCB2YWx1ZS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB2YWx1ZVtkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmFsdWF0ZU9wZXJhdGlvbih2LG9wZXJhdGlvbiwgdmFsdWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZhbHVhdGVPcGVyYXRpb24odmFsdWUsb3BlcmF0aW9uLCB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0KHBhdGgpOiBzZWxlY3QgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gcGF0aCBpbiBjdXJyZW50IGNvbnRleHRcclxuICAgIHNlbGVjdCguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMualhQYXRoRm9yKGFyZ3NbMF0pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IHRoaXMuY29udGV4dE5vZGUubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnRleHROb2RlW2RdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXRoLm5vZGVPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhdGgubm9kZU9mKHRoaXMuY29udGV4dE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuICAgIC8vIHN0eWxlKHRlbXBsYXRlLCBhcnJheSk6IGFwcGx5IHRoZSBnaXZlbiB0ZW1wbGF0ZSBmb3IgdGhlIGdpdmVuIGFycmF5XHJcbiAgICBzdHlsZSguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlRm9yTmFtZShhcmdzWzBdKTtcclxuXHJcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbiBmb3IgJ1wiICsgYXJnc1swXSArIFwiJy5cIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoYXJnc1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYXJnc1sxXS5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMV1bYV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGF0dHJzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbYXR0cl0gPSB0aGlzLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBhdHRycy5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2RdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVthdHRyXSA9IHRoaXMuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBhcmdzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGFkZFN1cHBvcnRpbmdNZXRob2QobmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0ZWRNZXRob2RzW25hbWVdID0gbWV0aG9kO1xyXG4gICAgfVxyXG4gICAgIHByaXZhdGUgcmVtb3ZlUXVvdGVzKHN0cikge1xyXG4gICAgICAgIHJldHVybiAoc3RyLmxlbmd0aCAmJiBzdHJbMF0gPT09ICdcXCcnICYmIHN0cltzdHIubGVuZ3RoLTFdID09PSAnXFwnJykgPyBzdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aC0xKSA6IHN0cjtcclxuICAgIH1cclxuICAgIHRvUXVlcnlPcGVyYXRpb24obWV0aG9kcykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBtZXRob2RzLnJlcGxhY2UoLyhbXiddKyl8KCdbXiddKycpL2csIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcclxuICAgICAgICAgICAgaWYgKCQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMjsgXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfSkucmVwbGFjZSgvJ1teJ10rJy9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UoLywvZywgJ34nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0Z1bmN0aW9ucyhvcGVyYXRpb25zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9GdW5jdGlvbnMoaXRlbSl7XHJcbiAgICAgICAgLy8gaWYgaXRlbSA9IGpvaW4oZW5saXN0KHZhbHVlT2YoYWRkcmVzcy5zdHJlZXQpLHZhbHVlT2YoYWRkcmVzcy5jaXR5KSx2YWx1ZU9mKGFkZHJlc3MuemlwY29kZSkpLCcsJylcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBqID0gLTE7XHJcbiAgICAgICAgbGV0IGsgPSAtMTtcclxuICAgICAgICBsZXQgYyA9IDA7XHJcbiAgICAgICAgbGV0IGpzb246IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGNpbmRleCA9IDA7IGNpbmRleCA8IGl0ZW0ubGVuZ3RoOyBjaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtjaW5kZXhdID09PSAnKCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2NpbmRleF0gPT09ICcpJykge1xyXG4gICAgICAgICAgICAgICAgYy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyeSA9IChqc29uIGluc3RhbmNlb2YgQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJ5ICYmIChqID09PSAoaXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcIm5hbWVcIl0gPSBpdGVtLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltcImFyZ3NcIl0gPSB0aGlzLnRvRnVuY3Rpb25zKGl0ZW0uc3Vic3RyaW5nKGkrMSxqKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uc3Vic3RyaW5nKGsrMSwgaSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogdGhpcy50b0Z1bmN0aW9ucyhpdGVtLnN1YnN0cmluZyhpKzEsaikpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtjaW5kZXhdID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjID09PSAwICYmIChjaW5kZXgtMSAhPT0gaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FycnkgPSAoanNvbiBpbnN0YW5jZW9mIEFycmF5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucmVtb3ZlUXVvdGVzKGl0ZW0uc3Vic3RyaW5nKGsrMSwgY2luZGV4KS5yZXBsYWNlKC9+L2csICcsJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gY2luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGNpbmRleCkucmVwbGFjZSgvfi9nLCAnLCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaW5kZXhPZignKCcpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ucHVzaCh4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hcmdzLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGNpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDAgJiYgKGNpbmRleC0xID09PSBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBjaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPj0gMCAmJiBqIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKSdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaTwwICYmIGo+MCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImluY29ycmVjdCBtZXRob2QgY2FsbCBkZWNsYXJhdGlvbi4gTWlzc2luZyAnKCdcIixcclxuICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNlIGlmIChpIDwgMCAmJiBqIDwgMCAmJiBrIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9ZWxzZSBpZiAoYyA9PT0gMCAmJiBrID4gaikge1xyXG4gICAgICAgICAgICBpZiAoanNvbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLnB1c2godGhpcy5yZW1vdmVRdW90ZXMoaXRlbS5zdWJzdHJpbmcoaysxLCBpdGVtLmxlbmd0aCkucmVwbGFjZSgvfi9nLCAnLCcpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqc29uLmFyZ3MucHVzaCh0aGlzLnJlbW92ZVF1b3RlcyhpdGVtLnN1YnN0cmluZyhrKzEsIGl0ZW0ubGVuZ3RoKS5yZXBsYWNlKC9+L2csICcsJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlOlRlbXBsYXRlLCBub2Rlcykge1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IG5vZGVMaXN0ID0gbm9kZXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZXh0ID09PSBcInJvb3RcIikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOlwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBuZXcgRXJyb3IoKS5zdGFja1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlTGlzdCA9IHRoaXMubm9kZUxpc3QodGhpcy5yb290Tm9kZSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUubWF0Y2ggJiYgdGVtcGxhdGUubWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0ZW1wbGF0ZS5tYXRjaCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IG5vZGVMaXN0Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZUxpc3Rbel07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC52YWx1ZU9mKG5vZGUpID09PSB0ZW1wbGF0ZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBTdXBwb3J0ZWQgb3BlcmF0aW9ucyBhcmUgYD0sPCw+LGluLCFgLiAnaW4nIGZvciBsaXN0IHZhbHVlcyBtZWFuIGNvbnRhaW5zIGFuZFxyXG4gICAgLy8gZm9yIHN0cmluZyB2YWx1ZSBtZWFucyBpbmRleE9mLiAnIScgbWVhbnMgbm90IGVxdWFsIG9yIG5vdCBpbi5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVPcGVyYXRpb24obGVmdCwgb3BlcmF0aW9uLCByaWdodCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSBcIj1cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8cmlnaHQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPT0gcmlnaHRbaV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImluXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPHJpZ2h0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodFtpXS5pbmRleE9mKGxlZnQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxyaWdodC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVmdCA9PSByaWdodFtpXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gIWY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gXCI9XCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChsZWZ0ID09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiaW5cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJpZ2h0LmluZGV4T2YobGVmdCkgPj0gMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBcIiFcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKGxlZnQgIT09IHJpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA+IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFwiPFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocGFyc2VGbG9hdChsZWZ0KSA8IHBhcnNlRmxvYXQocmlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9mZlBvb2wodGVtcGxhdGUsa2V5KTogV2lsbCB1c2UgdGhlIGdpdmVuIHRlbXBsYXRlIHBvb2wgdG8gcGljayB1cCBpdGVtKHMpIHdpdGggZ2l2ZW4ga2V5KHMpXHJcbiAgICBwcml2YXRlIG9mZlBvb2woLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5nbG9iYWxQb29sW2FyZ3NbMF1dO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBhcmdzWzFdO1xyXG4gICAgICAgIGlmICghcG9vbCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkF0dGVtcHRpbmcgdG8gYWNjZXNzIHBvb2wgJ1wiICsgYXJnc1swXSArIFwiJyB0aGF0IGlzIG5vdCBjcmVhdGVkLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB6PTA7IHogPCBrZXlzLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW3pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBvb2xba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgd2UgdGhyb3cgaGVyZT9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBwb29sW2tleXNdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICBcclxuICAgIGluaXRUZW1wbGF0ZXMobGlzdCkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBhbnk9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gc3R5bGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGVtcGxhdGUuc3R5bGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUuc3R5bGVba2V5XSA9IHRoaXMudG9RdWVyeU9wZXJhdGlvbihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlLm5hbWVdID0gdGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFBvb2xzKHRlbXBsYXRlcykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZXMpO1xyXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgVGVtcGxhdGUgZGVmaW5pdGlvbnMuXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFjazogbmV3IEVycm9yKCkuc3RhY2tcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGZpbmQgcm9vdCBub2RlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLlwiLFxyXG4gICAgICAgICAgICAgICAgc3RhY2s6IG5ldyBFcnJvcigpLnN0YWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbFBvb2wgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlOiBzdHJpbmcgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50ZW1wbGF0ZUZvck5hbWUodGVtcGxhdGUpO1xyXG4gICAgICAgICAgICBpZiAodC5pblBvb2wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2wgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmpYUGF0aEZvcih0LmluUG9vbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaD0gdC5tYXRjaDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzPSB0aGlzLnJvb3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtcGF0aCA9IHRoaXMualhQYXRoRm9yKG1hdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPCBub2Rlcy5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBtcGF0aC52YWx1ZU9mKG5vZGVzW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgPT09IHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvb2xbcGF0aC52YWx1ZU9mKG5vZGVzW2tdKV0gPSBub2Rlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDwgbm9kZXMubGVuZ3RoOyBrKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb29sW3BhdGgudmFsdWVPZihub2Rlc1trXSldID0gbm9kZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxQb29sW3QubmFtZV0gPSBwb29sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEpYUGF0aCwgSW5xdWlyZXIsIFRlbXBsYXRlIH0gZnJvbSAnLi9pbnF1aXJlcic7XHJcbi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybWF0aW9ucyB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBpbXBvcnRVcmxzPzpzdHJpbmdbXSxcclxuICAgIHJvb3RUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgb25SZXN1bHQ/OiBzdHJpbmcsXHJcbiAgICB0ZW1wbGF0ZXM6IFRlbXBsYXRlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0eWxlciAge1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcbiAgICBwcml2YXRlIGlucXVpcmVyOklucXVpcmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRyYW5zZm9ybWF0aW9uczpUcmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyID0gbmV3IElucXVpcmVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbnMgPSB0cmFuc2Zvcm1hdGlvbnM7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5pbml0VGVtcGxhdGVzKHRoaXMudHJhbnNmb3JtYXRpb25zLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZVJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5zZXRSb290Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVGb3JOYW1lKHRoaXMudHJhbnNmb3JtYXRpb25zLnJvb3RUZW1wbGF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlTGlzdCA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5pbnF1aXJlci5ub2RlTGlzdChudWxsKSk7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0aW5nTm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBhdHRycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdOb2RlW2F0dHJdID0gdGhpcy5pbnF1aXJlci5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyZXN1bHRpbmdOb2RlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IHRoaXMuaW5xdWlyZXIudG9RdWVyeU9wZXJhdGlvbih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKGZ1bmN0aW9ucywgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4gKiB0b29sIHRvIGRpc3BsYXkgcmVzdWx0IG9mIGEgc2VhcmNoIG9uIHNldCBvZiBwb2ludHMgb2YgaW50ZXJlc3RzIG9uIG9iamVjdHMuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3R5bGVyLCBUcmFuc2Zvcm1hdGlvbnMgfSBmcm9tICcuL3RyYW5zZm9ybWF0aW9ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3hqc2x0JyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgc3R5bGVzOiBbXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFhqc2x0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMgIHtcclxuICBcclxuICBwcml2YXRlIHN0eWxlcjtcclxuXHJcbiAgQElucHV0KFwibm9kZVwiKVxyXG4gIG5vZGUgPSB7fTtcclxuXHJcbiAgQElucHV0KFwidHJhbnNmb3JtYXRpb25zXCIpXHJcbiAgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcblxyXG4gIEBPdXRwdXQoXCJvbnRyYW5zZm9ybWF0aW9uXCIpXHJcbiAgb250cmFuc2Zvcm1hdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLm5vZGUgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgaWYoIXRoaXMuc3R5bGVyKSB7XHJcbiAgICAgICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKHRoaXMudHJhbnNmb3JtYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnN0eWxlci5jaGFuZ2VSb290Tm9kZSh0aGlzLm5vZGUpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMub250cmFuc2Zvcm1hdGlvbi5lbWl0KHRoaXMuc3R5bGVyLnRyYW5zZm9ybSgpKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB0aGlzLm9uZXJyb3IuZW1pdChlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFnZXMpIHtcclxuICAgIGlmIChjaGFnZXMudHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgIHRoaXMuc3R5bGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH0gZWxzZSBpZiAoY2hhZ2VzLm5vZGUpIHtcclxuICAgICAgc2V0VGltZW91dCh0aGlzLm5nT25Jbml0LmJpbmQodGhpcyksIDMzMyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBYanNsdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zJztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBYanNsdENvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFhqc2x0Q29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBYanNsdENvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBYanNsdE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFzQkksWUFBWSxLQUFLO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDOzs7O0lBQ0QsUUFBUTtRQUNKLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3REOzs7OztJQUNELE1BQU0sQ0FBQyxJQUFJO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7Ozs7OztJQUNPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBYzs7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7O2dCQUN4QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7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