class UtilDate extends Date {
    format(formatter) {
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") => 2020-02-21 16:12:59.155
        const config = {
            'M+': this.getMonth() + 1, // 月份: 1到2位
            'd+': this.getDate(), // 日: 1到2位
            'h+': this.getHours(), // 小时: 1到2位
            'm+': this.getMinutes(), // 分: 1到2位
            's+': this.getSeconds(), // 秒: 1到2位
            'q+': Math.floor((this.getMonth() + 3) / 3), // 季度: 1位
            S: this.getMilliseconds(), // 毫秒: 1到3位 （只能用一个字符S表示）
        };
        // 年: 1到4位
        if (/(y+)/.test(formatter)) {
            formatter = formatter.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
        }
        for (let key in config) {
            if (new RegExp(`(${key})`).test(formatter)) {
                let value = RegExp.$1.length == 1 ? config[key] : ('00' + config[key]).substr(String(config[key]).length);
                formatter = formatter.replace(RegExp.$1, value);
            }
        }
        return formatter;
    }
}

exports.UtilDate = UtilDate;