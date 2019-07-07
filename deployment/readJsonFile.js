import fs from 'fs';

function readFileAsync(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};

export default async function readJsonFile(platformSettingsLocation) {
  const result = await readFileAsync(platformSettingsLocation);
  return JSON.parse(result);
}
