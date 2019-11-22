# Salling Group Stores SDK
This SDK simplifies the process of querying Salling Group's stores.
Salling Group owns Netto, Føtex, Bilka, Salling, and more.
Through this SDK you will be able to find the name, opening hours, address, and more of stores.
The requests are made through the Salling Group API which can be found [here](https://developer.sallinggroup.com/).

This SDK uses the [Traverser library](https://www.npmjs.com/package/@salling-group/pagination-traverser).

You can get your credentials through the [developer portal](https://developer.sallinggroup.com/).

## Getting Started.
The following example gets names of all Netto stores in the ZIP code 8200.
You will need to get a JWT secret or Bearer token with access to the Stores API from the [developer portal](https://developer.sallinggroup.com/).
```js
const Stores = require('@salling-group/stores');
const instance = new Stores({
  'auth': {
    'token': 'my_token',
    'type': 'bearer',
  },
});

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
### `constructor(options)`
This initializes a new Stores SDK object.
`options` must be an object containing an `auth` object with the following contract:

|Property|Value|Required|Description|
|--------|-----|--------|-----------|
|`type`|`'jwt'` or `'bearer'`|Yes|The authentication type. This is either a JWT or a Bearer Token.|
|`token`|`String`|If `type` is `'bearer'`.|The token associared with the bearer token credentials.|
|`issuer`|`String`|If `type` is `'jwt'`.|The issuer associated with the JWT credentials.|
|`secret`|`String`|If `type` is `'jwt'`.|The secret associated with the JWT credentials.|

`applicationName` should be set in the `options` object, but this is optional.
(This value will be sent in the UserAgent during requests.)

Example:
```js
const Stores = require('@salling-group/stores');
const instance = new Stores({
  'auth': {
    'issuer': 'my_issuer',
    'secret': 'my_secret',
    'type': 'jwt',
  },
});
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
This will return a `Traverser` for the query. (See [this](https://www.npmjs.com/package/@salling-group/pagination-traverser) for more information about `Traverser`.)

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
This queries the Stores API directly and returns a [Traverser](https://www.npmjs.com/package/@salling-group/pagination-traverser).
`params` is the search parameters.
This is mostly used internally.
