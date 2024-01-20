import _ from 'lodash';

export function removeUndefinedValues(object: any): {} {
  // Use lodash pickBy to exclude undefined values
  return _.pickBy(object, (value) => value !== undefined);
}
