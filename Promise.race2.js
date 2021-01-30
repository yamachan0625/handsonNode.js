// Promise.raceが用いられる場面の一つにタイムアウトの実装があります。
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('タイムアウト'));
      }, timeout);
    }),
  ]);
}

// 20ミリ秒で完了する非同期処理
const promise = new Promise((resolve) =>
  setTimeout(() => {
    resolve(1);
  }, 20)
);

// タイムアウト30ミリ秒で実行
const shouldBeResolved = withTimeout(promise, 30);
// タイムアウト10ミリ秒で実行
const shouldBeRejected = withTimeout(promise, 10);

shouldBeResolved;
// Promise {<fulfilled>: 1}
shouldBeRejected;
// Error: タイムアウト
