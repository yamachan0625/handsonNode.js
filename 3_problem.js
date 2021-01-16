// 3-1
// events.on() の引数に渡した EventEmitter インスタンスが error イベントを発 行した場合、
// 生成されたasyncイテラブルがfor await...ofループでエラーを 投げ、

const { Stream } = require('stream');

// かつリスナの登録が解除されることを確認してください。
const onEventEmitter = new events.EventEmitter();
const onAsyncIterable = events.on(onEventEmitter, 'eventA');
onEventEmitter.listeners('eventA');
(async () => {
  for await (const a of onAsyncIterable) {
    // 何もしない
  }
})().catch((err) => console.error('for await...ofでエラー', err));
onEventEmitter.listenres('eventA'); // [Function: EventHundler]
onEventEmitter.emit('error', new Error('エラー')); // for await...ofでエラー Error: エラー
onEventEmitter.listeners('eventA'); // [] エラーが発生するとリスなが削除される

// 3-2
// events.once() の引数に渡した EventEmitter インスタンスが error イベントを 発行した場合、
// 生成された Promise インスタンスが拒否されることを確認してく ださい。
const onceEventEmitter = new events.EventEmitter();
const oncePromise = events.once(onceEventEmitter, 'eventB');
oncePromise.catch((err) => console.error('promiseインスタンスの拒否', err));
onceEventEmitter.emit('error', new Error('エラー')); // Promiseインスタンスの拒否 Error: エラー

// 3-3
// stream.Readable.from() でイテラブルから読み込みストリームを作れることを 利用して、
// 「3.2.2 読み込みストリーム」で実装したHelloReadableStreamと同様 の読み込みストリームを、
// ジェネレータ関数を使って実装し直してください。
function* helloGenarator() {
  for (const language of ['Javascrip', 'Python', 'Java', 'C#']) {
    yield `Hello ${language}\n`;
  }
}
const helloReadableStreamFromGenarator = stream.Readable.from(helloGenarator());
helloReadableStreamFromGenarator.on('data', console.log);
// 以下の内容でdest.txtが生成される
// Hello Javascrip
// Hello Python
// Hello Java
// Hello C#
