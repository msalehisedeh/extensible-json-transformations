import { JsonPipe } from "@angular/common";

/*
 * tool to display result of a search on set of points of interests on objects.
 */

export interface Transformations {
    name: string,
    importUrls?:string[],
    rootTemplate: string,
    onResult?: string,
    templates: Template[]
}

export interface Template {
    name: string,
    match: string,
    value?: string,
    context: string,
    inPool?: string,
    style: any
}

export class JXPath {
    private path;
    constructor(jpath){
        this.path = jpath.split(".");
    }
    fromLast() {
        return new JXPath(this.path[this.path.length - 1]);
    }
    nodeOf(node) {
        return this._nodeOf(node, this.path);
    }
    private _nodeOf(node, path: string[]) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const list = [];
                pItem.map( (item) => {
                    const x = this._nodeOf(item[path[i]], path.slice(i+1,path.length));
                    if(x && x !== null) {
                    list.push(x);
                    }
                });
                if (list.length) {
                    pItem = list;
                }
                break;
            } else {
                pItem = pItem ? pItem[path[i]] : pItem;
            }
        }
        return pItem;
    }
    valueOf(node) {
        return this._valueOf(node, this.path);
    }
    private _valueOf(node, path: string[]) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
              const list = [];
              pItem.map( (item) => {
                list.push(this._valueOf(item[path[i]], path.slice(i+1,path.length)));
              });
              pItem = list;
              break;
            } else if (path.length) {
                pItem = pItem ? pItem[path[i]] : pItem;
            } else {
                 pItem = pItem;
            }
        }
        return pItem;
    }
}

export class Styler  {

    private templates = {};
    private globalPool = {};
    private supportedMethods = {};
    private transformations: Transformations;
    private rootNode;

    constructor(transformations:Transformations) {
        this.transformations = transformations;
        this.registerMethods();
        this.prepareTransformations();
    }

