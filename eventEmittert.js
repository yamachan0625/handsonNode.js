function createFizzBuzzEventEmitter(maxNum) {
  const eventEmitter = new events.EventEmitter();
  // イベントの発行を常に非同期にするため、process.nextTick()を利用
  process.nextTick(() => _emitFizzBuzz(eventEmitter, maxNum));
  return eventEmitter; // EventEmitterをreturnすることでonなどのインスタンスメソッドを使用できる
}

async function _emitFizzBuzz(eventEmitter, maxNum) {
  eventEmitter.emit("start");
  let count = 1;
  while (count <= maxNum) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (count % 15 === 0) {
      eventEmitter.emit("FizzBuzz", count);
    } else if (count % 3 === 0) {
      eventEmitter.emit("Fizz", count);
    } else if (count % 5 === 0) {
      eventEmitter.emit("Buzz", count);
    }
    count += 1;
  }
  eventEmitter.emit("end");
}

function startListener() {
  console.log("start");
}

function fizzListener(count) {
  console.log("Fizz", count);
}

function buzzListener(count) {
  console.log("Buzz", count);
}
function fizzBuzzListener(count) {
  console.log("FizzBuzz", count);
}

// 指定したイベント（第一引数、文字列）に対する新しいリスナ（第二引数,コースバック）を解除
function endListener() {
  console.log("end");
  this.off("start", startListener)
    .off("Fizz", fizzListener)
    .off("Buzz", buzzListener)
    .off("FizzBuzz", fizzBuzzListener)
    .off("end", endListener);
}

// 指定したイベント（第一引数、文字列）に対する新しいリスナ（第二引数,コースバック）を登録
createFizzBuzzEventEmitter(40)
  .on("start", startListener)
  .on("Fizz", fizzListener)
  .once("Buzz", buzzListener) // onceで登録すると一回のみ実行される
  .on("FizzBuzz", fizzBuzzListener)
  .on("end", endListener);
// 実行結果
//   Fizz 3
//   Buzz 5
//   Fizz 6
//   Fizz 9
//   Fizz 12
//   FizzBuzz 15
//   Fizz 18
//   Fizz 21
//   Fizz 24
//   Fizz 27
//   FizzBuzz 30
//   Fizz 33
//   Fizz 36
//   Fizz 39
//   end

// リスなは常に同期的に実行される
const fooEventEmitter = new events.EventEmitter();
fooEventEmitter.on("foo", () => {
  console.log("fooイベントリスナの実行");
});
console.log("fooイベント発行", fooEventEmitter.emit("foo"));
// fooイベントリスナの実行
// fooイベント発行 true

// EventEmitter を継承し た class を作成するパターンです。
class FizzBuzzEventEmitter extends events.EventEmitter {
  async start(until) {
    this.emit("start");
    let count = 1;
    while (true) {
      if (count % 15 === 0) {
        this.emit("FizzBuzz", count);
      } else if (count % 3 === 0) {
        this.emit("Fizz", count);
      } else if (count % 5 === 0) {
        this.emit("Buzz", count);
      }
      count += 1;
      if (count >= until) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.emit("end");
  }
}
new FizzBuzzEventEmitter()
  .on("start", startListener)
  .on("Fizz", fizzListener)
  .on("Buzz", buzzListener)
  .on("FizzBuzz", fizzBuzzListener)
  .on("end", endListener)
  .start(20);
//   start
//   Promise { <pending> } > Fizz 3
//   Buzz 5
//   Fizz 6
//   Fizz 9
//   Buzz 10
//   Fizz 12
//   FizzBuzz 15
//   Fizz 18
//   end
