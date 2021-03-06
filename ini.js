// Public Module Methods
exports.parse = exports.decode = decode
exports.stringify = exports.encode = encode
exports.safe = safe
exports.unsafe = unsafe

// Gets end of line character for an os
var eol = process.platform === 'win32' ? '\r\n' : '\n'

/**
 * This method takes an object and encodes it into ini-style formatting. Can be used as .parse
 * 
 * @param {object} object - An object that is to be encoded
 * @param {array} option - An array of options that can be used to provided more
 * detailed formatting: A string to provide a section title, a boolean to provide
 * extra whitespace, etc. 
 * 
 * @return {string} out - A string that is in ini-style formatting
 */
function encode (obj, opt) {
  var children = []
  var out = ''
  
  // check to see if param opt is a string
  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false
    }
  } else {
    opt = opt || {}
    opt.whitespace = opt.whitespace === true
  }
  
  // check to see if whitespace for param opt is true or false
  var separator = opt.whitespace ? ' = ' : '='

  // for each property in the passed in object
  Object.keys(obj).forEach(function (k, _, __) {
    var val = obj[k]
    // if that property is an array
    if (val && Array.isArray(val)) {
      val.forEach(function (item) {
        out += safe(k + '[]') + separator + safe(item) + '\n'
      })
    // if that property is not null and an object
    } else if (val && typeof val === 'object') {
      children.push(k)
    // if that property is anything else
    } else {
      out += safe(k) + separator + safe(val) + eol
    }
  })
  
  if (opt.section && out.length) {
    out = '[' + safe(opt.section) + ']' + eol + out
  }
  // for each object left over from last forEach loop
  children.forEach(function (k, _, __) {
    // split apart the specific object
    var nk = dotSplit(k).join('\\.')
    var section = (opt.section ? opt.section + '.' : '') + nk
    // recursive call passing the smaller part of the object
    var child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace
    })
    // if out and child have a length, end the line
    if (out.length && child.length) {
      out += eol
    }
    out += child
  })
  // return the formatted ini-style string
  return out
}

/**
 * A public method which takes a given string formatted in ini-style and 
 * creates a nested object out of it. can be used as .stringify.
 * 
 * @param {string} str - A string that is in ini-style formatting
 * 
 * @return {object} A nested object which is the result of method processing
 */
function decode (str) {
  var out = {}
  var p = out
  var section = null
  //          section     |key      = value
  var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  var lines = str.split(/[\r\n]+/g)

  lines.forEach(function (line, _, __) {
    // if the line is false or matches the regex, stop
    if (!line || line.match(/^\s*[;#]/)) return
    var match = line.match(re)
    // if the no match, stop
    if (!match) return
    // if match is an array
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      p = out[section] = out[section] || {}
      return
    }
    // process further elements in the array
    var key = unsafe(match[2])
    var value = match[3] ? unsafe((match[4] || '')) : true
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.substring(0, key.length - 2)
      if (!p[key]) {
        p[key] = []
      } else if (!Array.isArray(p[key])) {
        p[key] = [p[key]]
      }
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key])) {
      p[key].push(value)
    } else {
      p[key] = value
    }
  })

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k, _, __) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k])) {
      return false
    }
    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    var parts = dotSplit(k)
    var p = out
    var l = parts.pop()
    var nl = l.replace(/\\\./g, '.')
    // 
    parts.forEach(function (part, _, __) {
      if (!p[part] || typeof p[part] !== 'object') p[part] = {}
      p = p[part]
    })
    if (p === out && nl === l) {
      return false
    }
    p[nl] = out[k]
    return true
  }).forEach(function (del, _, __) {
    // delete the filtered keys
    delete out[del]
  })
  // return the decoded ini-style file as a string
  return out
}

/**
 * An internal method which will split a string on specific characters.
 * 
 * @param {string} str - A string of some value
 * 
 * @return {array} An array of the given string being split apart 
 */
function dotSplit (str) {
  return str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map(function (part) {
    return part.replace(/\1/g, '\\.')
      .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001')
  })
}

/**
 * An internal method that looks at a string and determines 
 * whether or not it is enclosed by '' or "" characters.
 * 
 * @param {string} val - A given string to be checked for quotes
 * 
 * @return {boolean} True if the given param is surrounded by '' or "" characters, else false
 */
function isQuoted (val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

/**
 * This method takes a string and escapes quotes and other special characters.
 * within it.
 * 
 * @param {string} val - A given string passed in by another method
 * 
 * @return {string} This string's special characters will be escaped if any are present
 */
function safe (val) {
  return (typeof val !== 'string' || val.match(/[=\r\n]/) || val.match(/^\[/) ||
    (val.length > 1 && isQuoted(val)) || val !== val.trim()) ? JSON.stringify(val) :
      val.replace(/;/g, '\\;').replace(/#/g, '\\#')
}

/**
 * This method takes a string and unescapes any escaped special characters within it.
 * It returns that unescaped string.
 * 
 * @param {string} val - A given string passed in by another method
 * 
 * @return {string} This string's special characters will be unescaped if any are present
 */
function unsafe (val) {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'") {
      val = val.substr(1, val.length - 2)
    }
    try { val = JSON.parse(val) } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    var esc = false
    var unesc = ''
    for (var i = 0, l = val.length; i < l; i++) {
      var c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1) {
          // build up unesc string
          unesc += c
        } else {
          // build up unesc string
          unesc += '\\' + c
        }
        esc = false
      } else if (';#'.indexOf(c) !== -1) {
        break
      } else if (c === '\\') {
        // esc character found
        esc = true
      } else {
        // build up unesc string
        unesc += c
      }
    }
    if (esc) {
      // build up unesc string
      unesc += '\\'
    }
    // return the builtup unesc string
    return unesc
  }
  // return value out of method
  return val
}
