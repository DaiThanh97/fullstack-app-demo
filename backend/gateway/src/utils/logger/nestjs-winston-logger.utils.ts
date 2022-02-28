import { flatten, unflatten } from 'flat';

export const maskFields = [
  'creditCardNumber',
  'creditCardSecurityCode',
  'idNo1',
  'idNo2',
  'idNumber',
  'payerIdNumber',
  'creditCardNo',
  'applicationHKID',
  'insuredDocId',
];

export const maskText = (input: string): string =>
  input.toString().replace(/\S/gi, '*');

export const maskSensitiveData = <T>(data: T): T => {
  if (!data) {
    return data;
  }
  const maskedIdNum = '********';
  const flattenedResult: Record<string, unknown> = flatten(data);
  for (const key in flattenedResult) {
    if (
      (key.includes('idNum') || key.includes('raw')) &&
      !(key.includes('score') || key.includes('passThreshold'))
    ) {
      flattenedResult[key] = maskedIdNum;
    }
  }
  return unflatten(flattenedResult);
};

export const maskSensitiveParams = (data: string): string => {
  const url = data;
  const originalUrl = new URL(url);
  let newQueryString = ``;
  originalUrl.searchParams.forEach((value, key) => {
    if (maskFields.includes(key)) {
      newQueryString += `${key}=${maskText(value)}`;
    } else {
      newQueryString += `${key}=${value}`;
    }
  });
  if (newQueryString.length > 0) {
    return `${originalUrl.origin}${originalUrl.pathname}?${newQueryString}`;
  } else {
    return `${originalUrl.origin}${originalUrl.pathname}`;
  }
};

export const maskSensitiveDataInObject = <T>(data: T): T => {
  if (!data) {
    return data;
  }
  const flattenedResult: Record<string, string> = flatten(data);
  for (const key in flattenedResult) {
    if (maskFields.some((field) => key.includes(field))) {
      flattenedResult[key] = maskText(flattenedResult[key]);
    }
    if (key.toLowerCase().includes('url')) {
      flattenedResult[key] = maskSensitiveParams(flattenedResult[key]);
    }
  }
  return unflatten(flattenedResult);
};
