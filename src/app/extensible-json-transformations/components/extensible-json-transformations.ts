/*
 * tool to display result of a search on set of points of interests on objects.
 */
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Styler, Transformations } from './transformations';

@Component({
  selector: 'xjslt',
  template: ``,
  styles: [],
})
export class XjsltComponent implements OnInit, OnChanges  {
  
  private styler;

  @Input("node")
  node = {};

  @Input("transformations")
  transformations: Transformations;

  @Output("ontransformation")
  ontransformation = new EventEmitter();

  ngOnInit() {
    if (this.node && this.transformations) {
      if(!this.styler) {
        this.styler = new Styler(this.transformations);
      }
      this.styler.changeRootNode(this.node);
      this.ontransformation.emit(this.styler.transform());
    }
  }
  ngOnChanges(chages) {
    if (chages.transformations) {
      this.styler = undefined;
      setTimeout(this.ngOnInit.bind(this), 333);
    } else if (chages.node) {
      setTimeout(this.ngOnInit.bind(this), 333);
    }
  }
}
