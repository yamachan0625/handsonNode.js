// 7-1
// 第一引数にファイル名、第二引数に ToDo の配列を取り、
// ToDo の配列をファイル に CSV 形式で保存する関数を実装しましょう。
function writeTodosToCsv(file, todos) {
  return fs.promises.writeFile(
    file,
    `id,title,completed\n${todos
      .map(({ id, title, completed }) => `${id},${title},${completed}`)
      .join('\n')}`
  );
}
const todos = [
  { id: '1', title: 'ネーム', completed: false },
  { id: '2', title: '下書き', completed: false },
];
await writeTodosToCsv('todos.csv', todos);
console.log(await fs.promises.readFile('todos.csv', 'utf8'));

//7-2
// CSV形式でToDoの配列が保存されたファイル名を引数に取り、
// ファイルの内容をパースして ToDo の配列を返す処理を実装 しましょう。
// プロパティの並び順は id、title、completed であるとは限らないと します
// (ファイルの 1 行目もきちんと読まなければならないということです)。
async function parseTodosFromCsv(file) {
  const content = await fs.promises.readFile(file, 'utf8');
  const [propsLine, ...todoLines] = content.split(/\n/);
  const props = propsLine.split(',');
  return todoLines.map((line) => {
    const values = line.split(',');
    const todo = {};
    for (let i = 0; i < props.length; i++) {
      todo[props[i]] =
        props[i] === 'completed'
          ? // completedの場合文字列からbooleanへの変換を行う
            values[i] === 'true'
          : values[i];
    }
    return todo;
  });
}
await parseTodosFromCsv('todos.csv');
