// This is an example of the ini module unsafe function
'use strict';
// Get the module
var ini_module = require('../ini');

var test_String_One = "\"This is a string.\"";

console.log("Test String One: " + test_String_One);
console.log("With Unsafe: " + ini_module.unsafe(test_String_One));

var test_String_Two = "\nAnother test string for testing.\n";

console.log("Test String One: " + test_String_Two);
console.log("With Unsafe: " + ini_module.unsafe(test_String_Two));