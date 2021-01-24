#!usr/bin/env node
'use strict';

const arg = process.arg[2];
const num = Number(arg);
// Number.isNaN()で数値が渡されたかどうかをチェック
if (Number.isNun(num)) {
  throw new Error(`${arg} is not a number`);
}

console.log(require('.')(num));
