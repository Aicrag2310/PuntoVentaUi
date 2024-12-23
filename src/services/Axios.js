/* eslint-disable */
import axios from 'axios';
import { TokenUtils } from '@/utils/TokenUtils';

const baseUrl = `${process.env.VUE_APP_BASEURL}`;

/**
 * @param {Object} headers
 * @returns {Object}
 */
export function setAuthHeaders(headers) {
  return {
    ...headers,
    Authorization: `Bearer ${TokenUtils.getToken()}`,
  };
}

export { baseUrl as ApiRoute };

export function makeAxiosConfig(headers, transformResponseFunc = null) {
  const transformResponse = [...axios.defaults.transformResponse];
  if (transformResponseFunc) {
    transformResponse.push(transformResponseFunc);
  }

  return {
    transformResponse,
    headers: setAuthHeaders(headers),
  };
}

export default axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
});
