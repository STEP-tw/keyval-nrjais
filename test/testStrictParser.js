const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const chai = require('chai').assert;
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return false;
    throw err;
  }
}

const checkErrorThrown = function (fn, args, checker) {
  return () => {
    try {
      fn(args);
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
      invalidKeyErrorChecker("age",5)))
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected={name:"john",age:"23"};
    chai.deepOwnInclude(expected,actual);
    chai.throws(
        checkErrorThrown(kvParser.parse,"color=blue",
      invalidKeyErrorChecker("color",9)))
  });

  it("should throw an error when one of the keys is not valid",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john color=bl,ue age=23",
      invalidKeyErrorChecker("color",20)))
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"color   = blue",
      invalidKeyErrorChecker("color",13)))
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"color   = \"blue\",",
      invalidKeyErrorChecker("color",15)))
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    let kvParser=new StrictParser(["name","age"]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name = john color ,  = \"light blue\"",
      invalidKeyErrorChecker("color",33)))
  });

  it("should throw an error when no valid keys are specified",function(){
    let kvParser=new StrictParser([]);
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john",
      invalidKeyErrorChecker("name",8)))
  });

  it("should throw an error when no array is passed",function(){
    let kvParser=new StrictParser();
    chai.throws(
        checkErrorThrown(kvParser.parse,"name=john",
      invalidKeyErrorChecker("name",8)))
  });

});
