const fs = require('fs');
const csvParser = require('csv-parser');
const Papa = require('papaparse');

class CSVDataCleaner {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readCSV() {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(this.filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async cleanData(columns) {
    try {
      const data = await this.readCSV();

      let cleanedData = this.removeRowsWithMissingValues(data, columns);
      cleanedData = this.removeDuplicates(cleanedData);
      cleanedData = this.standardizeTextData(cleanedData, columns);
      cleanedData = this.normalizeNumericData(cleanedData, 'numericColumn');
      cleanedData = this.detectAndRemoveOutliers(cleanedData, 'numericColumn');

      return cleanedData;
    } catch (error) {
      console.error('Error cleaning data:', error);
      throw error;
    }
  }

  removeRowsWithMissingValues(data, columns) {
    return data.filter(row => columns.every(column => row[column] && row[column].trim() !== ''));
  }

  removeDuplicates(data) {
    const seen = new Set();
    return data.filter(row => {
      const key = JSON.stringify(row);
      return !seen.has(key) && seen.add(key);
    });
  }

  standardizeTextData(data, columns) {
    return data.map(row => {
      const updatedRow = { ...row };
      columns.forEach(column => {
        if (updatedRow[column]) {
          updatedRow[column] = updatedRow[column].trim().toLowerCase();
        }
      });
      return updatedRow;
    });
  }

  normalizeNumericData(data, column) {
    const values = data.map(row => parseFloat(row[column])).filter(value => !isNaN(value));
    if (values.length === 0) return data;

    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) return data; 
    
    return data.map(row => {
      const value = parseFloat(row[column]);
      if (!isNaN(value)) {
        row[column] = (value - min) / (max - min);
      }
      return row;
    });
  }

  detectAndRemoveOutliers(data, column) {
    const values = data.map(row => parseFloat(row[column])).filter(value => !isNaN(value));
    if (values.length === 0) return data;

    const q1 = this.percentile(values, 25);
    const q3 = this.percentile(values, 75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return data.filter(row => {
      const value = parseFloat(row[column]);
      return value >= lowerBound && value <= upperBound;
    });
  }

  percentile(values, percentile) {
    values.sort((a, b) => a - b);
    const index = (percentile / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) {
      return values[lower];
    }
    return values[lower] * (upper - index) + values[upper] * (index - lower);
  }

  async writeCSV(data, outputFilePath) {
    try {
      const csv = Papa.unparse(data);
      fs.writeFileSync(outputFilePath, csv);
      console.log('Data successfully written to', outputFilePath);
    } catch (error) {
      console.error('Error writing data to file:', error);
    }
  }
}

module.exports = CSVDataCleaner;
