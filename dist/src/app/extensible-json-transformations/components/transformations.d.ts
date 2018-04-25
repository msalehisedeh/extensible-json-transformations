export interface Transformations {
    name: string;
    importUrls?: string[];
    rootTemplate: string;
    onResult?: string;
    templates: Template[];
}
export interface Template {
    name: string;
    match: string;
    value?: string;
    context: string;
    inPool?: string;
    style: any;
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
export declare class Styler {
    private templates;
    private globalPool;
    private supportedMethods;
    private transformations;
    private rootNode;
    constructor(transformations: Transformations);
    changeRootNode(node: any): void;
    private nodeList(item);
    transform(): any[];
    apply(...args: any[]): any[];
    private execute(x, node);
    private concatenate(...args);
    private split(...args);
    private valueOf(...args);
    private each(...args);
    private enlist(...args);
    private join(...args);
    private evaluateOperation(left, operation, right);
    private templateNodes(template, nodes);
    private match(...args);
    private filter(...args);
    private select(...args);
    private style(...args);
    private offPool(...args);
    private registerMethods();
    private prepareTransformations();
    private preparePools();
    private removeQuotes(str);
    private parseFunctions(item);
}
