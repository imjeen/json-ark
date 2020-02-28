
# JSON ARK

execute command: `node index`


`docker run --rm -it  -w /root/src -v $PWD:/root/src  node:12.13.1-alpine sh`

## ES Modules

[ECMAScript Modules](https://nodejs.org/api/esm.html)

```jsonc
// package.json
{
  "type": "module"
}
```

Tips: ES modules do not include __dirname, __filename and so on, it is different from commonjs.


## Data Pattern

```js
[
    {
        "subcat": 1012,
        "api": "/v1/AI",
        "material": [
            {
                "id": 1,
                "cartoonType": 3,
                "type": 1,
                "filterType": 3000,
                "backgroundType": -1,
                "makeupType": 12,
                "use3X": 0
            },
            // ...
        ]
    },
    // ...
]
```
