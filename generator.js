function parseJSONAsync(json) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    }, 1000)
  );
}

function* asyncWithGeneratorFunc(json) {
  console.log('1回目', json);
  try {
    // 非同期処理の実行
    const result = yield parseJSONAsync(json);
    console.log('パース結果', result);
  } catch (err) {
    console.log('エラーをキャッチ', err);
  }
}

// # 正常系
const asyncWithGenerator1 = asyncWithGeneratorFunc('{ "foo": 1 }');
//  undefined
// "yield parseJSONAsync(json)"で生成されるPromiseインスタンスの取得
const promise1 = asyncWithGenerator1.next().value;
// undefined
// # Promiseインスタンスが解決された値をnext()メソッドに渡す
promise1.then((result) => asyncWithGenerator1.next(result));
// Promise { <pending> }
// # ジェネレータ関数内でのconsole.log()による出力を確認
// > パース結果 { foo: 1 } # resultはPromiseインスタンスではなく、パース結果そのもの

// 非同期処理を実行するジェネレータの汎用的なハンドリング関数
// 戻り値はPromiseインスタンス
function handleAsyncWithGenerator(generator, resolved) {
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
handleAsyncWithGenerator(asyncWithGeneratorFunc('不正なJSON'));
