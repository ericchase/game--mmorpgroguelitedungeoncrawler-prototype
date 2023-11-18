/**
 * Calls querySelector on the query parameter, and checks the instance type of
 * the returned element against the type parameter.
 *
 * @param {string} query
 * @param {*} type
 * @returns {*}
 */
export function query(query: string, type: any): any {
  const element = document.querySelector(query);
  if (element && element instanceof type) {
    return element;
  }
  throw `${query} is not of ${type}`;
}
export function validate(element: any, type: any): any {
  if (element && element instanceof type) {
    return element;
  }
  throw `${element} is not of ${type}`;
}

/**
 * Calls querySelectorAll on the query parameter, and checks the instance type
 * for each returned element against the type parameter.
 *
 * @param {string} query
 * @param {*} type
 * @returns {*}
 */
export function queryAll(query: string, type: any): any {
  const list = document.querySelectorAll(query);
  for (const item of list) {
    if (!(item instanceof type)) {
      throw `${query} is not of NodeList<${type}>`;
    }
  }
  return list;
}
export function validateAll(list: NodeList, type: any): any {
  for (const item of list) {
    if (!(item instanceof type)) {
      throw `${list} is not of NodeList<${type}>`;
    }
  }
  return list;
}
