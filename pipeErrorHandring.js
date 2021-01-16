fs.createReadStream("no-such-file.txt")
  // 正しくエラーハンドリングするにはそれのストリームに対してerrorイベントを登録しなければいけない。
  .on("error", (err) => console.log("エラーイベント", err.message))
  .pipe(fs.createWriteStream("dest.txt"))
  .on("error", (err) => console.log("エラーイベント", err.message));
//   エラーイベント ENOENT: no such file or directory, open 'no-such-file.txt'

// エラーハンドリングの冗長性を防ぐためにpipe()の代わりにstream.pipeline()を使用する
stream.pipeline(
  // pipe()したい2つ以上のストリーム
  fs.createReadStream("no-such-file.txt"),
  fs.createWriteStream("dest.txt"),
  // コールバック
  (err) =>
    //   連結したストリームのどこかでエラーが発生した場合、最後の引数として渡し たコールバックがそのエラーを引数に実行されます
    err ? console.error("エラー発生", err.message) : console.log("正常終了") // また、エラーの発生なくストリー ムが終了した場合は、コールバックが引数なしで実行されます。いずれの場合でも、 引数に渡したストリームはすべて自動的に破棄されます。
);
// エラー発生 ENOENT: no such file or directory, open 'no-such-file.txt'

try {
  // util.promisify() による Promise 化が可能て
  await util.promisify(stream.pipeline)(
    fs.createReadStream("no-such-file.txt"),
    fs.createWriteStream("dest.txt")
  );
  console.log("正常終了");
} catch (err) {
  console.error("エラー発生", err.message);
}

// ベントを発行すると述べましたが、何らかの理由でこれらのイベントや error イベン トが発行されないままストリームが終了することがあります。
// たとえば、http モジュー ルを使って送信したリクエスト*1 を途中でとりやめた場合にそのような状況が発生しえ ます。
// そうした状況を考慮する必要がある場合に、ストリームの終了をハンドリングする のに便利なのがstream.finished()です。
stream.finished(
  // dataイベントリスナを登録してフローイングモードにする
  fs.createReadStream("src.txt").on("data", () => {}),
  (err) => (err ? console.error(err.message) : console.log("正常終了"))
);
// promise化
await util
  .promisify(stream.finished)(
    fs.createReadStream("src.txt").on("data", () => {})
  )
  .then(
    () => console.log("正常終了"),
    (err) => console.error(err.message)
  );
