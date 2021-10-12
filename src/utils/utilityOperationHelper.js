import lodashGet from 'lodash.get';

export function isNil(value) {
  return value === null || value === undefined;
}

export function isEmpty(value) {
  if (isNil(value)) {
    return true;
  }

  if (Object.prototype.toString.call(value) === '[object String]') {
    return value.trim().length === 0
  }

  if (isFunction(value)) {
    return false;
  }

  return isNil(value) || Object.keys(value).length === 0;
}

export function reduce(collection, iterator, accumulator) {
  const keys = Object.keys(collection);

  if (keys.length === 0) {
    return accumulator;
  }

  return keys.reduce((prev, value, key) => iterator(prev, value, key), accumulator);
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function padStart(value, length, placeholder) {
  const differenceLength = length - value.toString().length;

  if (differenceLength <= 0) {
    return value;
  }

  return (
    Array(differenceLength)
      .fill(placeholder)
      .join('') + value
  );
}

export function compact(array) {
  if (isNil(array) || !array.length) {
    return [];
  }

  return array.filter((item) => {
    if (typeof item === 'string' && item !== '') {
      return item.trim();
    }
    return item;
  });
}

export const get = lodashGet;

export function updateImmutable(obj, path = '', value) {
  let current = value;
  let lastIndex = path.lastIndexOf('.');
  while (lastIndex !== -1) {
    const key = path.substr(lastIndex + 1);
    path = path.substr(0, lastIndex);
    let next = get(obj, path);
    next = Array.isArray(next) ? [...next] : { ...next };
    next[key] = current;
    current = next;
    lastIndex = path.lastIndexOf('.');
  }
  return { ...obj, [path]: current };
}

export function omit(object, prop) {
  const newObj = {
    ...object,
  };
  delete newObj[prop];
  return newObj;
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function throttle(func, wait = 100) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const executor = function () {
      func.apply(context, args);
      return setTimeout(() => {
        timeout = null;
      }, wait);
    };
    if (!timeout) {
      timeout = executor();
    }
  };
}

export function sumBy(list, iteratee) {
  if (typeof iteratee === 'string') {
    return list.reduce((pre, cur) => pre + get(cur, iteratee, 0), 0);
  }

  if (typeof iteratee === 'function') {
    return list.reduce((pre, cur) => pre + iteratee(cur), 0);
  }
  throw new Error('invalid params');
}

export function toThousands(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function flat(array) {
  if (!get(array, 'length')) {
    return array;
  }
  return array.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? cur : []));
}

export function partitionBy(list, iteratee) {
  if (!isFunction(iteratee)) {
    return [list];
  }
  if (!Array.isArray(list)) {
    return list;
  }

  const partition1 = [];
  const partition2 = [];
  list.forEach((item) => {
    if (iteratee(item)) {
      partition1.push(item);
    } else {
      partition2.push(item);
    }
  });
  return [partition1, partition2];
}

export function uniqBy(array, tag) {
  return array.reduce((prev, next) => {
    if (!prev.find((item) => get(item, tag) === get(next, tag))) {
      prev.push(next);
    }
    return prev;
  }, []);
}

export function uniq(array) {
  return array.reduce((prev, next) => {
    if (!prev.find((item) => item === next)) {
      prev.push(next);
    }
    return prev;
  }, []);
}

export function ceil(val, precision = 2) {
  const multipleRatio = Math.pow(10, precision);
  const multipleVal = val * multipleRatio;
  return Math.ceil(multipleVal) / multipleRatio;
}

export function lastIndexOfBy(list, iteratee) {
  if (!Array.isArray(list)) {
    return null;
  }
  const { length } = list;

  for (let i = length - 1; i >= 0; i--) {
    if (iteratee(list[i])) {
      return i;
    }
  }

  return null;
}

export function toQueryString(params) {
  if (isEmpty(params)) {
    return '';
  }
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
}

export function hideMidOfMobileNumber(val) {
  if (isEmpty(val)) {
    return val
  }
  return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}
