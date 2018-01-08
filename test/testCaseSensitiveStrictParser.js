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

  it('should parse when specified keys are lower and actual is mixed case', function () {
    let kvParser = new StrictParser(["name"], false);
    let parsed = kvParser.parse("NAme=value");
    expected.NAme = 'value';
    assert.deepEqual(parsed, expected);
  });
});

describe('parse digits and other special chars with case insensitivity',function(){
  beforeEach(function () {
    expected = new Parsed();
  });

  it("should parse when specified keys are in lower case and actual is not and has numbers", function () {
    let kvParser = new StrictParser(["name12"], false);
    expected["NAME12"] = "jayanth";
    let parsed = kvParser.parse("NAME12=jayanth");
    assert.deepEqual(parsed, expected);
  });

  it("should parse when specified keys are not lower case and actual is and has special chars", function () {
    let kvParser = new StrictParser(["Na_me"], false);
    let parsed = kvParser.parse("na_me=value");
    expected.na_me = 'value';
    assert.deepEqual(parsed, expected);
  });

  it('should parse when specified keys are all upper case and actual is not and has numbers and special chars', function () {
    let kvParser = new StrictParser(["NA1M_E"], false);
    let parsed = kvParser.parse("na1m_e=value");
    expected.na1m_e = 'value';
    assert.deepEqual(parsed, expected);
  });
});

describe("strict parser that is case sensitive",function(){
  it("should throw error when specified keys are in lower case and actual is not",function(){
    let kvParser=new StrictParser(["name"],true);
    assert.throws(()=>{
      kvParser.parse("NAME=jayanth");
    })
  });
});
