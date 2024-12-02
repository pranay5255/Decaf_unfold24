const path = require("path");

// Disable linting by returning empty commands
const buildNextEslintCommand = (filenames) => [];
const checkTypesNextCommand = () => [];
const buildHardhatEslintCommand = (filenames) => [];

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [],
  "packages/hardhat/**/*.{ts,tsx}": [],
};