import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

console.log('import.meta', import.meta);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__filename', __filename);
console.log('__dirname', __dirname);

const require = createRequire(import.meta.url);
const { add } = require('./esm-math');
console.log(add(1, 2));

// JSONファイルもロード可能
// 次の内容のkey-value.jsonが同一ディレクトリに存在する想定
// { "key": "value" }
console.log(require('./key-value'));
