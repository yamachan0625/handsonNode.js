class HelloReadableStream extends stream.Readable {
  constructor(options) {
    super(options);
    this.languages = ['JavaScript', 'Python', 'Java', 'C#'];
  }

  _read(size) {
    let language;
    while ((language = this.languages.shift())) {
      // pushはそれ以上のデータ流せるかどうかをbooleanで返す
      // false を返され るとそこでデータの流れが一時停止しますが、
      // データを流せる状態になったら再度 _read() が呼ばれるので、そのタイミングで再開できます。
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log('中断');
        return;
      }
    }
    console.log('完了');
    this.push(null);
  }
}

const helloReadableStream = new HellowReadableStream();

helloReadableStream
  .on('readable', () => {
    console.log('readable');
    let chunk;
    while ((chunk = helloReadableStream.read()) !== null) {
      console.log(
        `chunk ${chunk.toString()} ${chunk.toString()} ${chunk.toString()}`
      );
    }
  })
  .on('end', () => console.log('end'));
// 完了
// readable
// chunk Hello, JavaScript!
// Hello, Python!
// Hello, Java!
// Hello, C#!
//  Hello, JavaScript!
// Hello, Python!
// Hello, Java!
// Hello, C#!
//  Hello, JavaScript!
// Hello, Python!
// Hello, Java!
// Hello, C#!

// end

class DelayLogStream extends stream.Writable {
  constructor(options) {
    super({ objectMode: true, ...options });
  }

  _write(chunk, encoding, callback) {
    console.log('write');
    // messageプロパティ(文字列)、delayプロパティ(数値)を含むオブジェクトが // データとして流れてくることを期待
    const { message, delay } = chunk;
    // delayで指定した時間(ミリ秒)だけ遅れてmessageをログに出す
    setTimeout(() => {
      console.log(message);
      callback(); //callbackがないとdelay:1000の場合console.logが流れない
    }, delay);
  }
}

const delayLogStream = new DelayLogStream();
delayLogStream.write({ message: 'Hi', delay: 0 });
// write
// true
// > Hi
delayLogStream.write({ message: 'Thank you', delay: 1000 });
// write
// true
// > Thank you # 1秒後に出力される

class LineTransformStream extends stream.Transform {
  // 上流から受け取ったデータのうち、下流に流していない分を保持するフィールド
  remaining = '';
  constructor(options) {
    super({ readableObjectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    console.log('_transform()');
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
    console.log('_flush()');
    // 残っているデータを流し切る
    this.push({ message: this.remaining, delay: this.remaining.length * 100 });
    callback();
  }
}

const lineTransformStream = new LineTransformStream();
lineTransformStream.on('readable', () => {
  let chunk;
  while ((chunk = lineTransformStream.read()) !== null) {
    console.log(chunk);
  }
});

lineTransformStream.write('foo\nbar');
// _transform()
// true
// > { message: 'foo', delay: 300 }
lineTransformStream.write('baz');
// _transform();
// true;
lineTransformStream.end();
// _flush()
// { message: 'bazbar', delay: 600 }

// pipeで接続
new HelloReadableStream()
  .pipe(new LineTransformStream())
  .pipe(new DelayLogStream())
  .on('finish', () => console.log('完了'));
// 完了
// _transform()
// write
// _transform()
// _transform()
// _transform()
// _flush()
// Hello, JavaScript!
// write
// Hello, Python!
// write
// Hello, Java!
// write
// Hello, C#!
// write
// 完了
