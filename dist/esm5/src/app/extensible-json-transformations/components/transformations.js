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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9jb21wb25lbnRzL3RyYW5zZm9ybWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFVLFFBQVEsRUFBWSxNQUFNLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBYXhELElBQUE7SUFLSSxnQkFBWSxlQUErQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvRDs7Ozs7SUFFTSwrQkFBYzs7OztjQUFDLElBQVE7UUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7O0lBRzdCLDBCQUFTOzs7OztRQUNaLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7UUFDaEIsSUFBTSxRQUFRLEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUzRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztZQUNYLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUMxQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVyRixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ3RDLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2hDLElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFDekIsR0FBRyxDQUFBLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O29CQUNwQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUNqRjtnQkFBQSxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDOUI7WUFBQSxDQUFDO1NBQ0w7UUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztZQUN2RSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEYsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwRDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7O2lCQWxEdEI7SUFvREMsQ0FBQTtBQXZDRCxrQkF1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKWFBhdGgsIElucXVpcmVyLCBUZW1wbGF0ZSB9IGZyb20gJy4vaW5xdWlyZXInO1xyXG4vKlxyXG4gKiB0b29sIHRvIGRpc3BsYXkgcmVzdWx0IG9mIGEgc2VhcmNoIG9uIHNldCBvZiBwb2ludHMgb2YgaW50ZXJlc3RzIG9uIG9iamVjdHMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2Zvcm1hdGlvbnMge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgaW1wb3J0VXJscz86c3RyaW5nW10sXHJcbiAgICByb290VGVtcGxhdGU6IHN0cmluZyxcclxuICAgIG9uUmVzdWx0Pzogc3RyaW5nLFxyXG4gICAgdGVtcGxhdGVzOiBUZW1wbGF0ZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdHlsZXIgIHtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybWF0aW9uczogVHJhbnNmb3JtYXRpb25zO1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlcjpJbnF1aXJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0cmFuc2Zvcm1hdGlvbnM6VHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5pbnF1aXJlciA9IG5ldyBJbnF1aXJlcigpO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25zID0gdHJhbnNmb3JtYXRpb25zO1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIuaW5pdFRlbXBsYXRlcyh0aGlzLnRyYW5zZm9ybWF0aW9ucy50ZW1wbGF0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VSb290Tm9kZShub2RlOmFueSkge1xyXG4gICAgICAgIHRoaXMuaW5xdWlyZXIuc2V0Um9vdE5vZGUobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zZm9ybSgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGU6VGVtcGxhdGUgPSB0aGlzLmlucXVpcmVyLnRlbXBsYXRlRm9yTmFtZSh0aGlzLnRyYW5zZm9ybWF0aW9ucy5yb290VGVtcGxhdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLnN0eWxlKTtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZUxpc3QgPSB0aGlzLmlucXVpcmVyLnRlbXBsYXRlTm9kZXModGVtcGxhdGUsIHRoaXMuaW5xdWlyZXIubm9kZUxpc3QobnVsbCkpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBub2RlTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdGluZ05vZGUgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciggbGV0IGogPSAwOyBqIDwgYXR0cnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nTm9kZVthdHRyXSA9IHRoaXMuaW5xdWlyZXIuaW52b2tlKHRlbXBsYXRlLnN0eWxlW2F0dHJdLCBjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocmVzdWx0aW5nTm9kZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0ICYmIHRoaXMudHJhbnNmb3JtYXRpb25zLm9uUmVzdWx0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbnMgPSB0aGlzLmlucXVpcmVyLnRvUXVlcnlPcGVyYXRpb24odGhpcy50cmFuc2Zvcm1hdGlvbnMub25SZXN1bHQpO1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmlucXVpcmVyLmludm9rZShmdW5jdGlvbnMsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuIl19