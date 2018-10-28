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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvIiwic291cmNlcyI6WyJzcmMvYXBwL2V4dGVuc2libGUtanNvbi10cmFuc2Zvcm1hdGlvbnMvY29tcG9uZW50cy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFHQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxNQUFNLEVBQW1CLE1BQU0sbUJBQW1CLENBQUM7QUFPNUQsTUFBTTs7b0JBS0csRUFBRTtnQ0FNVSxJQUFJLFlBQVksRUFBRTt1QkFHM0IsSUFBSSxZQUFZLEVBQUU7Ozs7O0lBRTVCLFFBQVE7UUFDTixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQztnQkFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNyRDtZQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEI7U0FDRjtLQUNGOzs7OztJQUNELFdBQVcsQ0FBQyxNQUFNO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUMzQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDM0M7S0FDRjs7O1lBMUNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFLEVBQUU7YUFFYjs7O21CQUtFLEtBQUssU0FBQyxNQUFNOzhCQUdaLEtBQUssU0FBQyxpQkFBaUI7K0JBR3ZCLE1BQU0sU0FBQyxrQkFBa0I7c0JBR3pCLE1BQU0sU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogdG9vbCB0byBkaXNwbGF5IHJlc3VsdCBvZiBhIHNlYXJjaCBvbiBzZXQgb2YgcG9pbnRzIG9mIGludGVyZXN0cyBvbiBvYmplY3RzLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN0eWxlciwgVHJhbnNmb3JtYXRpb25zIH0gZnJvbSAnLi90cmFuc2Zvcm1hdGlvbnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd4anNsdCcsXHJcbiAgdGVtcGxhdGU6IGBgLFxyXG4gIHN0eWxlczogW10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBYanNsdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzICB7XHJcbiAgXHJcbiAgcHJpdmF0ZSBzdHlsZXI7XHJcblxyXG4gIEBJbnB1dChcIm5vZGVcIilcclxuICBub2RlID0ge307XHJcblxyXG4gIEBJbnB1dChcInRyYW5zZm9ybWF0aW9uc1wiKVxyXG4gIHRyYW5zZm9ybWF0aW9uczogVHJhbnNmb3JtYXRpb25zO1xyXG5cclxuICBAT3V0cHV0KFwib250cmFuc2Zvcm1hdGlvblwiKVxyXG4gIG9udHJhbnNmb3JtYXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmVycm9yXCIpXHJcbiAgb25lcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5ub2RlICYmIHRoaXMudHJhbnNmb3JtYXRpb25zKSB7XHJcbiAgICAgIGlmKCF0aGlzLnN0eWxlcikge1xyXG4gICAgICAgIHRoaXMuc3R5bGVyID0gbmV3IFN0eWxlcih0aGlzLnRyYW5zZm9ybWF0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zdHlsZXIuY2hhbmdlUm9vdE5vZGUodGhpcy5ub2RlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLm9udHJhbnNmb3JtYXRpb24uZW1pdCh0aGlzLnN0eWxlci50cmFuc2Zvcm0oKSk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgdGhpcy5vbmVycm9yLmVtaXQoZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgbmdPbkNoYW5nZXMoY2hhZ2VzKSB7XHJcbiAgICBpZiAoY2hhZ2VzLnRyYW5zZm9ybWF0aW9ucykge1xyXG4gICAgICB0aGlzLnN0eWxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgc2V0VGltZW91dCh0aGlzLm5nT25Jbml0LmJpbmQodGhpcyksIDMzMyk7XHJcbiAgICB9IGVsc2UgaWYgKGNoYWdlcy5ub2RlKSB7XHJcbiAgICAgIHNldFRpbWVvdXQodGhpcy5uZ09uSW5pdC5iaW5kKHRoaXMpLCAzMzMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=