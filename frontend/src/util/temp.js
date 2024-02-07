export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

export function countItems(arr) {
  return arr.reduce(function (count, item) {
    count[item] = (count[item] || 0) + 1;
    return count;
  }, {});
}
