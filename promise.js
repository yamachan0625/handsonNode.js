promise.then(
  // onFulfilled
  (value) => {
    // 成功時の処理
  },
  // onRejected
  (err) => {
    // 失敗時の処理
  }
);

//promiseに置き換え
function parseJSONAsync2(json) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(JSON.parse(json));
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}
const toBeFulfilled = parseJSONAsync2('{"foo": 1}');
const toBeRejected = parseJSONAsync２("不正なJSON");
console.log("*************** Promise生成直後 ***************");
console.log(toBeFulfilled);
console.log(toBeRejected);
setTimeout(() => {
  console.log("******************** 1秒後 ********************");
  console.log(toBeFulfilled);
  console.log(toBeRejected);
}, 1000);

// onRejectedを省略せずに何か値を返すようにすると、
// その値で解決されたPromiseインスタンスが得られます
// この結果、UnhandledPromiseRejectionWarning は出力されなくなります。
const recoveredPromise = Promise.reject(new Error("エラー")).then(
  () => 1,
  (err) => err.message
);
recoveredPromise;
// Promise { 'エラー' }
asyncFunc1(input)
  // asyncFunc1完了後、その結果を引数にasyncFunc2を実行
  .then(asyncFunc2)
  // asyncFunc2完了後、その結果を引数にasyncFunc3を実行
  .then(asyncFunc3)
  // asyncFunc3完了後、その結果を引数にasyncFunc4を実行
  .then(asyncFunc4)
  .then((result) => {
    // すべての非同期処理が完了したあとの処理
  })
  .catch((err) => {
    // エラーハンドリング
  });

//   コールバックの戻り値が Promise インスタンスの場 合、finally() の返す Promise インスタンスはコールバックの返す Promise インスタン スが解決されるまで解決されません。
Promise.resolve("foo")
  .finally(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          console.log("finally()で1秒経過");
          resolve();
        }, 1000)
      )
  )
  .then(console.log);
//   Promise { <pending> }
//   > finally()で1秒経過
//   foo # コールバックが返すPromiseインスタンスが解決されるのを待って出力される

// then()、catch()、finally() に共通の性質として、これらのメソッドに渡すコール バックは、
// Promise インスタンスの状態にかかわらず(すでに settled でも)常に非同期 的に実行されます。
Promise.resolve("foo").then((result) => console.log("コールバック", result));
console.log("この行が先に実行される");
// この行が先に実行される undefined
// > コールバック foo
