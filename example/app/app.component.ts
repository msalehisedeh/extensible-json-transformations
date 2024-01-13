import { Component, ViewChild } from '@angular/core';

import { AppService } from './app.service';
import { Inquirer } from '@sedeh/extensible-json-transformations';
import { XjsltComponent } from '@sedeh/extensible-json-transformations';

interface DataSet {
  transformations: any,
  resultingTree: any,
  myDataSet: any
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [XjsltComponent, Inquirer],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('transformer', {static:false}) transformer!: XjsltComponent;

  title = 'Extensible JSON Transformations';
  keys: any = {
    valueOf: 'valueOf(a.b.c)',
    enlist: 'enlist(valueOf(a),valueOf(b),valueOf(c))',
    split: 'split(valueOf(friends.namebank_ids),\',\')',
    join: 'join(select(friends.name),\',\')',
    concat: 'concat(valueOf(name),\' \',valueOf(age))',
    each: 'each(select(friends.address),zipCode)',
    select: 'select(friends.address)',
    filter: 'filter(id,in,valueOf(selected_ids))',
    style: 'style(templateName, select(friends.address))',
    match: 'match(templateName,user.id,in,spit(valueOf(id_list)))',
    apply: 'apply(trmplateName,id,split(valueOf(user_ids),\'\'))',
    offPool: 'offPool(template,valueOf(id))'
  }
  descriptions: any = {
    valueOf: 'Traverse the given JPath and return its value',
    enlist: 'Insert argument values into a list',
    split: 'Split value into a list',
    join: 'Join items of the list into a string',
    concat: 'Join arguments into a string',
    each: 'For each item in array, evaluate the JPath',
    select: 'Select the nodes with given JPath in current context',
    filter: `For value of target in current context, evaluate operation for given value(s). Supported operations are '=,<,>,in,!'. For list values 'in' operation means "contains" and for string value it means "indexOf". Negating operation '!' means not equal or not in`,
    style: 'Apply the given template for the given array',
    match: `For value of target in given template nodes, evaluate and operation for given value(s) and return nodes that are matching the operation. Supported operations are '=,<,>,in,!''. For list values 'in' operation means "contains" and for string value it means "indexOf". Negating operation '!' means not equal or not in`,
    apply: 'Apply the template name in current context for each node that matches the given path',
    offPool: 'Use the given template pool to pick up item(s) with given key(s)'
  }
  samples: any = {
    valueOf: 'valueOf(address.street)',
    enlist: 'enlist(valueOf(name),valueOf(age),valueOf(address.zipcode))',
    split: `split(valueOf(address.street),' ')`,
    join: `join(split(valueOf(name), ' '), ' :: ')`,
    concat: `concat(valueOf(name),': ', valueOf(age))`,
    each: 'each(select(friends.address),name)',
    select: 'select(friends)',
    filter: 'filter(eyeColor,=,blue)',
    style: 'style(., select(friends.address))',
    match: 'match(.,age,<,40)',
    apply: 'apply(.,index, 0)',
    offPool: 'offPool(friends,valueOf(id))'
  }

  selectionEntry = [
    "users",
    "events",
    "products"
  ];
  selectedEntry = "users";
  selectionContents: any ={};
  transformations: any = {};
  error: any;
  queryResponse!: any;
  transformationsCopy!: any;

  queryString = "";

  displayEntry = false;
  sampleJson = "";
  transformingJson = "";
  pointsOfEntry!: any;
  pointOfEntry!: any;
  transformationError = undefined;
  data: DataSet = {
    transformations: {},
    resultingTree: {},
    myDataSet: []
  }

  constructor(private service: AppService) {
    this.service.usersList().subscribe( (results) => {
      this.data.myDataSet = results.data;
      this.data.transformations = results.transformations;
      this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
    })
  }

  private toJson(text: string, message: string){
    let json;
    try {
      json = JSON.parse(text);
    }catch(e: any){
      this.error = message + " :: " + e.message;
      json = undefined;
    }
    return json
  }

