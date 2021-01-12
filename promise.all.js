// Promise.all
const allResolved = Promise.all([
  1, // Promise以外のものも含められる
  Promise.resolve("foo"),
  Promise.resolve(true),
]);
// undefined
// > allResolved
// Promise { [ 1, 'foo', true ] }

// 複数の非同期処理を逐次実行する必要がなければ、
// Promise.all() により並行実行 するほうが結果をより早く取得できます。
// 1秒かかる非同期処理
function asyncFunc() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
// performance.now()で現在時刻を取得
const start = performance.now();
// 逐次実行
asyncFunc()
  .then(asyncFunc)
  .then(asyncFunc)
  .then(asyncFunc)
  .then(() => console.log("逐次実行所要時間", performance.now() - start));
// 逐次実行所要時間 4009.959999995772
// Promise.all()で並行実行
Promise.all([asyncFunc(), asyncFunc(), asyncFunc(), asyncFunc()]).then(() =>
  console.log("並行実行所要時間(Promise.all)", performance.now() - start)
);
// 並行実行所要時間(Promise.all) 11901.550000009593
