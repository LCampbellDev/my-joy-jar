export const isValidId = (id) => {
  if (typeof id !== 'string') {
    return false;
  }

  return /^[1-9]\d*$/.test(id);
};