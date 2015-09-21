var testObj = {
      name: "Lorem Ipsum",
      number: 101.1
    };

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
  // Clear local storage before each test
  window.localStorage.clear();
  console.log("Running..." + name);
  testFunc();
}

test("Database Constructor", function() {
  var db = new Database("testDatabase");
  assert(db.length() === 0, "Database should be empty upon creation");
});

test("Database Insert", function() {
  var db = new Database("testDatabase");
  var i = db.insert(testObj);
  assert(db.length() === 1, "Database should only contain 1 object.");
  assert(i === 0, "Insert should return the index of the object.");
});

test("Database Find", function() {
  var db = new Database("testDatabase");
  var i = db.insert(testObj);
  var found = db.find(i);
  assert(compareObjects(found, testObj), "Test object equals database object.");
});

test("Database Remove", function() {
  var db = new Database("testDatabase");
  var i = db.insert(testObj);
  db.delete(i);
  assert(db.find(i) === undefined, "Shouldn't be able to find removed object.");
  assert(db.length() === 0, "Database should be empty.");
});

test("Database Clear", function() {
  var db = new Database("testDatabase");
  for (var i = 0; i < 10; i++) {
    db.insert(testObj);
  }
  assert(db.length() === 10, "Database should contain 10 objects.");

  db.clear();
  assert(db.length() === 0, "Database should be empty after a clear.");
});
