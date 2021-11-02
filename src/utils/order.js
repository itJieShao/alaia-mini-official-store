
// todo 这里的countDown要重写
export const countDown = (time) => {
  const result = time;
  const d = parseInt(result / (24 * 60 * 60)); // 用总共的秒数除以1天的秒数
  let h = parseInt((result / (60 * 60)) % 24); // 精确小时，用去余
  let m = parseInt((result / 60) % 60); // 剩余分钟就是用1小时等于60分钟进行趣余
  let s = parseInt(result % 60);
  // 当倒计时结束时，改变内容
  if (result <= 0) {
    return '0';
  }
  if (h < 10) {
    h = `0${h}`;
  }
  if (m < 10) {
    m = `0${s}`;
  }
  if (s < 10) {
    s = `0${s}`;
  }
  if (h == 0 && m == 0) {
    return `${s}s`;
  } if (h == 0) {
    return `${m}:${s}`;
  } if (d == 0) {
    return `${h}:${m}:${s}`;
  }
  return `${d}:${h}:${m}:${s}`;
}