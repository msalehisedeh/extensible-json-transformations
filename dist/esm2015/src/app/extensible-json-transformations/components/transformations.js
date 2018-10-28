/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inquirer } from './inquirer';
/**
 * @record
 */
export function Transformations() { }
/** @type {?} */
Transformations.prototype.name;
/** @type {?|undefined} */
Transformations.prototype.importUrls;
/** @type {?} */
Transformations.prototype.rootTemplate;
/** @type {?|undefined} */
Transformations.prototype.onResult;
/** @type {?} */
Transformations.prototype.templates;
export class Styler {
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
                ;
                result.push(resultingNode);
            }
            ;
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            /** @type {?} */
            const functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    }
}
if (false) {
    /** @type {?} */
    Styler.prototype.transformations;
    /** @type {?} */
    Styler.prototype.inquirer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL3RyYW5zZm9ybWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFVLFFBQVEsRUFBWSxNQUFNLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBYXhELE1BQU07Ozs7SUFLRixZQUFZLGVBQStCO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQy9EOzs7OztJQUVNLGNBQWMsQ0FBQyxJQUFRO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7OztJQUc3QixTQUFTOztRQUNaLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7UUFDaEIsTUFBTSxRQUFRLEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUzRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztZQUNYLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVyRixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ3RDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2hDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFDekIsR0FBRyxDQUFBLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O29CQUNwQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUNqRjtnQkFBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDOUI7WUFBQSxDQUFDO1NBQ0w7UUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztZQUN2RSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEYsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwRDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7O0NBRXJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSlhQYXRoLCBJbnF1aXJlciwgVGVtcGxhdGUgfSBmcm9tICcuL2lucXVpcmVyJztcclxuLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtYXRpb25zIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGltcG9ydFVybHM/OnN0cmluZ1tdLFxyXG4gICAgcm9vdFRlbXBsYXRlOiBzdHJpbmcsXHJcbiAgICBvblJlc3VsdD86IHN0cmluZyxcclxuICAgIHRlbXBsYXRlczogVGVtcGxhdGVbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3R5bGVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuICAgIHByaXZhdGUgaW5xdWlyZXI6SW5xdWlyZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtYXRpb25zOlRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIgPSBuZXcgSW5xdWlyZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9ucyA9IHRyYW5zZm9ybWF0aW9ucztcclxuICAgICAgICB0aGlzLmlucXVpcmVyLmluaXRUZW1wbGF0ZXModGhpcy50cmFuc2Zvcm1hdGlvbnMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlUm9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyLnNldFJvb3ROb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZUZvck5hbWUodGhpcy50cmFuc2Zvcm1hdGlvbnMucm9vdFRlbXBsYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVMaXN0ID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmlucXVpcmVyLm5vZGVMaXN0KG51bGwpKTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZUxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRpbmdOb2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IoIGxldCBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ05vZGVbYXR0cl0gPSB0aGlzLmlucXVpcmVyLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlc3VsdGluZ05vZGUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25zID0gdGhpcy5pbnF1aXJlci50b1F1ZXJ5T3BlcmF0aW9uKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0KTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnF1aXJlci5pbnZva2UoZnVuY3Rpb25zLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==