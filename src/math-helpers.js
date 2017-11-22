export function calculateTheAverage(arrayToAvg) {
  let arrLen = arrayToAvg.length;
  if (arrLen > 0) {
    let sumOfValues = arrayToAvg.reduce((prev, curr) => (curr += prev));
    return Math.round(sumOfValues / arrLen);
  } else {
    return 0;
  }
}
