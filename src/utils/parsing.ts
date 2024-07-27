export function getValidProperties(fields: any) {
  const objectWithValidProperties = {};
  for (const key in fields) {
    if (fields[key]) {
      objectWithValidProperties[key] = fields[key];
    }
  }
  return objectWithValidProperties;
}