    public changeRootNode(node:any) {
        this.rootNode = node;
        this.globalPool = {};
        this.preparePools();
    }
    private nodeList(item) {
        let list;
        if (item instanceof Array) {
            list = item;
         } else {
             const x = Object.keys(item);
             list = [];
             x.map( (xItem) => {
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                 } else {
                    list.push(item[xItem]);
                }
             })
         }
         return list;
    }

    public transform() {
        let result = [];
        const template:Template = this.templates[this.transformations.rootTemplate];
        
        if (template) {
            const list = this.nodeList(this.rootNode);
            const attrs = Object.keys(template.style);
    
            list.map( (item) => {
                const node = {};
                attrs.map( (attr) => {
                    node[attr] = this.execute(template.style[attr], item);
                });
                result.push(node);
            });
        }
        if(this.transformations.onResult && this.transformations.onResult.length) {
            const functions = this.parseFunctions(this.transformations.onResult);
            result = this.execute(functions, result);
        }
        return result;
    }

    // apply(template,path,array): apply the template in current context for each value 
    // that matches the given path. args[0] name to apply, args[1] node
    public apply(...args) {
        return this.match(args[0],args[1],"=",args[2],args[3]);
    }


    private execute(x, node) {
        let list = [];
        if (typeof x === 'object') {
            if (x.args instanceof Array) {
                if (x.args.length)
                x.args.map( (arg) => {
                    if (arg.name) {
                        list.push(this.execute(arg, node));
                    } else {
                        list.push(arg);
                    }
                });
            } else {
                list.push(x.args);
            }
            list.push(node);
            const f = this.supportedMethods[x.name];
            if (f) {
                list = f.apply(this, list);
            } else {
                list = x.name;
            }
        } else {
            list = x;
        }
        return list;
    }
    // concatenate(a, b, c): joins arguments into a string
    // join args[0,1,2], node args[3]
    private concatenate(...args) {
        return args.slice(0, args.length - 1).join("");
    }
    // split(item,','): splits value into a list
    // split args[0] with args[1], node args[2]
    private split(...args) {
        return args[0].split(args[1]);
    }
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    private valueOf(...args) {
        const jpath = new JXPath(args[0]);
        return jpath.valueOf(args[1]);
    }
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1], node args[2]
    private each(...args) {
        const list = [];
        args[0].map( (item) => {
            const method = {
                name: "valueOf",
                args: args[1]
            }
            list.push(this.execute(method, item));
        });
        return list;
    }
    // enlist(...): insert argument values into a list
    private enlist(...args) {
        const list = [];
        args.slice(0, args.length - 1).map( (item) => {
            list.push(item); // make sure last two item are not node and template
        })
        return list;
    }
    // join(array,','): joins items of the list into a string
    private join(...args) {
        return args[0].join(args[1]);
    }
    // Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and
    // for string value means indexOf. '!' means not equal or not in.
    private evaluateOperation(left, operation, right) {
        let result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                right.map( (k)=> {
                    if(left === k){
                        result = true;
                    }
                });
            } else if (operation === "in") {
                right.map( (k)=> {
                    if(k.indexOf(left) >= 0){
                        result = true;
                    }
                });
            } else if (operation === "!") {
                let f = false;
                right.map( (k)=> {
                    if(left === k){
                        f = true;
                    }
                });
                result = !f;
            }

        } else {
            if (operation === "=") {
                result = (left == right);
            } else if (operation === "in") {
                result = (right.indexOf(left) >= 0);
            } else if (operation === "!") {
                result = (left !== right);
            } else if (operation === ">") {
                result = (parseFloat(left) > parseFloat(right));
            } else if (operation === "<") {
                result = (parseFloat(left) < parseFloat(right));
            }
        }
        return result;
    }
    private templateNodes(template:Template, nodes) {
        let list = [];
        let n = this.nodeList(this.rootNode);
        n = (template.context === "root") ? n : nodes;
    
        if(template.match && template.match.length) {
            const path = new JXPath(template.match);

            n.map( (node) => {
                if (path.valueOf(node) === template.value) {
                    list.push(node);
                }
            });         
        } else if(nodes) {
            list = n;
        }
        return list;
    }
    // match(template,path,operation,values): , node args[4]
    // for value of target in given template nodes, evaluate operation for given value(s). 
    private match(...args) {
        const template:Template = this.templates[args[0]];

        if (!template) {
            throw "Missing Template definition for '" + args[0] + "'.";
        }
        const path = new JXPath(args[1]);
        const path2= path.fromLast();
        const operation = args[2];
        const values = args[3];
        const nodes = this.templateNodes(template, args[4])
        const list = [];
        if (nodes instanceof Array) {
            nodes.map( (node) => {
                const value = path.nodeOf(node);
                if (value instanceof Array) {
                    value.map((v)=>{
                        const x = path2.valueOf(v);
                        if (this.evaluateOperation(x,operation, values)) {
                            list.push(v);
                        }
                    });
                } else {
                    const x = path2.valueOf(node);
                    if (this.evaluateOperation(x,operation, values)) {
                        list.push(node);
                    }
                }
            });
        } else {
            const value = path.nodeOf(nodes);
            if (value instanceof Array) {
                value.map((v)=>{
                    const x = path2.valueOf(v);
                    if (this.evaluateOperation(x,operation, values)) {
                        list.push(v);
                    }
                });
            } else {
                const x = path2.valueOf(nodes);
                if (this.evaluateOperation(x,operation, values)) {
                    list.push(nodes);
                }
            }
        
        }
       return this.style(args[0], list);
    }
    // filter(path,operation,value): for value of target in current context, 
    // evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in.
    private filter(...args) {
        const path = new JXPath(args[0]);
        const operation = args[1];
        const values = args[2];
        const list = [];
        args[3].map( (node) => {
            const value = path.valueOf(node);
            if (value instanceof Array) {
                value.map((v)=>{
                    if (this.evaluateOperation(v,operation, values)) {
                        list.push(node);
                    }
                });
            } else {
                if (this.evaluateOperation(value,operation, values)) {
                    list.push(node);
                }
            }
        });
        return list;
    }
    // select(path): select the nodes with given path in current context
    private select(...args) {
        const path = new JXPath(args[0]);
        let list = [];
        if(args[1] instanceof Array) {
            args[1].map( (node) => {
                const value = path.nodeOf(node);
                if (value && value.length) {
                    list.push(node);
                }
            });
        } else {
            const value = path.nodeOf(args[1]);
            if (value && value.length) {
                if (value instanceof Array) {
                    list = value;
                } else {
                    list.push(value);
                }
            }
        }
        return list;
    }
    // style(template, array): apply the given template for the given array
    private style(...args) {
        const template:Template = this.templates[args[0]];
        const result = [];
        const attrs = Object.keys(template.style);
    
        args[1].map( (item) => {
            const node = {};
            attrs.map( (attr) => {
                node[attr] = this.execute(template.style[attr], item);
            });
            result.push(node);
        })
        return result;
    }
    // offPool(template,key): Will use the given template pool to pick up item(s) with given key(s)
    private offPool(...args) {
        const list = [];
        const pool = this.globalPool[args[0]];
        if (!pool) {
            throw "Attempting to access pool '" + args[0] + "' that is not created."
        }
        if (args[1] instanceof Array){
            args[1].map( (key) => {
                const x = pool[key];
                if(x) {
                    list.push(x);
                } else {
                    // should we throw here?
                }
            });
        } else {
            const x = pool[args[1]];
            if(x) {
                list.push(x);
            }
        }
        return list;
    }
   

    private registerMethods() {
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
    private prepareTransformations() {

        const list = this.transformations.templates;
        list.map( (template: any) => {
            Object.keys(template.style).map( (key) => {
                template.style[key] = this.parseFunctions(template.style[key]);
            });
            this.templates[template.name] = template;
        });
    }
    private preparePools() {
        const list = Object.keys(this.templates);
        list.map( (template: any) => {
            const t = this.templates[template];
            if (t.inPool) {
                const pool = {};
                const path = new JXPath(t.inPool);
                const path2= path.fromLast();
                const nodes= path.nodeOf(this.rootNode);
                this.globalPool[t.name] = {};

                if (nodes instanceof Array) {
                    nodes.map( (node) => {
                        this.globalPool[t.name][path2.valueOf(node)] = node;
                    });
                } else {
                    this.globalPool[t.name][path2.valueOf(nodes)] = nodes;
                }
            }
        });  
    }
    private removeQuotes(str) {
        return (str.length && str[0] === '\'' && str[str.length-1] === '\'') ? str.substring(1,str.length-1) : str;
    }
    private parseFunctions(item){
        // if item = join(enlist(valueOf(address.street),valueOf(address.city),valueOf(address.zipcode)),',')
        let i = -1;
        let j = -1;
        let k = -1;
        let c = 0;
        let json: any = {};
        for(let cindex = 0; cindex < item.length; cindex++) {
            if (item[cindex] === '(') {
                if (c === 0) {
                    i = cindex;
                }
                c++;
            } else if(item[cindex] === ')') {
                c--;
                if (c === 0){
                    const isArry = (json instanceof Array);

                    j = cindex;
                    if (!isArry && (j === (item.length - 1))) {
                        json["name"] = item.substring(0, i);
                        json["args"] = this.parseFunctions(item.substring(i+1,j));
                    } else {
                        if (!isArry) {
                            json = [];
                        }
                        json.push({ 
                            name: item.substring(k+1, i), 
                            args: this.parseFunctions(item.substring(i+1,j)) 
                        });
                    }
                }
            } else if (item[cindex] === ',') {
                if (c === 0 && (cindex-1 !== k)) {
                    const isArry = (json instanceof Array);

                    if (k < 0) {
                        if (i < 0) {
                            if (!isArry) {
                                json = [];
                            }
                            json.push({
                                name: this.removeQuotes(item.substring(k+1, cindex)),
                                args: []
                            });
                        }
                        k = cindex;
                    }else if (
                        (item[cindex - 1] === '\'' || (item[cindex - 1] === ' ' && item[cindex - 2] === '\'')) && 
                        (((cindex < item.length-1) && item[cindex + 1] === '\'') || 
                            ((cindex < item.length-2) && item[cindex + 1] === ' ' && item[cindex + 2] === '\''))) {
                        if (json instanceof Array) {
                            json.push(",");
                        } else {
                            json.args.push(",");
                        }
                        k = cindex+1;
                    } else {
                        const x = item.substring(k+1, cindex);
                        if (x.indexOf('\'')<0) {
                            if (json instanceof Array) {
                                json.push(x);
                            } else {
                                json.args.push(x);
                            }        
                        }
                        k = cindex;
                    }
                } else if (c === 0 && (cindex-1 === k)) {
                    k = cindex;
                }
            }
        }
        if (i >= 0 && j < 0) {
            throw "incorrect method call declaration. Missing ')'"
        } else if (i<0 && j>0) {
            throw "incorrect method call declaration. Missing '('"
        }else if (i < 0 && j < 0 && k < 0) {
            return item;
        }else if (c === 0 && k > j) {
            if (json instanceof Array) {
                json.push(this.removeQuotes(item.substring(k+1, item.length).trim()));
            } else {
                json.args.push(this.removeQuotes(item.substring(k+1, item.length).trim()));
            }
        }
        return json;
    }
}
