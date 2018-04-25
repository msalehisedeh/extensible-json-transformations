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
                pItem.map((item) => {
                    const /** @type {?} */ x = this._nodeOf(item[path[i]], path.slice(i + 1, path.length));
                    if (x && x !== null) {
                        list.push(x);
                    }
                });
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
                pItem.map((item) => {
                    list.push(this._valueOf(item[path[i]], path.slice(i + 1, path.length)));
                });
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
class Styler {
    /**
     * @param {?} transformations
     */
    constructor(transformations) {
        this.templates = {};
        this.globalPool = {};
        this.supportedMethods = {};
        this.transformations = transformations;
        this.registerMethods();
        this.prepareTransformations();
    }
    /**
     * @param {?} node
     * @return {?}
     */
    changeRootNode(node) {
        this.rootNode = node;
        this.globalPool = {};
        this.preparePools();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    nodeList(item) {
        let /** @type {?} */ list;
        if (item instanceof Array) {
            list = item;
        }
        else {
            const /** @type {?} */ x = Object.keys(item);
            list = [];
            x.map((xItem) => {
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                }
                else {
                    list.push(item[xItem]);
                }
            });
        }
        return list;
    }
    /**
     * @return {?}
     */
    transform() {
        let /** @type {?} */ result = [];
        const /** @type {?} */ template = this.templates[this.transformations.rootTemplate];
        if (template) {
            const /** @type {?} */ list = this.nodeList(this.rootNode);
            const /** @type {?} */ attrs = Object.keys(template.style);
            list.map((item) => {
                const /** @type {?} */ node = {};
                attrs.map((attr) => {
                    node[attr] = this.execute(template.style[attr], item);
                });
                result.push(node);
            });
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            const /** @type {?} */ functions = this.parseFunctions(this.transformations.onResult);
            result = this.execute(functions, result);
        }
        return result;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    apply(...args) {
        return this.match(args[0], args[1], "=", args[2], args[3]);
    }
    /**
     * @param {?} x
     * @param {?} node
     * @return {?}
     */
    execute(x, node) {
        let /** @type {?} */ list = [];
        if (typeof x === 'object') {
            if (x.args instanceof Array) {
                if (x.args.length)
                    x.args.map((arg) => {
                        if (arg.name) {
                            list.push(this.execute(arg, node));
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
            const /** @type {?} */ f = this.supportedMethods[x.name];
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
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    concatenate(...args) {
        return args.slice(0, args.length - 1).join("");
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    split(...args) {
        return args[0].split(args[1]);
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    valueOf(...args) {
        const /** @type {?} */ jpath = new JXPath(args[0]);
        return jpath.valueOf(args[1]);
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    each(...args) {
        const /** @type {?} */ list = [];
        args[0].map((item) => {
            const /** @type {?} */ method = {
                name: "valueOf",
                args: args[1]
            };
            list.push(this.execute(method, item));
        });
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    enlist(...args) {
        const /** @type {?} */ list = [];
        args.slice(0, args.length - 1).map((item) => {
            list.push(item); // make sure last two item are not node and template
        });
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    join(...args) {
        return args[0].join(args[1]);
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
                right.map((k) => {
                    if (left === k) {
                        result = true;
                    }
                });
            }
            else if (operation === "in") {
                right.map((k) => {
                    if (k.indexOf(left) >= 0) {
                        result = true;
                    }
                });
            }
            else if (operation === "!") {
                let /** @type {?} */ f = false;
                right.map((k) => {
                    if (left === k) {
                        f = true;
                    }
                });
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
     * @param {?} template
     * @param {?} nodes
     * @return {?}
     */
    templateNodes(template, nodes) {
        let /** @type {?} */ list = [];
        let /** @type {?} */ n = this.nodeList(this.rootNode);
        n = (template.context === "root") ? n : nodes;
        if (template.match && template.match.length) {
            const /** @type {?} */ path = new JXPath(template.match);
            n.map((node) => {
                if (path.valueOf(node) === template.value) {
                    list.push(node);
                }
            });
        }
        else if (nodes) {
            list = n;
        }
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    match(...args) {
        const /** @type {?} */ template = this.templates[args[0]];
        if (!template) {
            throw "Missing Template definition for '" + args[0] + "'.";
        }
        const /** @type {?} */ path = new JXPath(args[1]);
        const /** @type {?} */ path2 = path.fromLast();
        const /** @type {?} */ operation = args[2];
        const /** @type {?} */ values = args[3];
        const /** @type {?} */ nodes = this.templateNodes(template, args[4]);
        const /** @type {?} */ list = [];
        if (nodes instanceof Array) {
            nodes.map((node) => {
                const /** @type {?} */ value = path.nodeOf(node);
                if (value instanceof Array) {
                    value.map((v) => {
                        const /** @type {?} */ x = path2.valueOf(v);
                        if (this.evaluateOperation(x, operation, values)) {
                            list.push(v);
                        }
                    });
                }
                else {
                    const /** @type {?} */ x = path2.valueOf(node);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(node);
                    }
                }
            });
        }
        else {
            const /** @type {?} */ value = path.nodeOf(nodes);
            if (value instanceof Array) {
                value.map((v) => {
                    const /** @type {?} */ x = path2.valueOf(v);
                    if (this.evaluateOperation(x, operation, values)) {
                        list.push(v);
                    }
                });
            }
            else {
                const /** @type {?} */ x = path2.valueOf(nodes);
                if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        }
        return this.style(args[0], list);
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    filter(...args) {
        const /** @type {?} */ path = new JXPath(args[0]);
        const /** @type {?} */ operation = args[1];
        const /** @type {?} */ values = args[2];
        const /** @type {?} */ list = [];
        args[3].map((node) => {
            const /** @type {?} */ value = path.valueOf(node);
            if (value instanceof Array) {
                value.map((v) => {
                    if (this.evaluateOperation(v, operation, values)) {
                        list.push(node);
                    }
                });
            }
            else {
                if (this.evaluateOperation(value, operation, values)) {
                    list.push(node);
                }
            }
        });
        return list;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    select(...args) {
        const /** @type {?} */ path = new JXPath(args[0]);
        let /** @type {?} */ list = [];
        if (args[1] instanceof Array) {
            args[1].map((node) => {
                const /** @type {?} */ value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            });
        }
        else {
            const /** @type {?} */ value = path.nodeOf(args[1]);
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
        const /** @type {?} */ template = this.templates[args[0]];
        const /** @type {?} */ result = [];
        const /** @type {?} */ attrs = Object.keys(template.style);
        args[1].map((item) => {
            const /** @type {?} */ node = {};
            attrs.map((attr) => {
                node[attr] = this.execute(template.style[attr], item);
            });
            result.push(node);
        });
        return result;
    }
    /**
     * @param {...?} args
     * @return {?}
     */
    offPool(...args) {
        const /** @type {?} */ list = [];
        const /** @type {?} */ pool = this.globalPool[args[0]];
        if (!pool) {
            throw "Attempting to access pool '" + args[0] + "' that is not created.";
        }
        if (args[1] instanceof Array) {
            args[1].map((key) => {
                const /** @type {?} */ x = pool[key];
                if (x) {
                    list.push(x);
                }
                else {
                    // should we throw here?
                }
            });
        }
        else {
            const /** @type {?} */ x = pool[args[1]];
            if (x) {
                list.push(x);
            }
        }
        return list;
    }
    /**
     * @return {?}
     */
    registerMethods() {
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
    }
    /**
     * @return {?}
     */
    prepareTransformations() {
        const /** @type {?} */ list = this.transformations.templates;
        list.map((template) => {
            Object.keys(template.style).map((key) => {
                template.style[key] = this.parseFunctions(template.style[key]);
            });
            this.templates[template.name] = template;
        });
    }
    /**
     * @return {?}
     */
    preparePools() {
        const /** @type {?} */ list = Object.keys(this.templates);
        list.map((template) => {
            const /** @type {?} */ t = this.templates[template];
            if (t.inPool) {
                const /** @type {?} */ path = new JXPath(t.inPool);
                const /** @type {?} */ path2 = path.fromLast();
                const /** @type {?} */ nodes = path.nodeOf(this.rootNode);
                this.globalPool[t.name] = {};
                if (nodes instanceof Array) {
                    nodes.map((node) => {
                        this.globalPool[t.name][path2.valueOf(node)] = node;
                    });
                }
                else {
                    this.globalPool[t.name][path2.valueOf(nodes)] = nodes;
                }
            }
        });
    }
    /**
     * @param {?} str
     * @return {?}
     */
    removeQuotes(str) {
        return (str.length && str[0] === '\'' && str[str.length - 1] === '\'') ? str.substring(1, str.length - 1) : str;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    parseFunctions(item) {
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
                    const /** @type {?} */ isArry = (json instanceof Array);
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
                        const /** @type {?} */ x = item.substring(k + 1, cindex);
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
            this.ontransformation.emit(this.styler.transform());
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

export { XjsltComponent, XjsltModule };
//# sourceMappingURL=extensible-json-transformations.js.map
