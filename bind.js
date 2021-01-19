// その関数の中で this や引数として使う値を指定して実行す ると、
// それらの値がバインドされた新しい関数を返します。引数をバインドした 場合、
// 新しい関数ではその分引数の数が少なくなります。
function add(a, b) {
  return (Number(this) || 0) + a + b;
}
add(1, 2);
// 3#0+1+ 2
// # 何も指定せずにbind()した関数を実行
add.bind()(1, 2);
// 3#0+1+ 2
// # thisが1になるようbind()した関数を実行
add.bind(1)(1, 2);
// 4#1+1+ 2
// # thisが1、第一引数が2になるようbind()した関数を実行
add.bind(1, 2)(2);
// 5#1+2+ 2
// # thisが1、第一引数が2、第二引数が3になるようbind()した関数を実行
add.bind(1, 2, 3)();
// 6#1+2+ 3
// # もともとの関数は引数の数が2
add.length;
// 2
// # thisと第一引数をバインドした関数は引数の数が1
add.bind(1, 2).length;
// 1
