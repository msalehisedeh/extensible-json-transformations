export interface Template {
    name: string;
    match?: string;
    value?: string;
    context: string;
    inPool?: string;
    style: any;
}
export interface QueryOperation {
    name: string;
    args?: QueryOperation[];
}
export declare class JXPath {
    private path;
    constructor(jpath: any);
    fromLast(): JXPath;
    nodeOf(node: any): any;
    private _nodeOf(node, path);
    valueOf(node: any): any;
    private _valueOf(node, path);
}
export declare class Inquirer {
    private supportedMethods;
    private templates;
    private rootNode;
    private contextNode;
    private globalPool;
    private pathPool;
    constructor();
    private jXPathFor(path);
    setRootNode(node: any): void;
    setContextNode(node: any): void;
    templateForName(name: any): any;
    nodeList(node: any): any;
    query(command: string, node: any): any;
    invoke(operation: QueryOperation, node: any): any;
    concatenate(...args: any[]): any;
    split(...args: any[]): any;
    valueOf(...args: any[]): any;
    each(...args: any[]): any[];
    enlist(...args: any[]): any[];
    join(...args: any[]): any;
    apply(...args: any[]): any[];
    match(...args: any[]): any[];
    filter(...args: any[]): any[];
    select(...args: any[]): any[];
    style(...args: any[]): any[];
    addSupportingMethod(name: any, method: any): void;
    private removeQuotes(str);
    toQueryOperation(methods: any): any;
    private toFunctions(item);
    templateNodes(template: Template, nodes: any): any[];
    private evaluateOperation(left, operation, right);
    private offPool(...args);
    initTemplates(list: any): void;
    initPools(templates: any): void;
}
