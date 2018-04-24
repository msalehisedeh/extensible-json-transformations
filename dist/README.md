# Welcome to Extensible JSON transformations!

Have you ever wanted to consume a JSON in a program but the JSON was in a form not suitable for your program Have you wanted to use the JSON without writing code to do it? Have you wondered what it takes to make this happen? Well... wonder no more and add this component into your project... 

[Live Demo](https://extensible-json-transformations.stackblitz.io) | [Source code](https://github.com/msalehisedeh/extensible-json-transformations)

## Version 0.0.1

```
MODULE:
  XjsltModule

EXPORTS:
  XjsltComponent

```
## Definitions
```
XJSLT: Extensible JSON Styling Language Transformation
    The process in which a JSON is murphed into a different JSON to be consumed by a program.

JS: JSON Styling
    Style a JSON into a more presentable JSON for a given purpose.

JSL: JSON Styling Language
    Language that supports JSON Styling.

JST: JSON Styling Template
    Template to be used specificaly for the purpose of JSON Styling.
```

## Styling Methods
| Method     | Arguments             | Example | Description                                                |
|------------|-----------------------|---------|------------------------------------------------------------|
| valueOf    | `valueOf(a.b.c)`      | 1) path | evaluates value of argument path                           |
| enlist     | `enlist(valueOf(a),valueOf(b),valueOf(c))`  | 1) array | insert argument values into a list  |
| split      | `join(split(valueOf(friends.namebank_ids),',')`| 1) value, 2) deliniator | splits value into a list  |
| join       | `join(select(friends.name),',')`| 1) array, 2) deliniator | joins items of the list into a string  |
| concat     | `concat(valueOf(name),' ',valueOf(age))`| 1) argument values | joins arguments into a string  |
| each       | `each(select(friends.address),zipCode)`  | 1) array, 2) path | For each item in list, evaluate the path |
| select     | `select(friens.address)`  | 1) path | select the nodes with given path in current context |
| filter     | `filter(id,in,valueOf(selected_ids))`  | 1) path, 2) operation, 3) value to match | 
for value of target in current context, evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in. |
| style      | `style(template, select(friens.address))`  | 1) template, 2) array | apply the given template for the given array |
| match      | `match(template,user.id,in,spit(valueOf(id_list)))`  | 1) template name, 2) path to a target, 3) operation, 4) value to match | for value of target in given template nodes, evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. 'in' for list values mean contains and for string value means indexOf. '!' means not equal or not in. |
| apply     | `apply(trmplate,id,split(valueOf(user_ids),''))`  | 1) template name, 2) path, 3) value(s) | 
apply the template template in current context for each value that matches the given path. |
| offPool    | `offPool(template,valueOf(id))`      | 1) template name, 2) key | Will use the given template pool to pick up item(s) with given key(s) |

## Transformations structure
```javasctipt
export interface Transformations {
    name: string,
    importUrls?:string[],
    rootTemplate: string,
    onResult?: string,
    templates: Template[]
}

```
| Attribute    | Description                                                |
|--------------|------------------------------------------------------------|
| name         | Name chosen for the transformation                         |
| importUrls   | list of urls to import other transformations               |
| rootTemplate | The template name to start the transformation              |
| onResult     | A method to be invoked on completion of transformations. Could be a filter to exclued some results or any other method.    |
| templates    | Lis of templates                                           |

```javasctipt
export interface Template {
    name: string,
    match: string,
    value?: string,
    context: string,
    inPool?: string,
    style: any
}
```
| Attribute    | Description                                                |
|--------------|------------------------------------------------------------|
| name         | Name chosen for the template                               |
| match        | Path to start the styling                                  |
| value        | Value to evaluate the math. not needed if match is on root node or blank |
| context      | The root node                                              |
| inPool       | Pre-process all items with given path as a key in a pool. Example: 'id' or 'friends.id'   |


## So... How it can be done?

Run `npm install extensible-json-transformation` in your application. and do the following:

in your html:
```javascript
<xjslt 
	[node]="myDataSet"
  [transformations]="transformations"
	(ontransformation)="ontransformation($event)"></xjslt>

  where 
  transformations could be ={
    "name": "products",
    "importUrls": [],
    "rootTemplate": ".",
    "onResult": "",
    "templates": [{
      "name": ".",
      "match": "",
      "context": "root",
      "style": {
        "name": "valueOf(name)",
        "vendor": "valueOf(vendor.name)",
        "trackNames": "each(select(details),valueOf(name))"
      }
    }
    ]
  }
```


![alt text](https://raw.githubusercontent.com/msalehisedeh/extensible-json-transformations/master/sample.png  "What you would see when a XJSLT is used")
