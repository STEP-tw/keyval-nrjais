const src=function(filePath){return "../src/"+filePath};

const assert=require('chai').assert;
const Parsed=require(src('parsed.js'));
const StrictParser=require(src('index.js')).StrictParser;

var expected;

describe("strict parser that is case insensitive",function(){
  beforeEach(function () {
    expected = new Parsed();
  });

  it("should parse when specified keys are in lower case and actual is not",function(){
    let kvParser=new StrictParser(["name"],false);
    expected["NAME"]="jayanth";
    let parsed=kvParser.parse("NAME=jayanth");
    assert.deepEqual(parsed,expected);
  });

  it("should parse when specified keys are not lower case and actual is", function () {
    let kvParser=new StrictParser(["Name"],false);
    let parsed = kvParser.parse("name=value");
    expected.name = 'value';
    assert.deepEqual(parsed, expected);
  });

  it('should parse when specified keys are all upper case and actual is not',function(){
    let kvParser = new StrictParser(["NAME"], false);
    let parsed = kvParser.parse("name=value");
    expected.name = 'value';
    assert.deepEqual(parsed, expected);
  });

  it('should parse when specified keys are mixed case and actual is lower', function () {
    let kvParser = new StrictParser(["NaMe"], false);
    let parsed = kvParser.parse("name=value");
    expected.name = 'value';
    assert.deepEqual(parsed, expected);
  });

  it('should parse when specified keys are mixed case and actual is upper', function () {
    let kvParser = new StrictParser(["NaMe"], false);
    let parsed = kvParser.parse("NAME=value");
    expected.NAME = 'value';
    assert.deepEqual(parsed, expected);
  });

  it('should parse when specified keys are lower and actual is mixed', function () {
    let kvParser = new StrictParser(["name"], false);
    let parsed = kvParser.parse("NAme=value");
    expected.NAme = 'value';
    assert.deepEqual(parsed, expected);
  });
});

describe("strict parser that is case sensitive",function(){
  it("should throw error when specified keys are in lower case and actual is not",function(){
    let kvParser=new StrictParser(["name"],true);
    // true indicates that parser is case sensitive
    assert.throws(()=>{
      kvParser.parse("NAME=jayanth");
    })
  });
});
