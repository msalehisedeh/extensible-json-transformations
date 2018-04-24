import { OnInit, OnChanges, EventEmitter } from '@angular/core';
import { Transformations } from './transformations';
export declare class XjsltComponent implements OnInit, OnChanges {
    private styler;
    node: {};
    transformations: Transformations;
    ontransformation: EventEmitter<{}>;
    ngOnInit(): void;
    ngOnChanges(chages: any): void;
}
