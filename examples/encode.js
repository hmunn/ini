// This is an example of the ini module encode function

// Get the module
var ini_module = require('../ini');
// some_Object value comes from running .decode on test.ini
var some_Object = { 
"o":"p","a with spaces":"b  c"," xa  n          p ":"\"\r\nyoyoyo\r\r\n","[disturbing]":"hey you never know","s":"something",
"s1":"\"something'","s2":"something else","zr":["deedee"],"ar":["one","three","this is included"],"br":"warm","eq"
:"eq=eq","a":{"av":"a val","e":"{ o: p, a: { av: a val, b: { c: { e: \"this [value]\" } } } }","j":"\"{ o: \"p\", a: { av: \"a val\", b: { c: { e: \"this [value]\" } } } }\"",
"[]":"a square?","cr":["four","eight"],"b":{"c":{"e":"1","j":"2"}
}},"x.y.z":{"x.y.z":"xyz","a.b.c":{"a.b.c":"abc","nocomment":"this; this is not a comment","noHashComment":"this# this is not a comment"}}}


console.log("Without Using .Encode():\n" + JSON.stringify(some_Object));
console.log("\n");
console.log('Using .Encode():\n' + ini_module.encode(some_Object));
console.log("\n");
console.log("Using .Encode(), w\\whitespace:\n" + ini_module.encode(some_Object, {whitespace: true}));
console.log("\n");
console.log("Using .Encode(), w\\section headers:\n" + ini_module.encode(some_Object, {section: 'header'}));
console.log("\n");
console.log("Using .Encode(), w\\both options:\n" + ini_module.encode(some_Object, {section: 'Section', whitespace: true}));
console.log("\n");