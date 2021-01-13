// 1
// Promise インスタンスは settled(fulfilled または rejected)状態になったら、それ以
//  上状態が遷移しないと述べました。実際に REPL でコードを書いてこのことを確認 しましょう。
new Promise((resolve, reject) => {
  resolve("foo"); // ここでPromiseインスタンスがfooで解決されsettled状態になる。Promiseインスタンスは、一度sttled状態になったらそれ以降は状態が変化しない。
  resolve("bar"); // 無視される
  reject(new Error("エラーです"));
}).then(
  (result) => console.log("fulfilled", result),
  (err) => console.log("rejected", err)
);
//> fulfilled foo

// 2
// JSON 文字列のパース結果をキャッシュし、同じ文字列に対するパースの要 求に対しては
// キャッシュされた結果を使い回すparseJSONAsyncWithCache()を
//  Promiseで実装するとどうなるでしょうか。
function parseJSONAsync(json) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    }, 3000)
  );
}
const parseJSONAsyncCache = {};
function parseJSONAsyncWithCache(json) {
  let chached = parseJSONAsyncCache[json]; // jsonをキーとして取得する
  if (!chached) {
    chached = parseJSONAsync(json);
    parseJSONAsyncCache[json] = chached;
  }
  return chached;
}
// 動作確認
parseJSONAsyncWithCache('{"message": "Hello", "to": "World"}')
  .then((result) => console.log("１回目の結果", result))
  .then(() => {
    const promise = parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}'
    );
    console.log("２回目の呼び出し");
    return promise;
  })
  .then((result) => console.log("2かいめの結果", result));
console.log("１回目の呼び出し");
// 1回目の呼び出し完了
// undefined
// > 1回目の結果 { message: 'Hello', to: 'World' }
// # キャッシュ済みの結果も非同期的に返されるため、ログ出力の順番が守られる
// 2回目の呼び出し完了
// 2回目の結果 { message: 'Hello', to: 'World' }

// 3
// 数値で解決される Promise インスタンスの配列を引数に取り、
// その合計値で解決 されるPromiseインスタンスを返す関数を、Promise.allSettled()を使って実 装してください。
// 引数の配列には rejected な Promise インスタンスも含まれうるとし、
// その場合でも戻り値の Promise インスタンスは rejected にせず、fulfilled な
// Promise インスタンスの値だけを合計してください。fulfilled な Promise インスタ ンスが1つも含まれない場合は、
// 0で解決されるPromiseインスタンスを返してく ださい。
async function asyncSum(promiseArr) {
  let sum = 0;
  const arr = await Promise.allSettled(promiseArr);
  for (const e of arr) {
    if (e.status === "fulfilled") {
      sum += e.value;
    }
  }
  return sum;
}
// 動作確認
asyncSum(
  [1, 2, 3, 4].map((e) =>
    e % 2 === 0 ? Promise.resolve(e) : Promise.reject(new Error("エラー"))
  )
).then(console.log);
// > 6

// 同じ関数を Promise.all() を使って書いてください。
async function asyncSum2(promiseArr) {
  let sum = 0;
  const arr = await Promise.all(promiseArr.map((e) => e.catch(() => 0)));
  for (const e of arr) {
    sum += e;
  }
  return sum;
}
// 動作確認
asyncSum(
  [1, 2, 3, 4].map((e) =>
    e % 2 === 0 ? Promise.resolve(e) : Promise.reject(new Error("エラー"))
  )
).then(console.log);
// > 6
