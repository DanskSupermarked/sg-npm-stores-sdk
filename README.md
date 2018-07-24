# Salling Group Stores SDK
This SDK simplifies the process of querying Salling Group's stores.
Salling Group owns Netto, Føtex, Bilka, Salling, and more.
Through this SDK you will be able to find the name, opening hours, address, and more of stores.
The requests are made through the Salling Group API which can be found [here](https://developer.sallinggroup.com/).

You will need the module `sg-base-sdk` in order to authenticate.
You can get your credentials through the [developer portal](https://developer.sallinggroup.com/).

## Getting Started.
The following example gets names of all Netto stores in the ZIP code 8200.
You will need to get a JWT secret or Bearer token with access to the Stores API from the [developer portal](https://developer.sallinggroup.com/). 
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const StoresSDK = require('sg-stores-sdk');
const instance = new StoresSDK(SallingGroupAPI.bearer('my_token'));

const traverser = instance.beginQuery()
    .ofBrand('netto')
    .inZIP(8200)
    .pick('name')
    .execute();

traverser.get().then((page) => console.log(page));
``` 
This prints:
```json
[
  { "name": "Netto Storcenter Nord" },
  { "name": "Netto Randersvej Århus" }
]
```

## Documentation
### `constructor(api)`
This initializes a new Stores SDK object.
`api` must be an instance returned by `sg-base-sdk`.

Example:
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const StoresSDK = require('sg-stores-sdk');
const instance = new StoresSDK(SallingGroupAPI.jwt('my_email', 'my_key'));
```

### `get(storeID)`
This gets the store with the given ID.

Example:
```js
const storeData = await instance.get('b20359e6-194d-4a33-8dcb-05b01afa93c4');
```

### `getAll()`
This  gets all stores.

Example:
```js
const traverser = instance.getAll();
const page = await traverser.get();
```

### `beginQuery()`
This begins a query for stores.
This should be followed by a chain of these commands:

|Method|Description|Example|
|------|-----------|-------|
|`pick(field1, field2, ...)`|Only returns the given fields.|`.pick('id', 'name')`|
|`ofBrand(brand)`|Returns stores from the given brand.|`.ofBrand('netto')`|
|`inCity(city)`|Returns stores in the given city.|`.inCity('Risskov')`|
|`inZIP(zip)`|Returns stores in the given ZIP.|`.inZIP(8200)`|
|`nearCoordinate(long, lat, radius)`|Returns stores in the given radius (in kilometers) around the coordinates.|`.nearCoordinate(56.18,10.20,0.5)`|

The chain should be ended with `.execute()`.
This will return a `Traverser` for the query.

Example:
```js
const traverser = instance.beginQuery()
    .ofBrand('netto')
    .inZIP(8200)
    .pick('name', 'id')
    .execute();
// This will return name and ID of Netto stores in the ZIP code 8200.
const page = await traverser.get();
```
### `query(params = {})`
This queries the Stores API directly and returns a `Traverser`. 
`params` is the search parameters.
This is mostly used internally.
