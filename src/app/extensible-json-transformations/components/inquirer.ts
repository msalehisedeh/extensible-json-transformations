export interface Template {
    name: string,
    match: string,
    value?: string,
    context: string,
    inPool?: string,
    style: any
}

export interface QueryOperation {
    name: string,
    args?: QueryOperation[]
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

export class Inquirer  {

    private supportedMethods = {};
    private templates = {};
    private rootNode;
    private globalPool = {};

    constructor() {
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

    public setRootNode(node:any) {
        this.rootNode = node;
        this.initPools(this.templates);
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

    // performs query of nested function calls on the given node.
    query(command:string, node) {
        const mothods =this.toQueryOperation(command);

        if (node instanceof Array) {
            let list = [];
            node.map( (n) => {
                list = list.concat(this.invoke(mothods, n))
            });
            return list;
        }
        return this.invoke(mothods, node);
    }

    // performs query with given list of query opertations
    invoke(method:QueryOperation, node) {
        let list:any = [];
        if (typeof method === 'object') {
            if (method.args instanceof Array) {
                if (method.args.length)
                method.args.map( (arg) => {
                    if (arg.name) {
                        list.push(this.invoke(arg, node));
                    } else {
                        list.push(arg);
                    }
                });
            } else {
                list.push(method.args);
            }
            list.push(node);
            const f = this.supportedMethods[method.name];
            if (f) {
                list = f.apply(this, list);
            } else {
                list = method.name;
            }
        } else {
            list = method;
        }
        return list;
    }

    // concatenate(a, b, c): joins arguments into a string
    // join args[0,1,2], node args[3]
    concatenate(...args) {
        const left = args[0];
        const delim= args[1];
        const right= args[2];
        const result = [];

        if (left instanceof Array) {
            if (right instanceof Array) {
                if (left.length > right.length) {
                    left.map((item, index)=>{
                        const x = right.length > index ? right[index] : "";
                        result.push( item+delim+x);
                    });
                } else {
                    right.map((item, index)=>{
                        const x = left.length > index ? left[index] : "";
                        result.push( x+delim+item);
                    });
                }
            } else {
                left.map((item)=>{
                    result.push( item+delim+right);
                });
            }
        } else {
            if (right instanceof Array) {
                right.map((item)=>{
                    result.push( left+delim+item);
                });
            } else {
                result.push(left);
                result.push(delim);
                result.push(right);
            }
        }
        return result.join("");
    }
    // split(item,','): splits value into a list
    // split args[0] with args[1], node args[2]
    split(...args) {
        return args[0] ? args[0].split(args[1]) : [];
    }
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    valueOf(...args) {
        const jpath = new JXPath(args[0]);
        return jpath.valueOf(args[1]);
    }
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1], node args[2]
    each(...args) {
        const list = [];
        args[0].map( (item) => {
            const method = {
                name: "valueOf",
                args: args[1]
            }
            list.push(this.invoke(method, item));
        });
        return list;
    }
    // enlist(...): insert argument values into a list
    enlist(...args) {
        const list = [];
        args.slice(0, args.length - 1).map( (item) => {
            list.push(item); // make sure last two item are not node and template
        })
        return list;
    }
    // join(array,','): joins items of the list into a string
    join(...args) {
        return args[0].join(args[1]);
    }
    // apply(template,path,array): apply the template in current context for each value 
    // that matches the given path. args[0] name to apply, args[1] node
    apply(...args) {
        return this.match(args[0],args[1],"=",args[2],args[3]);
    }
    // match(template,path,operation,values): , node args[4]
    // for value of target in given template nodes, evaluate operation for given value(s). 
    match(...args) {
        const template:Template = this.templateForName(args[0]);

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
    filter(...args) {
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
    select(...args) {
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
    style(...args) {
        const template:Template = this.templateForName(args[0]);

        if (!template) {
            throw "Missing Template definition for '" + args[0] + "'.";
        }

        const result = [];
        const attrs = Object.keys(template.style);
    
        args[1].map( (item) => {
            const node = {};
            attrs.map( (attr) => {
                node[attr] = this.invoke(template.style[attr], item);
            });
            result.push(node);
        })
        return result;
    }
    addSupportingMethod(name, method) {
        this.supportedMethods[name] = method;
    }
     private removeQuotes(str) {
        return (str.length && str[0] === '\'' && str[str.length-1] === '\'') ? str.substring(1,str.length-1) : str;
    }
    toQueryOperation(methods) {
        const operations = methods.replace(/([^']+)|('[^']+')/g, function($0, $1, $2) {
            if ($1) {
                return $1.replace(/\s/g, '');
            } else {
                return $2; 
            } 
        }).replace(/'[^']+'/g, function (match) {
            return match.replace(/,/g, '~');
        });
        return this.toFunctions(operations);
    }
    private toFunctions(item){
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
                        json["args"] = this.toFunctions(item.substring(i+1,j));
                    } else {
                        if (!isArry) {
                            json = [];
                        }
                        json.push({ 
                            name: item.substring(k+1, i), 
                            args: this.toFunctions(item.substring(i+1,j)) 
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
                                name: this.removeQuotes(item.substring(k+1, cindex).replace(/~/g, ',')),
                                args: []
                            });
                        }
                        k = cindex;
                    } else {
                        const x = this.removeQuotes(item.substring(k+1, cindex).replace(/~/g, ','));
                        if (x.indexOf('(') < 0) {
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
                json.push(this.removeQuotes(item.substring(k+1, item.length).replace(/~/g, ',')));
            } else {
                json.args.push(this.removeQuotes(item.substring(k+1, item.length).replace(/~/g, ',')));
            }
        }
        return json;
    }

    private templateNodes(template:Template, nodes) {
        let list = [];
        let n = nodes;

        if (template.context === "root") {
            if (!this.rootNode) {
                throw "Unable to find root node to perform operation."
            }
            n = this.nodeList(this.rootNode);
        }    
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
   
    initTemplates(list) {
        list.map( (template: any) => {
            Object.keys(template.style).map( (key) => {
                template.style[key] = this.toQueryOperation(template.style[key]);
            });
            this.templates[template.name] = template;
        });
    }
    initPools(templates) {
        const list = Object.keys(templates);
        if (list.length === 0) {
            throw "Missing Template definitions.";
        }
        if (!this.rootNode) {
            throw "Unable to find root node to perform operation."
        }

        this.globalPool = {};

        list.map( (template: string) => {
            const t = this.templateForName(template);
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
}