  selectionChanged(event: any) {
    this.pointOfEntry = event.target.value
  }
  addDataEntry(entryName: string, entryJson: any, transJson: any) {
    if (entryName.length && entryJson.length) {
      const entry = this.toJson(entryJson, "We are unable to validate JSON data. Please clear text and try again!");
      const trans = this.toJson(transJson, "We are unable to validate JSON transformations. Please clear text and try again!");
      if (entry && trans) {
        this.transformationError = undefined;
        this.data.resultingTree = [];
        this.selectionEntry.push(entryName);
        this.selectionContents[entryName] = {
          data: this.pointOfEntry ? entry[this.pointOfEntry] : entry,
          transformations: trans
        };
        this.queryResponse = undefined;
        this.queryString = "";
        this.displayEntry = false;
        this.selectedEntry = entryName;
        this.data.myDataSet = this.selectionContents[entryName].data;
        this.data.transformations = this.selectionContents[entryName].transformations;
        this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
        }
    } else {
      this.error = "Please enter JSON data and a name for it to be in the dropdown!";
    }
  }

  private findEntryLists(json: any, path: string, pathList: any) {
    if ( !(typeof json === "string") && (typeof json === "object") && !(json instanceof Array) ) {      
      Object.keys(json).map( (item) => {
        const x = path.length ? path+"."+item : item;
        if (json[item] instanceof Array) {
          pathList.push(x);
        } else {
          this.findEntryLists(json[item], x, pathList);
        }
      });
    }
    return pathList;
  }
  
  onDataPaste(e: any) {
    this.sampleJson = e.clipboardData.getData('text/plain');
    this.error = undefined;
    this.pointsOfEntry = undefined;
    this.pointOfEntry = undefined;
    const entry = this.toJson(this.sampleJson, "We are unable to validate JSON data. Please clear text and try again!");
    if ( !(entry instanceof Array) ) {
      this.pointsOfEntry = this.findEntryLists(entry, "", []);
    } else if (entry.length < 2) {
      this.error = "Dropped in data do not have enough records in order to gain insight. Please reconsider using it."
    }
  }

  onTransformPaste(e: any) {
    this.transformingJson = e.clipboardData.getData('text/plain');
    this.error = undefined;
    const trans = this.toJson(this.transformingJson, "We are unable to validate JSON transformations. Please clear text and try again!");
  }

  detectMethodCall(code: number, source: any, value?: string) {
    if (code === 13) {
      source.setAttribute('style', 'cursor: wait');
      this.queryString = value ? value : source.value;
      this.queryResponse = undefined;

      setTimeout(() => {
        try {
          const inquirer = new Inquirer();
          inquirer.initTemplates(this.transformer.transformations.templates);
          inquirer.setRootNode(this.transformer.node);
          this.queryResponse = inquirer.query(this.queryString, this.data.myDataSet);
          source.setAttribute('style', '');
        }catch(e: any) {
          this.queryResponse = e.message ? e.message : e;
          source.setAttribute('style', '');
        }
      }, 0);
    }
  }

  ontransformation(event: any) {
	this.data.resultingTree = event;
  }
  onError(event: any) {
    setTimeout( ()=> {this.transformationError = event}, 666);
  }

  transformationDataSet(event: any) {
    this.selectedEntry = event.target.value;

    this.queryResponse = undefined;
    this.queryString = "";
    this.data.myDataSet = undefined;
    this.data.transformations = undefined;
    this.transformationError = undefined;
    this.data.resultingTree = [];
    
    if (this.selectedEntry === "users") {
      this.service.usersList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
        this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
      })
    } else if (this.selectedEntry === "events") {
      this.service.eventsList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
        this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
      })
    } else if (this.selectedEntry === "products") {
      this.service.productsList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
        this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
      })
    } else {
      this.data.myDataSet = this.selectionContents[this.selectedEntry].data;
      this.data.transformations = this.selectionContents[this.selectedEntry].transformations;
      this.transformationsCopy = JSON.parse(JSON.stringify(this.data.transformations))
    }
  }
  hinder(source: any, input: any, key: string) {
    // input.placeholder = this.keys[key];
    if (input.value !== this.samples[key]) {
      input.value = '';
      this.detectMethodCall(13, source, this.samples[key]);
    }
  }
  actionDescription(key: string) {
    return `${this.descriptions[key]}::
    
    ${this.keys[key]}`;
  }
}
