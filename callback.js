// Node.js規約
// ・コールバックがパラメータの最後にあること
// ・コールバックの最初のパラメータが処理中に発生したエラー、2 つ目以降のパラメータが処理の結果であること

/** 悪い例 */
function parseJSONAsync(json, callback) {
  try {
    // setTimeoutに渡したコールバックはparseJSONAsync内の処理が全て完了した後で
    // イベントループから実行されるため、呼び出し元がparseJSONAsyncにならない
    // そのためtry catchでエラーを捕捉できない
    setTimeout(() => {
      callback(JSON.parse(json));
    }, 1000);
  } catch (err) {
    console.error('エラーをキャッチ', err);
    callback({});
  }
}
parseJSONAsync('不正なJSON', (result) => console.log('parse結果', result));

/** 良い例 */
function parseJSONAsyncWithCatch(json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json));
    } catch (error) {
      callback(error);
    }
  }, 1000);
}

parseJSONAsync('不正なJSON', (err, result) =>
  console.log('parse結果', err, result)
);
