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