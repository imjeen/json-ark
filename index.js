const readline = require('readline');
const path = require('path');
const fs = require('fs');

const CONFIG = {
    origin_file: './origin/data.txt',
    target_dir: './dist'
};

const RESULT_DATA = [
    /*{
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
        ]
    }*/
];

new Promise((resolve, reject)=>{
    
    // ---------------------------------
    // read

    const rl = readline.createInterface({
        input: fs.createReadStream(CONFIG.origin_file)
    });

    let index = 0;
    rl.on('line', (line) => {
        ++index;
        // 删除回车/换行/制表符~
        line = line.replace(/\n|\r|\t/g, "").trim();
        // 为空
        if(!line) return;

        const list = line.split(' ').filter(v=> v.trim() !== '');

        if(index === 1) return;

        console.log('\n 👇length: %s,第%s行=>: %s\n', list.length, index, line);

        if(list.length === 10){
            RESULT_DATA.push({
                subcat:list[0],
                api: list[3],
                name: list[2],
                material: [],
            });
            // console.table(list)
        }else{
           let last_item = RESULT_DATA[RESULT_DATA.length - 1];
           console.log('last_item', last_item);
           last_item && last_item.material.push({
                "id": list[0],
                "cartoonType": list[3],
                "type": list[4],
                "filterType": list[5],
                "backgroundType": list[6],
                "makeupType": list[7],
                "use3X": list[8],
           });
            
        }

        

    });

    rl.on('close', () => {
      console.log('Readline close.');
      // console.table(RESULT_DATA)
      // console.log('\ result data => ', JSON.stringify(RESULT_DATA, null, 2));
      resolve();
    });

}).then(_=>{

    // ---------------------------------
    // write
     const target_dir = CONFIG.target_dir;

    !fs.existsSync(target_dir) && fs.mkdirSync(target_dir);

    const data = new Uint8Array(Buffer.from(JSON.stringify(RESULT_DATA, null, 2)));

    const date = new Date(),
           name = `${
                (date.getFullYear()).toString() 
            }_${ 
                (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') 
            }_${
                date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0')  
            }`;

    fs.writeFileSync(path.join(target_dir, `data_${ name }.json`), data, {
        encoding: 'utf8',
        cwd: __dirname,
        stdio: [process.stdin, process.stdout, process.stderr]
    });

    console.log('outputed');


});

