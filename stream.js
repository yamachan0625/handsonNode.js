function copyFileWithStream(src, dest, callback) {
  // ファイルから読み込みストリームを生成
  fs.createReadStream(src)
    // ファイルから書き込みストリームを生成し、pipe()でつなぐ
    .pipe(fs.createWriteStream(dest))
    // 完了時にコールバックを呼び出す
    .on("finish", callback);
}
// コピー元ファイルの作成
fs.writeFileSync("src.txt", "Hello, World!");
// コピー実行
copyFileWithStream("src.txt", "dest.txt", () => console.log("コピー完了"));
// Hello, World!と書かれたdest.txtというファイルが作られる

fs.createReadStream("src.txt") // src.txtファイルを読み込む
  // 暗号化処理を追加
  .pipe(crypto.createHash("sha256"))
  .pipe(fs.createWriteStream("dest.txt"))
  .on("finish", () => console.log("コピー完了"));

// 読み込みストリーム
const readStream = fs.createReadStream("src.txt");
readStream
  // readableイベントリスナの登録
  .on("readable", () => {
    console.log("readable");
    let chunk;
    // 現在読み込み可能なデータをすべて読み込む
    while ((chunk = readStream.read()) !== null) {
      console.log(`chunk${chunk.toString()}`); // src.txtファイルの内容を文字列で表示する
    }
  })
  // endイベントリスナの登録
  .on("end", () => console.log("end"));
