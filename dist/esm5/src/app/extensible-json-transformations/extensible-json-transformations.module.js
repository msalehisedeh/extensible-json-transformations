import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XjsltComponent } from './components/extensible-json-transformations';
var XjsltModule = /** @class */ (function () {
    function XjsltModule() {
    }
    XjsltModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule
            ],
            declarations: [
                XjsltComponent,
            ],
            exports: [
                XjsltComponent,
            ],
            entryComponents: [
                XjsltComponent
            ],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
    ], XjsltModule);
    return XjsltModule;
}());
export { XjsltModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucy9leHRlbnNpYmxlLWpzb24tdHJhbnNmb3JtYXRpb25zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBcUI5RTtJQUFBO0lBQTBCLENBQUM7SUFBZCxXQUFXO1FBbEJ2QixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsWUFBWTthQUNiO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLGNBQWM7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDUCxjQUFjO2FBQ2Y7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsY0FBYzthQUNmO1lBQ0QsU0FBUyxFQUFFLEVBQ1Y7WUFDRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNsQyxDQUFDO09BRVcsV0FBVyxDQUFHO0lBQUQsa0JBQUM7Q0FBQSxBQUEzQixJQUEyQjtTQUFkLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgWGpzbHRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZXh0ZW5zaWJsZS1qc29uLXRyYW5zZm9ybWF0aW9ucyc7XHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgWGpzbHRDb21wb25lbnQsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBYanNsdENvbXBvbmVudCxcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgWGpzbHRDb21wb25lbnRcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gIF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgWGpzbHRNb2R1bGUge31cclxuIl19