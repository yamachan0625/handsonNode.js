class HelloReadableStream extends stream.Readable {
  constructor(options) {
    super(options);
    this.languages = ["JavaScript", "Python", "Java", "C#"];
  }

  _read(size) {
    console.log("_read()");
    let language;
    while ((language = this.languages.shift())) {
      // pushでデータを渡す
      // ただし、pushがfalseを返したらそれ以上渡さない
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log("読み込み中断");
        return;
      }
    }
    // 最後にnullを渡してストリームの終了を通知する
    console.log("読み込み完了");
    this.push(null);
  }
}

// const helloReadableStream = new HelloReadableStream();
// helloReadableStream
//   .on("readable", () => {
//     console.log("readable");
//     let chunk;
//     while ((chunk = helloReadableStream.read()) !== null) {
//       console.log(`chunk${chunk.toString()}`);
//     }
//   })
//   .on("end", () => console.log("end"));

class DelayLogStream extends stream.Writable {
  constructor(options) {
    // objectMode: trueを指定するとオブジェクトをデータとして流せる
    super({ objectMode: true, ...options });
  }

  _write(chunk, encoding, callback) {
    console.log("_write");
    // messageプロパティ(文字列)、delayプロパティ(数値)を含むオブジェクトが
    // データとして流れてくることを期待
    const { message, delay } = chunk;
    setTimeout(() => {
      console.log(message);
      callback();
    }, delay);
  }
}
// const delayLogStream = new DelayLogStream();
// delayLogStream.write({ message: "Hi", delay: 0 }); // Hiがすぐに出力
// delayLogStream.write({ message: "Thank you", delay: 1000 }); // Thank youが１秒後に出力される

// 文字列データを行単位で DelayLogStream が受け取れる形式の
// オブジェクトに変換する変換ストリームを作ってみましょう。
class LineTransformStream extends stream.Transform {
  // 上流から受け取ったデータのうち、下流に流していない分を保持するフィールド
  //   remaining = "";
  constructor(options) {
    // push()にオブジェクトを渡せるようにする
    super({ readableObjectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    console.log("_transform");
    const lines = (chunk + this.remaining).split(/\n/);
    // 最後の行は次に入ってくるデータの先頭と同じ行になるため、変数に保持
    this.remaining = lines.pop();
    for (const line of lines) {
      // ここではpush()の戻り値は気にしない
      this.push({ message: line, delay: line.length * 100 });
    }
    callback();
  }

  _flush(callback) {
    console.log("_flush");
    // 残っているデータを流し切る
    this.push({ message: this.remaining, delay: this.remaining.length * 100 });
    callback();
  }
}

// const lineTransformStream = new LineTransformStream();
// lineTransformStream.on("readable", () => {
//   let chunk;
//   while ((chunk = lineTransformStream.read()) !== null) {
//     console.log(chunk);
//   }
// });

// lineTransformStream.write("foo\nbar");
//         _transform()
//         true
//         > { message: 'foo', delay: 300 }
// lineTransformStream.write("baz");
//         _transform();
//         true;
// lineTransformStream.end();
//         _flush()
//         { message: 'bazbar', delay: 600 }

new HelloReadableStream()
  .pipe(new LineTransformStream())
  .pipe(new DelayLogStream())
  .on("finish", () => console.log("完了"));
//   _read()
//   読み込み完了
//    _transform()
//    _write()
//    _transform()
//     _transform()
//      _transform()
//      _flush()
//   Hello, JavaScript!
//   _write()
//   Hello, Python!
//   _write()
//    Hello, Java!
//    _write()
//    Hello, C#!
//     _write()

// バックプレッシャの挙動確認
new HelloReadableStream({ highWaterMark: 0 })
  .pipe(
    new LineTransformStream({
      writableHighWaterMart: 0,
      readableHighWaterMark: 0,
    })
  )
  .pipe(new DelayLogStream({ highWaterMark: 0 }))
  .on("finish", () => console.log("完了"));
//   _resd()
//   読み込み中断
//   _resd()
//   読み込み中断
//   _transform
//   _write
//   _transform
//   _resd()
//   読み込み中断
//   _resd()
//   読み込み中断
//   _resd()
//   読み込み完了
//   Hello, JavaScript!
//   _write
//   Hello, Python!
//   _transform
//   _write
//   Hello, Java!
//   _transform
//   _flush
//   _write
//   Hello, C#!
//   _write
//   undefined
//   完了

// 読み込みストリームとasyncイテラブルの互換性
const helloReadableStream1 = new HelloReadableStream().on("end", () =>
  console.log("完了")
);
for await (const data of helloReadableStream1) {
  console.log("data", data.toString());
}
// _read()
// 読み込み完了
// 完了
// data Hello, JavaScript!
// Hello, Python!
// Hello, Java!
// Hello, C#!

const helloReadableStream2 = new HelloReadableStream({
  highWaterMark: 0,
}).on("end", () => console.log("完了"));
for await (const data of helloReadableStream2) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log("data", data.toString());
}
// _read()
// 読み込み中断
// _read()
// 読み込み中断
// data Hello, JavaScript!

// data Hello, Python!

// _read()
// 読み込み中断
// data Hello, Java!

// _read()
// 読み込み中断
// data Hello, C#!

// _read()
// 読み込み完了
// 完了
