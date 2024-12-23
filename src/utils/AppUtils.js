/* eslint-disable */ 
/**
 * @param {number} ms
 * @return {Promise<any>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function redirectToUserSectionByAttributes($router) {
  let path = null;

  path = '/dashboard';

  if (path) {
    $router.push(path);
  }
}
