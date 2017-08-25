'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();

// イベント駆動型プログラミング
rl.on('line', (lineString) => {
    // 文字列を「,」で分割して配列に収納
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    if (year === 2010 || year === 2015) {
        // key: 都道府県 value: {2010年2015年の人口とその変化率}のオブジェクト
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        //keyの重複不可なので、最初の男の行は上書きされ、人口が足された女の行だけが残る
        map.set(prefecture, value);
    }
});

rl.resume();

rl.on('close', () => {
    //for (let key of map.keys())
    //for (let value of map.values())
    //for (let [key, value] of map)
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;;
    }
    // Arrayライクなオブジェクトを配列に変換する
    const rankingArray = Array.from(map);
    // 配列を並び替える
    rankingArray.sort(function (a, b) {
        // return a - b;    昇順[2,3,5,7]
        // return b - a;    降順[7,5,3,2]
        return b[1]['change'] - a[1]['change'];
        /*
        Array.sort(fuction () {
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });
        */
    });
    // 配列を指定された関数で変換
    // 第二引数も書くと、各要素の添字も取得できる
    const rankingStrings = rankingArray.map(function (pair, index) {
        return `第${index + 1}位 ${pair[0]} : ${pair[1]['popu10']} => ${pair[1]['popu15']} 変化率: ${pair[1]['change'].toFixed(5)}`;
    });

    console.log(rankingStrings);
});