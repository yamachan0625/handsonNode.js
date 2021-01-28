import { reject } from 'core-js/fn/promise';
import { resolve } from 'path';

const stringPromise = Promise.resolve('{"foo":1}');
stringPromise;
// Promise { '{"foo": 1}' }
const numberPromise = stringPromise.then((str) => str.length);
numberPromise;
// Promise { 10 }
stringPromise;
// Promise { '{"foo": 1}' } // thenを実行しても元のpromiseインスタンス状態は変わらない

async function sampleResolve(value) {
  // async functionはpromiseをresolveするが、setTimeoutの中では無効
  // 非同期で返したい場合は以下を利用する
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(value);
  //   }, 3000);
  // });
  setTimeout(() => {
    return value;
  }, 3000);
}

async function sample() {
  const result = await sampleResolve(5);
  console.log({ result });
}

sample();
// {result: undefined}
// Promise {<fulfilled>: undefined}

asyncFunc1(input)
  .then(
    asyncFunc2, // onFulfilled
    (err) => {
      // onRejected
      // asyncFunc1用のエラーハンドリング
    }
  )
  .then(
    (result) => {
      // onFulfilled
      // この中で発生したエラーは第二引数(onRejected)でハンドリングされない
    },
    (err) => {
      // onRejected
      // asyncFunc2用のエラーハンドリング
    }
  );

// onRejectedを省略しthen()の後ろにcatch()を付けるパターン asyncFunc1(input)
asyncFunc1(input)
  .then(asyncFunc2 /* onFulfilled */)
  .then((result) => {
    // onFulfilled
    // この中で発生したエラーもcatch()に渡したonRejectedでハンドリングされる
  })
  .catch((err) => {
    // onRejected
    // ここにエラーハンドリングを集約できる
  });

const onFinally = () => console.log('finallyのコールバック');
Promise.resolve().finally(onFinally);
// finallyのコールバック
// Promise { <pending> }
Promise.reject(new Error('エラー')).finally(onFinally);
// finallyのコールバック
// Promise {<rejected>: Error: エラー
//     at <anonymous>:1:16}

// rejectされる
const throwErrorInFinally = Promise.resolve(1).finally(() => {
  throw new Error('エラー');
});
throwErrorInFinally;

// Promise {<rejected>: Error: エラー
//   at <anonymous>:2:9
//   at <anonymous>}

Promise.resolve('foo')
  .finally(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          console.log('finally()で1秒経過'); // 先に呼ばれる
          resolve();
        }, 1000)
      )
  )
  .then(console.log); // コールバックが返すPromiseインスタンスの解決を待って出力される
// finally()で1秒経過
// foo

// Promiseは常に非同期;
Promise.resolve('foo').then((result) => console.log('コールバック', result));
console.log('この行が先に実行される');
// この行が先に実行される
// コールバック foo
