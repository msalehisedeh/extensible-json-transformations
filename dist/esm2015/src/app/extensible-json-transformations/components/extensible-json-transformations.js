/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Styler } from './transformations';
export class XjsltComponent {
    constructor() {
        this.node = {};
        this.ontransformation = new EventEmitter();
        this.onerror = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.node && this.transformations) {
            if (!this.styler) {
                this.styler = new Styler(this.transformations);
            }
            this.styler.changeRootNode(this.node);
            try {
                this.ontransformation.emit(this.styler.transform());
            }
            catch (e) {
                console.log(e);
                this.onerror.emit(e);
            }
        }
    }
    /**
     * @param {?} chages
     * @return {?}
     */
    ngOnChanges(chages) {
        if (chages.transformations) {
            this.styler = undefined;
            setTimeout(this.ngOnInit.bind(this), 333);
        }
        else if (chages.node) {
            setTimeout(this.ngOnInit.bind(this), 333);
        }
    }
}
XjsltComponent.decorators = [
    { type: Component, args: [{
                selector: 'xjslt',
                template: ``
            }] }
];
XjsltComponent.propDecorators = {
    node: [{ type: Input, args: ["node",] }],
    transformations: [{ type: Input, args: ["transformations",] }],
    ontransformation: [{ type: Output, args: ["ontransformation",] }],
    onerror: [{ type: Output, args: ["onerror",] }]
};
if (false) {
    /** @type {?} */
    XjsltComponent.prototype.styler;
    /** @type {?} */
    XjsltComponent.prototype.node;
    /** @type {?} */
    XjsltComponent.prototype.transformations;
    /** @type {?} */
    XjsltComponent.prototype.ontransformation;
    /** @type {?} */
    XjsltComponent.prototype.onerror;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zLyIsInNvdXJjZXMiOlsic3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFtQixNQUFNLG1CQUFtQixDQUFDO0FBTzVELE1BQU07O29CQUtHLEVBQUU7Z0NBTVUsSUFBSSxZQUFZLEVBQUU7dUJBRzNCLElBQUksWUFBWSxFQUFFOzs7OztJQUU1QixRQUFRO1FBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNoRDtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDckQ7WUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0Y7S0FDRjs7Ozs7SUFDRCxXQUFXLENBQUMsTUFBTTtRQUNoQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDM0M7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkIsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzNDO0tBQ0Y7OztZQTFDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxFQUFFO2FBRWI7OzttQkFLRSxLQUFLLFNBQUMsTUFBTTs4QkFHWixLQUFLLFNBQUMsaUJBQWlCOytCQUd2QixNQUFNLFNBQUMsa0JBQWtCO3NCQUd6QixNQUFNLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdHlsZXIsIFRyYW5zZm9ybWF0aW9ucyB9IGZyb20gJy4vdHJhbnNmb3JtYXRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAneGpzbHQnLFxyXG4gIHRlbXBsYXRlOiBgYCxcclxuICBzdHlsZXM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWGpzbHRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyAge1xyXG4gIFxyXG4gIHByaXZhdGUgc3R5bGVyO1xyXG5cclxuICBASW5wdXQoXCJub2RlXCIpXHJcbiAgbm9kZSA9IHt9O1xyXG5cclxuICBASW5wdXQoXCJ0cmFuc2Zvcm1hdGlvbnNcIilcclxuICB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuXHJcbiAgQE91dHB1dChcIm9udHJhbnNmb3JtYXRpb25cIilcclxuICBvbnRyYW5zZm9ybWF0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICBpZighdGhpcy5zdHlsZXIpIHtcclxuICAgICAgICB0aGlzLnN0eWxlciA9IG5ldyBTdHlsZXIodGhpcy50cmFuc2Zvcm1hdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc3R5bGVyLmNoYW5nZVJvb3ROb2RlKHRoaXMubm9kZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5vbnRyYW5zZm9ybWF0aW9uLmVtaXQodGhpcy5zdHlsZXIudHJhbnNmb3JtKCkpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYWdlcykge1xyXG4gICAgaWYgKGNoYWdlcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgdGhpcy5zdHlsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfSBlbHNlIGlmIChjaGFnZXMubm9kZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19