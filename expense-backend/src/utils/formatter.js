/**
 * Converts object keys from snake_case to camelCase
 * @param {Object|Array} data - The data to convert
 * @returns {Object|Array} - The converted data
 */
const toCamelCase = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => toCamelCase(item));
  }

  if (data !== null && typeof data === 'object') {
    const newData = {};
    
    Object.keys(data).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newData[camelKey] = toCamelCase(data[key]);
    });
    
    return newData;
  }
  
  return data;
};

module.exports = {
  toCamelCase
};