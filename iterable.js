// 配列はイテラブルである
// このほかMapやSetもイテラブル
const arrayIterator = [1, 2, 3][Symbol.iterator]();
arrayIterator.next();
// { value: 1, done: false }
arrayIterator.next();
// { value: 2, done: false }
arrayIterator.next();
// { value: 3, done: false }
arrayIterator.next();
// { value: undefined, done: true }
