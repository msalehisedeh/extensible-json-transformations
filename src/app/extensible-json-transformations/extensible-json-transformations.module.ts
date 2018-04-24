import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XjsltComponent } from './components/extensible-json-transformations';


@NgModule({
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
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class XjsltModule {}
