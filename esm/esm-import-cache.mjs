// キャッシュを無視してモジュー ルを読み込み直したい場合は、
// インポートするモジュールを指定する際にクエリやハッ シュを付ける方法があります。
import './esm-math.mjs';
// クエリ付き
import './esm-math.mjs?foo=1';
// ハッシュ付き
import './esm-math.mjs#bar';

// Hello from esm-math.mjs
// Hello from esm-math.mjs
// Hello from esm-math.mjs
