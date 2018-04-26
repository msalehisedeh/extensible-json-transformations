import { Template } from './inquirer';
export interface Transformations {
    name: string;
    importUrls?: string[];
    rootTemplate: string;
    onResult?: string;
    templates: Template[];
}
export declare class Styler {
    private transformations;
    private inquirer;
    constructor(transformations: Transformations);
    changeRootNode(node: any): void;
    transform(): any[];
}
