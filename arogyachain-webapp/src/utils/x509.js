/* eslint-disable no-console */
function readFile(file) {
  console.log('file', file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader?.result);
    reader.onerror = () => reject(reader?.error);
    // Read the file as text
    reader.readAsText(file);
  });
}

function convertPEMFormatToRNString(pemFormattedString) {
  return pemFormattedString.replace(/\r\n/g, '\\r\\n');
}

function convertPEMFormatToNString(pemFormattedString) {
  return pemFormattedString.replace(/\n/g, '\\n');
}

export { readFile, convertPEMFormatToRNString, convertPEMFormatToNString };
