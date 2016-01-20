// This is an example of the ini module safe function.

// Get ini module
var ini_module = require('../ini');

var test_String_One = '"This string tests quotes."';
var test_String_Two = '#This string tests the octothorpe and semi-colon;';
var test_String_Three = "\nThis string test the newline and carriage return\r";

console.log("Test Quotes: " + test_String_One);
console.log("Test Quotes With Safe: " + ini_module.safe(test_String_One));
console.log("\n");
console.log("Test Octothorpe and Semi-colon: " + test_String_Two);
console.log("Test Octothorpe and Semi-colon With Safe: " + ini_module.safe(test_String_Two));
console.log("\n");
console.log("Test Carriage Return & Newline: " + test_String_Three);
console.log("Test Carraige Return & Newline With Safe: " + ini_module.safe(test_String_Three));
console.log("\n");