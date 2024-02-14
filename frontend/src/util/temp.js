export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

export function countItems(arr) {
  return arr.reduce(function (count, item) {
    count[item] = (count[item] || 0) + 1;
    return count;
  }, {});
}

export function sortbyValue(arr) {
  if (typeof arr !== 'object' || arr === null) {
    console.error('Invalid input: expected an object');
    return {}; // Return an empty object or handle this case as needed
  }
  let sortedJson = Object.fromEntries(
    Object.entries(arr).sort((a, b) => b[1] - a[1])
  )
  return sortedJson;
}

export function sortbyKey(arr){
  if (typeof arr !== 'object' || arr === null) {
    console.error('Invalid input: expected an object');
    return {}; // Return an empty object or handle this case as needed
  }
  let sortedJson = Object.fromEntries(
    Object.entries(arr).sort((a, b) => a[0].localeCompare(b[0]))
  );
  return sortedJson;
}

export function reverseArray(arr){
  let rotated = Object.fromEntries(
    Object.entries(arr).reverse()
  );
  return rotated;
}

export function extractJson_TopNumber(arr, number){
  const top2Entries = Object.entries(arr)
    .sort((a, b) => b[1] - a[1])
    .slice(0, number);
  
  // Convert back to object
  let topItems = Object.fromEntries(top2Entries);
  return topItems;
}

export function convertStringKeyJson(arr){
  if (typeof arr !== 'object' || arr === null) {
    console.error('Invalid input: expected an object');
    return {}; // Return an empty object or handle this case as needed
  }
  let stringKeysObject = Object.fromEntries(
    Object.entries(arr).map(([key, value]) => [String(key), value])
  );
  return stringKeysObject;
}