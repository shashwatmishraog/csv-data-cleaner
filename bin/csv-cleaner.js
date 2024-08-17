
const { Command } = require('commander');
const CSVDataCleaner = require('../src/index');

const program = new Command();

program
  .version('1.0.0')
  .description('CLI to clean and preprocess CSV data')
  .option('-i, --input <path>', 'Input CSV file path')
  .option('-o, --output <path>', 'Output CSV file path (optional)')
  .option('-c, --columns <names>', 'Comma-separated list of column names to clean');

program.parse(process.argv);

const options = program.opts();

if (!options.input || !options.columns) {
  console.error('Please provide input path and column names.');
  process.exit(1);
}

const columns = options.columns.split(',').map(name => name.trim());
const cleaner = new CSVDataCleaner(options.input);

cleaner.cleanData(columns).then((data) => {
  const outputPath = options.output || options.input;
  cleaner.writeCSV(data, outputPath);
}).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
