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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvIiwic291cmNlcyI6WyJzcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy90cmFuc2Zvcm1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBVSxRQUFRLEVBQVksTUFBTSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWF4RCxNQUFNOzs7O0lBS0YsWUFBWSxlQUErQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvRDs7Ozs7SUFFTSxjQUFjLENBQUMsSUFBUTtRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7SUFHN0IsU0FBUzs7UUFDWixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O1FBQ2hCLE1BQU0sUUFBUSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFM0YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7WUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7WUFDMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFckYsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O2dCQUN0QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUNoQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOztvQkFDcEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDakY7Z0JBQUEsQ0FBQztnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzlCO1lBQUEsQ0FBQztTQUNMO1FBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7WUFDdkUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDcEQ7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDOztDQUVyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEpYUGF0aCwgSW5xdWlyZXIsIFRlbXBsYXRlIH0gZnJvbSAnLi9pbnF1aXJlcic7XHJcbi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybWF0aW9ucyB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBpbXBvcnRVcmxzPzpzdHJpbmdbXSxcclxuICAgIHJvb3RUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgb25SZXN1bHQ/OiBzdHJpbmcsXHJcbiAgICB0ZW1wbGF0ZXM6IFRlbXBsYXRlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0eWxlciAge1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtYXRpb25zOiBUcmFuc2Zvcm1hdGlvbnM7XHJcbiAgICBwcml2YXRlIGlucXVpcmVyOklucXVpcmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRyYW5zZm9ybWF0aW9uczpUcmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmlucXVpcmVyID0gbmV3IElucXVpcmVyKCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbnMgPSB0cmFuc2Zvcm1hdGlvbnM7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5pbml0VGVtcGxhdGVzKHRoaXMudHJhbnNmb3JtYXRpb25zLnRlbXBsYXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZVJvb3ROb2RlKG5vZGU6YW55KSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlci5zZXRSb290Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTpUZW1wbGF0ZSA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVGb3JOYW1lKHRoaXMudHJhbnNmb3JtYXRpb25zLnJvb3RUZW1wbGF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHJzID0gT2JqZWN0LmtleXModGVtcGxhdGUuc3R5bGUpO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlTGlzdCA9IHRoaXMuaW5xdWlyZXIudGVtcGxhdGVOb2Rlcyh0ZW1wbGF0ZSwgdGhpcy5pbnF1aXJlci5ub2RlTGlzdChudWxsKSk7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGVMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0aW5nTm9kZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBhdHRycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdOb2RlW2F0dHJdID0gdGhpcy5pbnF1aXJlci5pbnZva2UodGVtcGxhdGUuc3R5bGVbYXR0cl0sIGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyZXN1bHRpbmdOb2RlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQgJiYgdGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IHRoaXMuaW5xdWlyZXIudG9RdWVyeU9wZXJhdGlvbih0aGlzLnRyYW5zZm9ybWF0aW9ucy5vblJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKGZ1bmN0aW9ucywgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG4iXX0=