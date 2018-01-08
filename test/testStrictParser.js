const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const chai = require('chai').assert;
const Parsed = require(src('parsed.js'));
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos){
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      throw err;
    return false;
  }
}

const checkErrorThrown = function (fn, args, checker, kvParser) {
  return function(){
    try {
      fn.call(kvParser ,args);
    } catch (err) {
      checker(err);
    }
  }
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    chai.throws(
      checkErrorThrown(kvParser.parse,"age=23",
      invalidKeyErrorChecker("age",5), kvParser))
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected = new Parsed();
    expected.name="john";
    expected.age="23";
    chai.deepOwnInclude(expected,actual);
    chai.throws( 
        checkErrorThrown(kvParser.parse,"color=blue",
      invalidKeyErrorChecker("color",9), kvParser))
  });

  it("should throw an error when one of the keys is not valid",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john color=blue age=23",
      invalidKeyErrorChecker("color",20), kvParser))
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"color   = blue",
      invalidKeyErrorChecker("color",13), kvParser))
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"color   = \"blue\",",
      invalidKeyErrorChecker("color",15), kvParser))
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name = john color    =\"light blue\"",
      invalidKeyErrorChecker("color",33), kvParser))
  });

  it("should throw an error when no valid keys are specified",function(){
    let kvParser=new StrictParser([]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john",
      invalidKeyErrorChecker("name",8), kvParser))
  });

  it("should throw an error when no array is passed",function(){
    let kvParser=new StrictParser();
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john",
      invalidKeyErrorChecker("name",8), kvParser))
  });

});
