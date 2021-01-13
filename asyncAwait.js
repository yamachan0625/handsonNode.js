// async関数が一時停止している間も、async関数の外の処理は動作を続ける
async function pauseAndResume(pausePeriod) {
  console.log("pauseAndRssume開始");
  await new Promise((resolve) => setTimeout(resolve, pausePeriod));
  console.log("pauseAndRssume再開");
}

pauseAndResume(1000);
console.log("async関数外の処理はawaitの影響を受けない");
// pauseAndRssume開始
// async関数外の処理はawaitの影響を受けない
// pauseAndRssume再開
