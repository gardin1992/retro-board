export function hasField(field: string, obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || obj === undefined) {
    return false;
  }
  const properties = Object.getOwnPropertyNames(obj);
  
  for (let i = 0; i < properties.length; i++) {
    if (properties[i] === field) {
      return true;
    }
    if (hasField(field, obj[properties[i]])) {
      return true;
    }
  }
  return false;
}