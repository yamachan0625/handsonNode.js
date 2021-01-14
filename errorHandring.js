// setTimeoutの引数に渡したコールバックはparseJSONAsync内の同期処理が全て完了した後で、
// イベントループから実行され、呼び出し元がparseJSONAsync()にはならないためです。
// つまり、tyr catchの中であっても実行時はその外で実行されルため、cathcが機能せずにイベントループまで到達する
function parseJSONAsync(json, callback) {
  try {
    setTimeout(() => {
      callback(JSON.parse(json));
    }, 1000);
  } catch (err) {
    console.error("エラーをキャッチ", err); // 表示されない
    callback({});
  }
}
parseJSONAsync("不正なJSON", (result) => console.log("parse結果", result));
// undefined
// > Uncaught SyntaxError: Unexpected token 不 in JSON at position 0

// コールバックの中では起こりうるアプリケションエラーを適切にキャッチし、
// それをイベントループまで到達させることなく呼び出し元に返すことが重要
function parseJSONAsync(json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json));
    } catch (err) {
      callback(err);
    }
  }, 1000);
}
parseJSONAsync("不正なJSON", (err, result) =>
  console.log("parse結果", err, result)
);

// コールバックの呼び出し方が同期か非同期かで一貫性がないと、API の挙動が予期 しづらくなってしまいます
const cache = {};
// 1回目の実行
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache[json];
  if (cached) {
    callback(cached.err, cached.result);
    return;
  }
  parseJSONAsync(json, (err, result) => {
    cache[json] = { err, result };
    callback(err, result);
  });
}

parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log("1回目の結果", err, result);
    // コールバックの中で2回目を実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log("2回目の結果", err, result);
      }
    );
    console.log("2回目の呼び出し完了");
  }
);
console.log("1回目の呼び出し完了");
// 1回目の呼び出し完了
// undefined
// > 1回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の呼び出し完了

// 1 回目の呼び出しでも 2 回目の呼び出しでも、コールバックの処理は常に呼び出し後 に記述された処理よりもあとに実行されており、一貫性が保たれています。
const cache2 = {};
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache2[json];
  if (cached) {
    // キャッシュに値が存在する場合でも、非同期的にコールバックを実行する
    setTimeout(() => callback(cached.err, cached.result), 0);
    return;
  }
  parseJSONAsync(json, (err, result) => {
    cache2[json] = { err, result };
    callback(err, result);
  });
}
// 1回目の実行
parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log("1回目の結果", err, result);
    // コールバックの中で2回目を実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log("2回目の結果", err, result);
      }
    );
    console.log("2回目の呼び出し完了");
  }
);
console.log("1回目の呼び出し完了");
// 1回目の呼び出し完了
// undefined
// > 1回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の呼び出し完了
// 2回目の結果 null { message: 'Hello', to: 'World' }

// API
const cache3 = {};
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache3[json];
  if (cached) {
    // Node.jsのみを対象としたコードの場合
    process.nextTick(() => callback(cached.err, cached.result));
    // ブラウザ環境でも動かすコードの場合
    // 1. queueMicrotask()を使う
    // queueMicrotask(() => callback(cached.err, cached.result))
    // 2. Promiseを使う
    // Promise.resolve().then(() => callback(cached.err, cached.result))
    return;
  }
  parseJSONAsync(json, (err, result) => {
    cache3[json] = { err, result };
    callback(err, result);
  });
}
// 1回目の実行
parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (err, result) => {
    console.log("1回目の結果", err, result); // コールバックの中で2回目を実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (err, result) => {
        console.log("2回目の結果", err, result);
      }
    );
    console.log("2回目の呼び出し完了");
  }
);
console.log("1回目の呼び出し完了");
// 1回目の呼び出し完了
// undefined
// > 1回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の呼び出し完了
// 2回目の結果 null { message: 'Hello', to: 'World' }
