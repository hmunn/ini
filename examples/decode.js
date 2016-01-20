// This is an example of the ini module decode function

// Get the module
var ini_module = require('../ini');
// Get test.ini file
var file_Scanner = require('fs');
var test_Ini_File = file_Scanner.readFileSync('test.ini', "utf8");

console.log("test.ini file, no .Decode():\n" + test_Ini_File);
console.log("\n");
console.log("test.ini file, with .Decode() applied:\n" + JSON.stringify(ini_module.decode(test_Ini_File)));
console.log("\n");