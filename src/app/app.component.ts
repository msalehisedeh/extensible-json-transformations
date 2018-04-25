import { Component } from '@angular/core';

import { AppService } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Extensible JSON Transformations';

  selectionEntry = [
    "users",
    "events",
    "products"
  ];
  selectedEntry = "users";
  selectionContents ={};
  transformations = {};
  error = undefined;

  displayEntry = false;
  sampleJson = "";
  transformingJson = "";
  pointsOfEntry = undefined;
  pointOfEntry = undefined;
  data = {
    transformations: {},
    resultingTree: {},
    myDataSet: []
  }

  constructor(private service: AppService) {
    this.service.usersList().subscribe( (results) => {
      this.data.myDataSet = results.data;
      this.data.transformations = results.transformations;
  })
  }

  private toJson(text, message){
    let json;
    try {
      json = JSON.parse(text);
    }catch(e){
      this.error = message + " :: " + e.message;
      json = undefined;
    }
    return json
  }
  transformationsCopy() {
    return JSON.parse(JSON.stringify(this.data.transformations));
  }
  addDataEntry(entryName , entryJson, transJson) {
    if (entryName.length && entryJson.length) {
      const entry = this.toJson(entryJson, "We are unable to validate JSON data. Please clear text and try again!");
      const trans = this.toJson(transJson, "We are unable to validate JSON transformations. Please clear text and try again!");
      if (entry && trans) {
        this.selectionEntry.push(entryName);
        this.selectionContents[entryName] = {
          data: entry,
          transformations: trans
        };
        this.displayEntry = false;
        this.selectedEntry = entryName;
        this.data.myDataSet = this.selectionContents[entryName].data;
        this.data.transformations = this.selectionContents[entryName].transformations;
        }
    } else {
      this.error = "Please enter JSON data and a name for it to be in the dropdown!";
    }
  }

  private findEntryLists(json, path, pathList) {
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

  ontransformation(event) {
	this.data.resultingTree = event;
  }

  transformationDataSet(event) {
    this.selectedEntry = event.target.value;

    this.data.myDataSet = undefined;
    this.data.resultingTree = [];
    
    if (this.selectedEntry === "users") {
      this.service.usersList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
      })
    } else if (this.selectedEntry === "events") {
      this.service.eventsList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
      })
    } else if (this.selectedEntry === "products") {
      this.service.productsList().subscribe( (results) => {
        this.data.myDataSet = results.data;
        this.data.transformations = results.transformations;
      })
    } else {
      this.data.myDataSet = this.selectionContents[this.selectedEntry].data;
      this.data.transformations = this.selectionContents[this.selectedEntry].transformations;
  }
  }

}
