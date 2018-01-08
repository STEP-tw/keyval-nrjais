const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

let contains=function(list,key) {
  return list.find(function(validKey){
    return key==validKey;
  });
}

let containsIgnoreCase = function (list, key) {
  return list.find(function (validKey) {
    return key.toLowerCase() == validKey.toLowerCase();
  });
}

var StrictParseInfo = function (initialParsingFunction, validKeys, caseSensitive) {
  ParseInfo.call(this,initialParsingFunction);
  contains = caseSensitive ? contains : containsIgnoreCase;
  this.validKeys=validKeys;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!contains(this.validKeys,this.currentKey))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
