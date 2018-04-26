import { JXPath, Inquirer, Template } from './inquirer';
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

export class Styler  {

    private transformations: Transformations;
    private inquirer:Inquirer;

    constructor(transformations:Transformations) {
        this.inquirer = new Inquirer();
        this.transformations = transformations;
        this.inquirer.initTemplates(this.transformations.templates);
    }

    public changeRootNode(node:any) {
        this.inquirer.setRootNode(node);
    }

    public transform() {
        let result = [];
        const template:Template = this.inquirer.templateForName(this.transformations.rootTemplate);
        
        if (template) {
            const list = this.inquirer.nodeList(null);
            const attrs = Object.keys(template.style);
    
            list.map( (item) => {
                const node = {};
                attrs.map( (attr) => {
                    node[attr] = this.inquirer.invoke(template.style[attr], item);
                });
                result.push(node);
            });
        }
        if(this.transformations.onResult && this.transformations.onResult.length) {
            const functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    }
}
