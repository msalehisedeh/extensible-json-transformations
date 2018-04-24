import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { XjsltModule } from './extensible-json-transformations/extensible-json-transformations.module';

import { AppComponent } from './app.component';
import { AppService } from './app.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    XjsltModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
