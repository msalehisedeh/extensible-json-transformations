
# Welcome to Extensible JSON transformations!
Have you ever wanted to perform query on a JSON?  Have you ever wanted to consume it in a program but the JSON was in a form not suitable for your program? Have you wanted to use the JSON without writing any code to do it? Have you wondered what it takes to make this happen? Well... wonder no more and add this component into your project...

**NOTE:** Starting with version 1.1.0 this library is compatible with Angular 6+.

**NOTE:** Starting with version 1.3.0 you need to import this library through @sedeh/extensible-json-transformations.

[Live Demo](https://stackblitz.com/edit/extensible-json-transformations?file=app%2Fapp.component.ts) | [Comments/Requests](https://github.com/msalehisedeh/extensible-json-transformations/issues)

```
MODULE:
	XjsltModule
	
EXPORTS:
	XjsltComponent
	Transformations
	Template
	Styler
	JsonAsDataSource
	Inquirer
```

## Definitions

```
XJSLT: Extensible JSON Styling Language Transformation
	The process in which a JSON is morphed into a different JSON to be consumed by a program.

JS: JSON Styling
	Style a JSON into a more presentable JSON for a given purpose.

JSL: JSON Styling Language
	Language that supports JSON Styling.

JST: JSON Styling Template
	Template to be used specifically for the purpose of JSON Styling.
```

## Transformations 

### Styling Methods

| Method     | Example                                                 | Arguments | Description |
|------------|---------------------------------------------------------|-----------|------------------------------------------------------------|
| valueOf    | `valueOf(a.b.c)`                                        | 1) JPath  | Traverse the given JPath and return its value. |
| enlist     | `enlist(valueOf(a),valueOf(b),valueOf(c))`              | 1) Array  | Insert argument values into a list |
| split      | `split(valueOf(friends.namebank_ids),',')`              | 1) Value, 2) Delimiter | Split value into a list |
| join       | `join(select(friends.name),',')`                        | 1) array, 2) Delimiter | Join items of the list into a string |
| concat     | `concat(valueOf(name),' ',valueOf(age))`                | 1) Argument values | Join arguments into a string |
| each       | `each(select(friends.address),zipCode)`                 | 1) Array, 2) JPath | For each item in array, evaluate the JPath |
| select     | `select(friends.address)`                               | 1) JPath | Select the nodes with given JPath in current context |
| filter     | `filter(id,in,valueOf(selected_ids))`                   | 1) JPath, 2) Operation, 3) Value to match | For value of target in current context, evaluate operation for given value(s). Supported operations are `=,<,>,in,!`. For list values 'in' operation means "contains" and for string value it means "indexOf". Negating operation '!' means not equal or not in. |
| style      | `style(templateName, select(friends.address))`          | 1) Template name, 2) Array | Apply the given template for the given array |
| match      | `match(templateName,user.id,in,spit(valueOf(id_list)))` | 1) Template name, 2) JPath to a target, 3) Operation, 4) Value to match | For value of target in given template nodes, evaluate and operation for given value(s) and return nodes that are matching the operation. Supported operations are `=,<,>,in,!`. For list values 'in' operation means "contains" and for string value it means "indexOf". Negating operation '!' means not equal or not in. |
| apply      | `apply(trmplateName,id,split(valueOf(user_ids),''))`    | 1) Template name, 2) JPath, 3) Value(s) | Apply the template name in current context for each node that matches the given path. |
| offPool    | `offPool(template,valueOf(id))`                         | 1) Template name, 2) Key | Use the given template pool to pick up item(s) with given key(s) |

### structures

```javasctipt
export interface Transformations {
	name: string,
	importUrls?:string[],
	rootTemplate: string,
	onResult?: string,
	templates: Template[]
}
```

| Attribute    | Description                                                                              |
|--------------|------------------------------------------------------------------------------------------|
| name         | Name chosen for the transformation                                                       |
| importUrls   | List of urls to import other transformations                                             |
| rootTemplate | The template name to start the transformation                                            |
| onResult     | A method to be invoked on completion of transformations. Could be a filter to exclude some results or any other method. |
| templates    | List of templates                                                                        |

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

| Attribute | Description |
|-----------|---------------------------------------------------------------------------------------------|
| name      | Name chosen for the template                                                                |
| match     | Path to start the styling                                                                   |
| value     | Value to evaluate the math. not needed if match is on root node or blank                    |
| context   | The node to be used. "root" means the root node. "current" means the node currently in play.|
| inPool    | Pre-process all items with given JPath as a key in a pool. Example: 'id' or 'friends.id'    |
  

NOTE: if you get "RangeError: Maximum call stack size exceeded" message, it means an infinite loop is created because of circular referencing in multiple templates.


## So... How it can be done?

Run `npm install extensible-json-transformation` in your application. and do the following:

If you want to use the transformation component, do the following in your html:
```javascript
<xjslt
	[node]="myDataSet"
	[transformations]="transformations"
	(onerror)="takeErrorMessageFrom($event)"
	(ontransformation)="ontransformation($event)"></xjslt>

where

transformations  could  be ={
	"name": "products",
	"importUrls": [],
	"rootTemplate": ".",
	"onResult": "",
	"templates": [{
		"name":  ".",
		"match":  "",
		"context":  "root",
		"style": {
		"name":  "valueOf(name)",
		"vendor":  "valueOf(vendor.name)",
		"trackNames":  "each(select(details),name)"
		}
	}]
}
```

If you want to directly use the transformation object, do the following in your code:
```javascript
	const styler = new Styler(theJsonForTransfromation);

	styler.changeRootNode(theJsonRootNode);
	styler.transform();
```

If you want to directly query a JSON object using transformation methods, do the following in your code:
```javascript
	const inquirer = new Inquirer();
	const queryResponse = inquirer.query("set of nested function calls", theJsonRootNode);
	
	where nested function calls could be `enlist(valueOf(a),valueOf(b),valueOf(c))`
```

## Version History

| Version | Description                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| 3.0.0   | Ubdated to angular 15                                                                                    |
| 2.0.0   | Updated to Angular 8.                                                                                    |
| 1.3.1   | Updated dependencies.                                                                                    |
| 1.3.0   | Re-organizing libraries I am providing. Added scope to the project. From now on Accessing through @sedeh/extensible-json-transformations  |
| 1.2.0   | It was brought to my attention that some users have trouble using my components in their angular 6 environment. Since I had only updated few dependencies when moved to Angular 6, I am thinking dependencies are causing issues. So, for this release, I am updating all dependencies to what Angular 6 applications are expecting to have. Please let me know if this is fixing or not fixing any issues you are facing. |
| 1.1.0   | Updated libraries to become compatible with Angular 6+.                                                  |
| 1.0.0   | Compiled with AOT option and resolved issues.                                                            |
| 0.1.1   | fixed few logic errors to handle complex JSON structures.                                                |
| 0.1.0   | Added ability to query a JSON directly. fixed few logic errors.                                          |
| 0.0.1   | Initial release.                                                                                         |



![alt text](https://raw.githubusercontent.com/msalehisedeh/extensible-json-transformations/master/sample.png  "What you would see when a XJSLT is used")
