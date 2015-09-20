var db = new Database("testDB"),
    key = "testObj",
    testObj = {
      number: 101.1,
      name: "Lorem Ipsum",
      boolean: true,
      NULL: null,
      UNDEFINED: undefined,
      array: [1, 2, 3, 4],
      nestedObj: {
        name: "nestedObj",
        number: 42
      }
    };

console.log(testObj);

// this will only work for simple properites
// and if the properties are in the same order.
function compareObjects(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function assert(condition, msg) {
  if (condition) {
    console.log("\tPASSED: " + msg);
    return true;
  } else {
    console.log("\tFAILED: " + msg);
    return false;
  }
}

function test(name, testFunc) {
  console.log("Running..." + name);
  testFunc();
}

// test insert
test("Database Insert", function() {
  db.clear();
  db.insert(key, testObj);
  assert(db.length() === 1, "Database should only contain 1 object.");
});

// test clear
test("Database Clear", function() {
  db.clear();
  for (var i = 0; i < 10; i++) {
    db.insert(key + i, testObj);
  }
  assert(db.length() === 10, "Database should contain 10 objects.");

  db.clear();
  assert(db.length() === 0, "Database should be empty after a clear.");
});

// test find
test("Database Find", function() {
  db.clear();
  db.insert(key, testObj);
  assert(db.length() === 1, "Database should only contain 1 object");
  assert(compareObjects(db.find(key), testObj), "Test object equals database object.");
});

test("Database Remove", function() {
  db.clear();
  
  db.insert(key, testObj);
  assert(compareObjects(db.find(key), testObj), "Should find inserted object.");

  db.delete(key);
  assert(db.find(key) === null, "Shouldn't be able to find removed object.");
});
