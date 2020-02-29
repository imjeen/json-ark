import path from 'path';
import fs from 'fs';
import readline from 'readline';
import UtilDate from './utils/date.js';
import { __dirname } from './es.js';


class Ship {

    target = {
        name: '',
        size: '',
        path: ''
    }

    constructor(options = {}) {
        this.options = {
            origin: './origin/data.txt', // the source file
            dist: './dist', // the target directory
            formatter: 'yyyyMMdd_hhmmsss', // file name with the date format
            ...options
        };
        this.init();
    }

    async init() {

        const data = await this.readline(this.options.origin);
        this.keepLatest(5);
        this.createFileSync(data);

        // log
        console.table([
            { ...this.target }
        ]);

    }

    async readline(file) {
        const DATA_LIST = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(file),
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
                DATA_LIST.push({
                    subcat: list[0],
                    api: list[3],
                    name: list[2],
                    material: [],
                });
                // console.table(list)
            } else if (list.length === 9 || (list.length === 10 && list[3] === '-')) {
                (list.length === 10 && list[3] === '-') && list.shift();

                let last_item = DATA_LIST[DATA_LIST.length - 1];
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

        return DATA_LIST;

    }

    keepLatest(N) {

        const dist = this.options.dist;

        if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist);
            return false;
        }

        const list = fs.readdirSync(dist).sort((a, b) => a < b ? 1 : -1); // for newer to older

        // console.log('list', list);

        list.slice(N, list.length).forEach((name) => {
            fs.unlinkSync(path.join(dist, name));
        });

    }

    createFileSync(data) {
        const buffer_data = new Uint8Array(Buffer.from(JSON.stringify(data, null, 2)));
        const dist = this.options.dist,
            name = new UtilDate().format(this.options.formatter);
        fs.writeFileSync(path.join(dist, `data_${name}.json`), buffer_data, {
            encoding: 'utf8',
            cwd: __dirname,
            stdio: [process.stdin, process.stdout, process.stderr]
        });

        this.target.name = name;
        this.target.path = path.join(dist, `data_${name}.json`)

        const stats = fs.statSync(this.target.path);
        this.target.size = `${Math.round(stats.size / 1024)} kb`

    }

}

new Ship();

