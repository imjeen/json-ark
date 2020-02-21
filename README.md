
# JSON ARK

execute command: `node index`


`docker run --rm -it  -w /root/src -v $PWD:/root/src  node:12.13.1-alpine sh`


## 数据模型

```js
[
    {
        "subcat": 1012,
        "api": "/v1/AICartoonStyle3",
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
