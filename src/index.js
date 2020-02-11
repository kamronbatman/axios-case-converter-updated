import { headerCase as ccHeader } from 'header-case';
import { snake, camel, header } from './transform';

const standardRequests = ['common', 'delete', 'get', 'head', 'post', 'put', 'patch'];

export const snakeParams = (config) => {
  if (config.params) {
    // eslint-disable-next-line no-param-reassign
    config.params = snake(config.params);
  }
  return config;
};

export const snakeRequest = (data, headers) => {
  Object.entries(headers).forEach(([key, value]) => {
    header(value, true);
    if (!standardRequests.includes(key)) {
      /* eslint-disable no-param-reassign */
      delete headers[key];
      headers[ccHeader(key)] = value;
      /* eslint-enable */
    }
  });

  return snake(data);
};

export const camelResponse = (data, headers) => {
  camel(headers, true);
  return camel(data);
};

const applyConverters = (axios) => {
  /* eslint-disable no-param-reassign */
  axios.defaults.transformRequest = [snakeRequest, ...axios.defaults.transformRequest];
  axios.defaults.transformResponse = [...axios.defaults.transformResponse, camelResponse];
  axios.interceptors.request.use(snakeParams);
  /* eslint-enable */
  return axios;
};

export default applyConverters;
