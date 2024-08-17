## csv-data-cleaner

csv-data-cleaner` is a powerful CLI tool for cleaning and preprocessing CSV data files. It supports various data cleaning tasks including handling missing values, standardizing text, normalizing numeric data, and detecting outliers.

## Installation

To install `csv-data-cleaner`, you need to have Node.js installed. You can then install the package globally using npm:

```bash
npm install -g csv-data-cleaner
```

## Usage

To use `csv-data-cleaner`, run the following command in your terminal:

```bash
csv-cleaner -i input_file.csv -o output_file.csv -c column_names [-f functionality] [options]
```

### Command Options

- `-i, --input <path>`: Path to the input CSV file (required).
- `-o, --output <path>`: Path to the output CSV file (required).
- `-c, --columns <columns>`: Comma-separated list of column names to clean (required).
- `-f, --functions <funcs>`: Comma-separated list of cleaning functions to apply. Options include:
  - `removeMissingValues`
  - `removeDuplicates`
  - `standardizeText`
  - `normalizeNumericData`
  - `detectOutliers`
- `-h, --help`: Show help message.

### Example

Here's an example of how to use the tool to clean a CSV file:

```bash
csv-cleaner -i uncleaned_data.csv -o cleaned_data.csv -c name,age,email,numericColumn \
            -f removeMissingValues,removeDuplicates,standardizeText,normalizeNumericData,detectOutliers
```

This command reads `uncleaned_data.csv`, applies the selected cleaning functions, and writes the cleaned data to `cleaned_data.csv`.

## Functions

### `removeMissingValues()`
Removes rows with missing values in the specified columns.

### `removeDuplicates()`
Removes duplicate rows based on the specified columns.

### `standardizeText()`
Converts text to lowercase and trims whitespace for specified columns.

### `normalizeNumericData()`
Normalizes numeric data to a range between 0 and 1.

### `detectOutliers()`
Removes outliers from numeric data using the Z-score method.

## Development

To contribute to the development of `csv-data-cleaner`, clone the repository and install dependencies:

```bash
git clone https://github.com/shashwatmishraog/csv-data-cleaner
cd csv-data-cleaner
npm install
```

## License

[MIT](https://opensource.org/licenses/MIT)
