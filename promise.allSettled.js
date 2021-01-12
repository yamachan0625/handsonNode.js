// Promise.allSettled() の返す Promise インスタンスは、引数に含まれる Promise
// インスタンスがすべて settled になったとき fulfilled になります。
// その値は引数の Promise インスタンスの結果を引数の順番どおりに保持する配列になります。
const allSettled = Promise.allSettled([
  1,
  Promise.resolve("foo"),
  Promise.reject(new Error("エラー")),
  Promise.resolve(true),
]);
// > allSettled
// Promise {
//     [
//     { status: 'fulfilled', value: 1 },
//     { status: 'fulfilled', value: 'foo' }, {
//     status: 'rejected', reason: Error: エラー
//     # ...(省略) },
//     { status: 'fulfilled', value: true } ]
//     }
