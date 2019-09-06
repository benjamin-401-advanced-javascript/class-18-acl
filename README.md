# LAB - 18

## ACL

### Author: Benjamin Clark

### Links and Resources
* [submission PR](https://github.com/benjamin-401-advanced-javascript/class-05/pull/2)
* [travis](https://www.travis-ci.com/benjamin-401-advanced-javascript/class-05)
* [front-end](https://cf-401-class-05.herokuapp.com/)

#### Documentation
* [api docs](http://xyz.com) (API servers)
* [jsdoc](http://xyz.com) (Server assignments)
* [styleguide](http://xyz.com) (React assignments)

### Modules
#### `modulename.js`
##### Exported Values and Methods

###### `get(_id) -> object`
Gets a stored object with mactching id or returns all object if no id

###### `create(record) -> object`
Creates an object in the database

###### `update(_id, record) -> object`
updates an object in the database

###### `delete(_id)-> object`
deletes an object in the database

### Setup
#### `.env` requirements
* `PORT` - Port Number
* `MONGODB_URI` - 'mongodb://localhost:27017/class05'

#### Running the app
* `npm start`
* Endpoint: `/`
  * Creates a category then console logs it.

  
#### Tests
* "start": runs app
* "lint": eslint tests
* "test": unit tests
* "startDB": starts mongo db in local .db folder

#### UML
![UML Diagram TEST](bitmoji.png)
