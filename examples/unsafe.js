// This is an example of the ini module unsafe function

// Get the module
var ini_module = require('../ini');

var test_String_One = '\"This string tests quotes.\"';
var test_String_Two = '\#This string tests the octothorpe and semi-colon\;';
var test_String_Three = "\nThis string test the newline and carriage return\r";

console.log("Test String Quotes: " + test_String_One);
console.log("With Unsafe: " + ini_module.unsafe(test_String_One));
console.log("\n");
console.log("Test String Octothorpe & Semi-colon: " + test_String_Two);
// expected result will no appear its considered a comment
console.log("With Unsafe: " + ini_module.unsafe(test_String_Two));
console.log("\n");
console.log("Test String Newline and Return: " + test_String_Three);
console.log("With Unsafe: " + ini_module.unsafe(test_String_Three));
console.log("\n");