// Promise.race() の返す Promise インスタンスは、引数に含まれる Promise インスタンスが
// 1 つでも settled になると、その他の Promise インスタンスの結果を待たずにその Promise インスタンスと同じ状態になります。

// 引数で与えられた時間だけ待機する非同期処理
function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// 最初にfulfilledになるケース
const fulfilledFirst = Promise.race([
  wait(10).then(() => 1), // この結果が採用される
  wait(30).then(() => "foo"),
  wait(20).then(() => Promise.reject(new Error("エラー"))),
]);

// 最初にrejectedになるケース
const rejectFirst = Promise.race([
  wait(20).then(() => 1),
  wait(30).then(() => "foo"),
  // この結果が採用される
  wait(10).then(() => Promise.reject(new Error("エラー"))),
]);

// 引数に空配列を渡すと、解決されることのない(pending 状態にとどまる)Promise イ ンスタンスを返します。
const raceWithEmptyArray = Promise.race([]);

// promise.raceを利用してタイムアウト実装
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("タイムアウト"));
      }, timeout);
    }),
  ]);
}
// 2000ミリ秒で完了する非同期処理
const promise = new Promise((resolve) =>
  setTimeout(() => {
    resolve(1);
  }, 2000)
);
// タイムアウト30ミリ秒で実行
const shouldBeResolved = withTimeout(promise, 3000);
// タイムアウト10ミリ秒で実行
const shouldBeRejected = withTimeout(promise, 1000).catch((err) =>
  console.log(err)
);
