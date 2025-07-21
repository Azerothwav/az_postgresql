const normalizeArray = (input) => {
  if (!Array.isArray(input)) {
    return Object.keys(input)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => input[k]);
  }
  return input;
};
