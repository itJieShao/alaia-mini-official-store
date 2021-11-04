import utils from '@/utils/utils';
import dayjs from 'dayjs';


export const currency = (value) =>  {
    if (!value && value !== 0) return '0';
    return utils.currency(value);
}

export const dateFormat = (value) => {
if (!value) return '';
return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export const countDownFormat = (time) => {
    const result = time; // 计算出豪秒
    let h = parseInt((result / (60 * 60)) % 24); // 精确小时，用去余
    let m = parseInt((result / 60) % 60); // 剩余分钟就是用1小时等于60分钟进行趣余
    let s = parseInt(result % 60);
    // 当倒计时结束时，改变内容
    if (result <= 0) { return '00:00'; }
    if (h < 10) { h = `0${h}`; }
    if (m < 10) { m = `0${m}`; }
    if (s < 10) { s = `0${s}`; }
    if (h == 0 && m == 0) { return `00:${s}`; } 
    if (h == 0) { return `${m}:${s}`;}
    return `${h}:${m}:${s}`;
}