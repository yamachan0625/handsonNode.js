// ジェネレータを利用した非同期プログラミング
function parseJSONAsync(json) {
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

function* asyncWithGeneratorFunc(json) {
  try {
    const result = yield parseJSONAsync(json); // result に JSON 形式の文字列のパース結果が入ることを期待しています
    console.log("パース結果", result);
  } catch (error) {
    console.log("error", error);
  }
}
// 正常系
// ジェネレータの生成
const asyncWithGenerator1 = asyncWithGeneratorFunc('{ "foo": 1 }');
// "yield parseJSONAsync(json)"で生成されるPromiseインスタンスの取得
const promise1 = asyncWithGenerator1.next().value;
// Promiseインスタンスが解決された値をnext()メソッドに渡す
promise1.then((result) => asyncWithGenerator1.next(result));
// パース結果 { foo: 1 }

// 異常系
const asyncWithGenerator2 = asyncWithGeneratorFunc("不正なJSON");
const promise2 = asyncWithGenerator2.next().value;
promise2.catch((err) => asyncWithGenerator2.throw(err));

// 非同期処理を実行するジェネレータの汎用的なハンドリング関数
// 戻り値はPromiseインスタンス
function handleAsyncWithGenerator(generator, resolved) {
  console.log({ resolved }); // １回目 { resolved: undefined } 2回目{ resolved: { foo: 1 } }
  // 前回yieldされたPromiseインスタンスの値を引数にnext()を実行
  // 初回はresolvedには値が入っていない(undefined)
  const { done, value } = generator.next(resolved);
  if (done) {
    // ジェネレータが完了した場合はvalueで解決されるPromiseインスタンスを返す
    return Promise.resolve(value);
  }
  return value.then(
    // 正常系では再起呼び出し
    (resolved) => handleAsyncWithGenerator(generator, resolved),
    // 異常系ではthrow()メソッドを実行
    (err) => generator.throw(err)
  );
}
handleAsyncWithGenerator(asyncWithGeneratorFunc('{ "foo": 1 }'));
// パース結果 { foo: 1 }

handleAsyncWithGenerator(asyncWithGeneratorFunc("不正なJSON"));
// error SyntaxError
