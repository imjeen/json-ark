const readline = require('readline');
const path = require('path');
const fs = require('fs');
const utils = require('./utils/date');

const CONFIG = {
    origin_file: './origin/data.txt',
    target_dir: './dist'
};

const RESULT_DATA = [];

(async _ => {
    console.log('\nstart...');

    // ---------------------------------
    // read

    const rl = readline.createInterface({
        input: fs.createReadStream(CONFIG.origin_file),
        // crlfDelay: Infinity,
    });

    let index = 0;
    // nodejs version must be greater than or equal to 11
    for await (const item of rl) {
        ++index;

        // 删除回车/换行/制表符~
        const line = item.replace(/^(\n|\r|\t)|(\n|\r|\t)$/g, "").trim();

        // 为空 或 第一行
        if (line === '' || index === 1) continue;

        const list = line.split(/\t|\s/).filter(v => v.trim() !== '');

        // console.log('\n 👇length: %s,第%s行=>: %s\n', list.length, index, line);

        if (list.length === 10 && list[3] !== '-') {
            RESULT_DATA.push({
                subcat: list[0],
                api: list[3],
                name: list[2],
                material: [],
            });
            // console.table(list)
        } else if (list.length === 9 || (list.length === 10 && list[3] === '-')) {
            (list.length === 10 && list[3] === '-') && list.shift();

            let last_item = RESULT_DATA[RESULT_DATA.length - 1];
            // console.log('last_item', last_item);
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

    }


    // ---------------------------------
    // write

    // 清除旧文件：读取目录


    const target_dir = CONFIG.target_dir;

    if (!fs.existsSync(target_dir)) {
        fs.mkdirSync(target_dir);
    } else {
        let target_list = fs.readdirSync(target_dir).sort((a, b) => a < b); // 创建从早到晚的数值

        // console.log(target_list);

        const file_count = 5;

        target_list
            .filter((v, i) => (i + 1) < (target_list.length - file_count))
            .forEach(name => fs.unlinkSync(path.join(target_dir, name)))
    }


    const data = new Uint8Array(Buffer.from(JSON.stringify(RESULT_DATA, null, 2)));

    const name = new utils.UtilDate().format('yyyyMMdd_hhmmsss');

    fs.writeFileSync(path.join(target_dir, `data_${name}.json`), data, {
        encoding: 'utf8',
        cwd: __dirname,
        stdio: [process.stdin, process.stdout, process.stderr]
    });

    const target_path = path.join(target_dir, `data_${name}.json`)

    const stats = fs.statSync(target_path);
    const size = `${Math.round(stats.size / 1024)} kb`

    console.table([
        { size, path: target_path }
    ]);


})();

