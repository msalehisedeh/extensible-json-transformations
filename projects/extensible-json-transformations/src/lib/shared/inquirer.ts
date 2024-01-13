/*
 * Intentionally avoiding use of map call on list to reduce the call stack numbers.
 * On large scale JSON, call stack becomes a problem to be avoided.
 */


export interface Template {
    name: string,
    match?: string,
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
    constructor(jpath: string){
        this.path = jpath?.split(".");
    }
    fromLast() {
        return new JXPath(this.path[this.path.length - 1]);
    }
    nodeOf(node: any) {
        return this._nodeOf(node, this.path);
    }
    private _nodeOf(node: any, path: string[]) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
                const list = [];
                for (let q = 0; q < this.path.length; q++) {
                    const item = pItem[q];
                    const x = this._nodeOf(item[path[i]], path.slice(i+1,path.length));
                    if (x && x !== null) {
                        list.push(x);
                    }
                };
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
    valueOf(node: any) {
        return this._valueOf(node, this.path);
    }
    private _valueOf(node: any, path: string[]) {
        let pItem = node;
        for (let i = 0; i < this.path.length; i++) {
            if (pItem instanceof Array) {
              const list = [];
              for (let q = 0; q < this.path.length; q++) {
                const item = pItem[q];
                list.push(this._valueOf(item[path[i]], path.slice(i+1,path.length)));
              }
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

    private supportedMethods: any = {};
    private templates: any = {};
    private rootNode!: any;
    private contextNode!: any; // should be set before any call is made... this is to avoid call stack overflow in extremelt large JSON
    private globalPool: any = {};
    private pathPool: any = {};// to avoid stackoverflow... and perform faster

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

    private jXPathFor(path: string) {
        let p:JXPath = this.pathPool[path];
        if (!p) {
            p = new JXPath(path);
            this.pathPool[path] = p;
        }
        return p;
    }

    setRootNode(node:any) {
        this.rootNode = this.nodeList(node);
        this.initPools(this.templates);
    }
    setContextNode(node: any) {
        this.contextNode = node;
    }
    templateForName(name: string) {
        return this.templates[name];
    }
    // if node is null, root node will be used.
    nodeList(node: any) {
        const item = node === null ? this.rootNode : node;
        let list: any;

        if (item instanceof Array) {
            list = item;
         } else {
             const x = Object.keys(item);
             list = [];
             for (let t = 0; t < x.length; t++) {
                const xItem = x[t];
                if (item[xItem] instanceof Array) {
                    list = list.concat(item[xItem]);
                } else {
                    list.push(item[xItem]);
                }
            }
         }
         return list;
    }

    // performs query of nested function calls on the given node.
    query(command:string, node: any) {
        const mothods =this.toQueryOperation(command);

        if (node instanceof Array) {
            let list: any = [];
            for (let q = 0; q < node.length; q++) {
                const nodeItem = node[q];
                list = list.concat(this.invoke(mothods, nodeItem))
            };
            return list;
        }
        return this.invoke(mothods, node);
    }

    // performs query with given list of query opertations
    invoke(operation:QueryOperation, node: any) {
        let list:any = [];
        if ((typeof node === "object") && (node instanceof Array) && node.length === 0) {
            list = [];
        } else if (typeof operation === 'object') {
            const f = this.supportedMethods[operation.name];
            if (f) {
                if (operation.args instanceof Array) {
                    for (let a = 0; a < operation.args.length; a++) {
                        const arg = operation.args[a]
                        if (arg.name) {
                            list.push(this.invoke(arg, node));
                        } else {
                            list.push(arg);
                        }
                    }
                } else {
                    list.push(operation.args);
                }
                // list.push(node);
                const oldContext = this.contextNode;
                this.contextNode = node;
                list = f.apply(this, list);
                this.contextNode = oldContext;
            } else {
                list = operation.name;
            }
        } else {
            list = operation;
        }
        return list;
    }

    // concatenate(a, b, c): joins arguments into a string
    // join args[0,1,2]
    concatenate(...args: any) {
        const left = args[0];
        const delim= args[1];
        const right= args[2];
        const result = [];

        if (left instanceof Array) {
            if (right instanceof Array) {
                if (left.length > right.length) {
                    for (let q = 0; q < left.length; q++) {
                        result.push( left[q] + delim + (right.length > q ? right[q] : ""));
                    };
                } else {
                    for (let q = 0; q < right.length; q++) {
                        result.push( (left.length > q ? left[q] : "") + delim + right[q]);
                    };
                }
            } else {
                for (let q = 0; q < left.length; q++) {
                    result.push( left[q] + delim + right);
                };
            }
        } else {
            if (right instanceof Array) {
                for (let q = 0; q < right.length; q++) {
                    result.push( left + delim + right[q]);
                };
            } else {
                result.push(left + delim + right);
            }
        }
        return result.length > 1 ? result : result[0];
    }
    // split(item,','): splits value into a list
    // split args[0] with args[1]
    split(...args: any) {
        if (args[0]) {
            return [args[0].split(args[1])];
        }
        return [];
    }
    // valueOf(path):  evaluates value of argument path
    // path = args[0], node to evaluate = args[1]
    valueOf(...args: any) {
        const jpath = this.jXPathFor(args[0]);
        return jpath.valueOf(this.contextNode);
    }
    // each(list,method): For each item in list, invode the callback method
    // each item of args[0] execute function of args[1]
    each(...args: any) {
        const list = [];
        const method = {name: "valueOf", args: args[1]};
        
        for (let q = 0; q < args[0].length; q++) {
            const node = args[0][q];
            list.push(this.invoke(method, node));
        };
        return list;
    }
    // enlist(...): insert argument values into a list
    enlist(...args: any) {
        const list: any = [];
        args.map( (item: any) => {
            list.push(item); // make sure last two item are not node and template
        })
        return [list];
    }
    // join(array,','): joins items of the list into a string
    join(...args: any) {
        if (args[0]) {
            return this.joinItems(Array.isArray(args[0][0]) ? args[0][0] : args[0], args[1])
        }
        return [];
    }
    private joinItems(list: any[], separator: string) {
        return list.join(separator);
    }

    // apply(template,path,array): apply the template in root context for each value 
    // that matches the given path. args[0] name to apply
    apply(...args: any) {
        const path = this.jXPathFor(args[1]);
        const path2= path.fromLast();
        const values = args[2];
        let list: any[] = [];

        for (let c = 0; c < this.rootNode.length; c++) {
            const node = this.rootNode[c];
            const value = path.nodeOf(node);
            this.evaluateIntoList(value, list, node, path2, values, '=');
        };
        if (list.length) {
            list = this.style(args[0], list);
        }
        return list;
    }
    // match(template,path,operation,values): , node args[4]
    // for value of target in given template nodes, evaluate operation for given value(s). 
    match(...args: any) {
        const template:Template = this.templateForName(args[0]);

        if (!template) {
            throw {
                message: "Missing Template definition for '" + args[0] + "'.",
                stack: new Error().stack
            };
        }
        const path = this.jXPathFor(args[1]);
        const path2= path.fromLast();
        const operation = args[2];
        const values = args[3];
        const nodes = this.templateNodes(template, this.contextNode)
        const list: any[] = [];
        if (nodes instanceof Array) {
            for (let c = 0; c < nodes.length; c++) {
                const node = nodes[c];
                const value = path.nodeOf(node);
                this.evaluateIntoList(value, list, nodes, path2, values, operation);
            };
        } else {
            const value = path.nodeOf(nodes);
            this.evaluateIntoList(value, list, nodes, path2, values, operation);
        }
       return list;
    }
    private evaluateIntoList(value: any[], list: any, nodes: any, path2: any, values: any, operation: any) {
        if (value instanceof Array) {
            for (let d = 0; d < value.length; d++) {
                const v = value[d];
                const x = path2.valueOf(v);
                if (v instanceof Array) {
                    this.evaluateIntoList(v, list, nodes, path2, values, operation);
                } else if (this.evaluateOperation(x, operation, values)) {
                    list.push(nodes);
                }
            }
        } else {
            const x = path2.valueOf(nodes);
            if (this.evaluateOperation(x,operation, values)) {
                list.push(nodes);
            }
        }
    }

    // filter(path,operation,value): for value of target in current context, 
    // evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in.
    filter(...args: any) {
        const path = this.jXPathFor(args[0]);
        const operation = args[1];
        const values = args[2];
        const list = [];
        const items = Array.isArray(this.contextNode) ? this.contextNode: [this.contextNode];
        for (let a = 0; a < items.length; a++) {
            const node = items[a];
            const value = path.valueOf(node);
            if (value instanceof Array) {
                for (let d = 0; d < value.length; d++) {
                    const v = value[d];
                    if (this.evaluateOperation(v,operation, values)) {
                        list.push(node);
                    }
                }
            } else {
                if (this.evaluateOperation(value,operation, values)) {
                    list.push(node);
                }
            }
        }
        return list;
    }
    // select(path): select the nodes with given path in current context
    select(...args: any) {
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
        } else {
            const value = path.nodeOf(this.contextNode);
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
    style(...args: any) {
        const template:Template = this.templateForName(args[0]);

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
                const node: any = {};
                for (let d = 0; d < attrs.length; d++) {
                    const attr = attrs[d];
                    node[attr] = this.invoke(template.style[attr], item);
                }
                result.push(node);
            }
        } else {
            const node: any = {};
            for (let d = 0; d < attrs.length; d++) {
                const attr = attrs[d];
                node[attr] = this.invoke(template.style[attr], args[1]);
            }
            result.push(node);
        }
        return result;
    }
    addSupportingMethod(name: string, method: any) {
        this.supportedMethods[name] = method;
    }
     private removeQuotes(str: string) {
        return (str.length && str[0] === '\'' && str[str.length-1] === '\'') ? str.substring(1,str.length-1) : str;
    }
    toQueryOperation(methods: any) {
        const operations = methods.replace(/([^']+)|('[^']+')/g, function($0: any, $1: any, $2: any) {
            if ($1) {
                return $1.replace(/\s/g, '');
            } else {
                return $2; 
            } 
        }).replace(/'[^']+'/g, function (match: any) {
            return match.replace(/,/g, '~');
        });
        return this.toFunctions(operations);
    }
    private toFunctions(item: any){
        // if item = join(enlist(valueOf(address.street),valueOf(address.city),valueOf(address.zipcode)),',')
        let i = -1;
        let j = -1;
        let k = -1;
        let c = 0;
        let json: any = {};
        for (let cindex = 0; cindex < item.length; cindex++) {
            if (item[cindex] === '(') {
                if (c === 0) {
                    i = cindex;
                }
                c++;
            } else if (item[cindex] === ')') {
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
            throw {
                message: "incorrect method call declaration. Missing ')'",
                stack: new Error().stack
            };
        } else if (i<0 && j>0) {
            throw {
                message: "incorrect method call declaration. Missing '('",
                stack: new Error().stack
            };
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

    templateNodes(template:Template, nodes: any) {
        let list = [];
        let nodeList = nodes;

        if (template.context === "root") {
            if (!this.rootNode) {
                throw {
                    message:"Unable to find root node to perform operation.",
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
        } else if (nodes) {
            list = nodeList;
        }
        return list;
    }
    // Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and
    // for string value means indexOf. '!' means not equal or not in.
    private evaluateOperation(left: any, operation: any, right: any) {
        let result = false;
        if (right instanceof Array) {
            if (operation === "=") {
                for (let i=0;i<right.length;i++){
                    if (left == right[i]){
                        result = true;
                        break;
                    }
                }
            } else if (operation === "in") {
                for (let i=0;i<right.length;i++){
                    if (right[i].indexOf(left) >= 0){
                        result = true;
                        break;
                    }
                };
            } else if (operation === "!") {
                let f = false;
                for (let i=0;i<right.length;i++){
                    if (left == right[i]){
                        f = true;
                        break;
                    }
                };
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
    private offPool(...args: any) {
        const list = [];
        const pool = this.globalPool[args[0]];
        const keys = args[1];
        if (!pool) {
            throw {
                message: "Attempting to access pool '" + args[0] + "' that is not created.",
                stack: new Error().stack
            };
        }
        if (keys instanceof Array){
            for (let z=0; z < keys.length; z++) {
                const key = keys[z];
                const node = pool[key];
                if (node) {
                    list.push(node);
                } else {
                    // should we throw here?
                }
            }
        } else {
            const node = pool[keys];
            if (node) {
                list.push(node);
            }
        }
        return list;
    }
   
    initTemplates(list: any) {
        this.templates = {};
        for (let i=0; i < list.length; i++){
            const template: any= list[i];
            const styles = Object.keys(template.style)
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
    initPools(templates: any) {
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

        for (let i=0; i < list.length; i++){
            const template: string = list[i];
            const t = this.templateForName(template);
            if (t.inPool) {
                const pool: any = {};
                const path = this.jXPathFor(t.inPool);
                const match= t.match;
                const nodes= this.rootNode;
                if (match && t.value) {
                    const mpath = this.jXPathFor(match);
                    
                    for (let k=0; k < nodes.length; k++){
                        const v = mpath.valueOf(nodes[k]);
                        if (v === t.value) {
                            pool[path.valueOf(nodes[k])] = nodes[k];
                        }
                    }
                } else {
                    for (let k=0; k < nodes.length; k++){
                        pool[path.valueOf(nodes[k])] = nodes[k];
                    }
                }
                this.globalPool[t.name] = pool;
            }
        }
    }
}
