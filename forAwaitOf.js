const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    // asyncイテレータ
    return {
      // value、doneプロパティを持つオブジェクトで解決されるPromiseを返す
      next() {
        if (i > 3) {
          return Promise.resolve({ done: true });
        }
        return new Promise((resolve) =>
          setTimeout(() => resolve({ value: i++, done: false }), 100)
        );
      },
    };
  },
};

for await (const element of asyncIterable) {
  console.log(element);
}
// 0
// 1
// 2
// 3

// asyncジェネレータ関数
async function* asyncGenerator() {
  let i = 0;
  while (i <= 3) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield i++;
  }
}
