import * as tslib_1 from "tslib";
/*
 * tool to display result of a search on set of points of interests on objects.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Styler } from './transformations';
var XjsltComponent = /** @class */ (function () {
    function XjsltComponent() {
        this.node = {};
        this.ontransformation = new EventEmitter();
        this.onerror = new EventEmitter();
    }
    XjsltComponent.prototype.ngOnInit = function () {
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
    };
    XjsltComponent.prototype.ngOnChanges = function (chages) {
        if (chages.transformations) {
            this.styler = undefined;
            setTimeout(this.ngOnInit.bind(this), 333);
        }
        else if (chages.node) {
            setTimeout(this.ngOnInit.bind(this), 333);
        }
    };
    tslib_1.__decorate([
        Input("node")
    ], XjsltComponent.prototype, "node", void 0);
    tslib_1.__decorate([
        Input("transformations")
    ], XjsltComponent.prototype, "transformations", void 0);
    tslib_1.__decorate([
        Output("ontransformation")
    ], XjsltComponent.prototype, "ontransformation", void 0);
    tslib_1.__decorate([
        Output("onerror")
    ], XjsltComponent.prototype, "onerror", void 0);
    XjsltComponent = tslib_1.__decorate([
        Component({
            selector: 'xjslt',
            template: ""
        })
    ], XjsltComponent);
    return XjsltComponent;
}());
export { XjsltComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zLyIsInNvdXJjZXMiOlsic3JjL2FwcC9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7QUFDSCxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxNQUFNLEVBQW1CLE1BQU0sbUJBQW1CLENBQUM7QUFPNUQ7SUFMQTtRQVVFLFNBQUksR0FBRyxFQUFFLENBQUM7UUFNVixxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3RDLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBd0IvQixDQUFDO0lBdEJDLGlDQUFRLEdBQVI7UUFDRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNyQyxJQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNoRDtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJO2dCQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ3JEO1lBQUMsT0FBTSxDQUFDLEVBQUU7Z0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQztJQUNELG9DQUFXLEdBQVgsVUFBWSxNQUFNO1FBQ2hCLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQWhDRDtRQURDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0RBQ0o7SUFHVjtRQURDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzsyREFDUTtJQUdqQztRQURDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQzs0REFDVztJQUd0QztRQURDLE1BQU0sQ0FBQyxTQUFTLENBQUM7bURBQ1c7SUFkbEIsY0FBYztRQUwxQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsT0FBTztZQUNqQixRQUFRLEVBQUUsRUFBRTtTQUViLENBQUM7T0FDVyxjQUFjLENBc0MxQjtJQUFELHFCQUFDO0NBQUEsQUF0Q0QsSUFzQ0M7U0F0Q1ksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIHRvb2wgdG8gZGlzcGxheSByZXN1bHQgb2YgYSBzZWFyY2ggb24gc2V0IG9mIHBvaW50cyBvZiBpbnRlcmVzdHMgb24gb2JqZWN0cy5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdHlsZXIsIFRyYW5zZm9ybWF0aW9ucyB9IGZyb20gJy4vdHJhbnNmb3JtYXRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAneGpzbHQnLFxyXG4gIHRlbXBsYXRlOiBgYCxcclxuICBzdHlsZXM6IFtdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWGpzbHRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyAge1xyXG4gIFxyXG4gIHByaXZhdGUgc3R5bGVyO1xyXG5cclxuICBASW5wdXQoXCJub2RlXCIpXHJcbiAgbm9kZSA9IHt9O1xyXG5cclxuICBASW5wdXQoXCJ0cmFuc2Zvcm1hdGlvbnNcIilcclxuICB0cmFuc2Zvcm1hdGlvbnM6IFRyYW5zZm9ybWF0aW9ucztcclxuXHJcbiAgQE91dHB1dChcIm9udHJhbnNmb3JtYXRpb25cIilcclxuICBvbnRyYW5zZm9ybWF0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMubm9kZSAmJiB0aGlzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICBpZighdGhpcy5zdHlsZXIpIHtcclxuICAgICAgICB0aGlzLnN0eWxlciA9IG5ldyBTdHlsZXIodGhpcy50cmFuc2Zvcm1hdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc3R5bGVyLmNoYW5nZVJvb3ROb2RlKHRoaXMubm9kZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5vbnRyYW5zZm9ybWF0aW9uLmVtaXQodGhpcy5zdHlsZXIudHJhbnNmb3JtKCkpO1xyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYWdlcykge1xyXG4gICAgaWYgKGNoYWdlcy50cmFuc2Zvcm1hdGlvbnMpIHtcclxuICAgICAgdGhpcy5zdHlsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfSBlbHNlIGlmIChjaGFnZXMubm9kZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KHRoaXMubmdPbkluaXQuYmluZCh0aGlzKSwgMzMzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19