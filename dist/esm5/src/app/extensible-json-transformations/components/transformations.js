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
var Styler = /** @class */ (function () {
    function Styler(transformations) {
        this.inquirer = new Inquirer();
        this.transformations = transformations;
        this.inquirer.initTemplates(this.transformations.templates);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    Styler.prototype.changeRootNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        this.inquirer.setRootNode(node);
    };
    /**
     * @return {?}
     */
    Styler.prototype.transform = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = [];
        /** @type {?} */
        var template = this.inquirer.templateForName(this.transformations.rootTemplate);
        if (template) {
            /** @type {?} */
            var attrs = Object.keys(template.style);
            /** @type {?} */
            var nodeList = this.inquirer.templateNodes(template, this.inquirer.nodeList(null));
            for (var i = 0; i < nodeList.length; i++) {
                /** @type {?} */
                var currentNode = nodeList[i];
                /** @type {?} */
                var resultingNode = {};
                for (var j = 0; j < attrs.length; j++) {
                    /** @type {?} */
                    var attr = attrs[j];
                    resultingNode[attr] = this.inquirer.invoke(template.style[attr], currentNode);
                }
                ;
                result.push(resultingNode);
            }
            ;
        }
        if (this.transformations.onResult && this.transformations.onResult.length) {
            /** @type {?} */
            var functions = this.inquirer.toQueryOperation(this.transformations.onResult);
            result = this.inquirer.invoke(functions, result);
        }
        return result;
    };
    return Styler;
}());
export { Styler };
if (false) {
    /** @type {?} */
    Styler.prototype.transformations;
    /** @type {?} */
    Styler.prototype.inquirer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvIiwic291cmNlcyI6WyJzcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy90cmFuc2Zvcm1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBVSxRQUFRLEVBQVksTUFBTSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWF4RCxJQUFBO0lBS0ksZ0JBQVksZUFBK0I7UUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0Q7Ozs7O0lBRU0sK0JBQWM7Ozs7Y0FBQyxJQUFRO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7OztJQUc3QiwwQkFBUzs7Ozs7UUFDWixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O1FBQ2hCLElBQU0sUUFBUSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFM0YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7WUFDWCxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7WUFDMUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFckYsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O2dCQUN0QyxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUNoQyxJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOztvQkFDcEMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDakY7Z0JBQUEsQ0FBQztnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzlCO1lBQUEsQ0FBQztTQUNMO1FBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7WUFDdkUsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDcEQ7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDOztpQkFsRHRCO0lBb0RDLENBQUE7QUF2Q0Qsa0JBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSlhQYXRoLCBJbnF1aXJlciwgVGVtcGxhdGUgfSBmcm9tICcuL2lucXVpcmVyJztcclxuLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtYXRpb25zIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGltcG9ydFVybHM/OnN0cmluZ1tdLFxyXG4gICAgcm9vdFRlbXBsYXRlOiBzdHJpbmcsXHJcbiAgICBvblJlc3VsdD86IHN0cmluZyxcclxuICAgIHRlbXBsYXRlczogVGVtcGxhdGVbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3R5bGVyICB7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuICAgIHByaXZhdGUgaW5xdWlyZXI6SW5xdWlyZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtYXRpb25zOlRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIgPSBuZXcgSW5xdWlyZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9ucyA9IHRyYW5zZm9ybWF0aW9ucztcclxuICAgICAgICB0aGlzLmlucXVpcmVyLmluaXRUZW1wbGF0ZXModGhpcy50cmFuc2Zvcm1hdGlvbnMudGVtcGxhdGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlUm9vdE5vZGUobm9kZTphbnkpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyLnNldFJvb3ROb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlOlRlbXBsYXRlID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZUZvck5hbWUodGhpcy50cmFuc2Zvcm1hdGlvbnMucm9vdFRlbXBsYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZS5zdHlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVMaXN0ID0gdGhpcy5pbnF1aXJlci50ZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLCB0aGlzLmlucXVpcmVyLm5vZGVMaXN0KG51bGwpKTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gbm9kZUxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRpbmdOb2RlID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IoIGxldCBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ05vZGVbYXR0cl0gPSB0aGlzLmlucXVpcmVyLmludm9rZSh0ZW1wbGF0ZS5zdHlsZVthdHRyXSwgY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlc3VsdGluZ05vZGUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuY3Rpb25zID0gdGhpcy5pbnF1aXJlci50b1F1ZXJ5T3BlcmF0aW9uKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0KTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnF1aXJlci5pbnZva2UoZnVuY3Rpb25zLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==