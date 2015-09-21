/**
 * Provides CRUD interface for a collection of json objects.
 *
 * @author Jason Nadro
 * @license MIT
 * @version 0.1
 */

/**
 * Database is a collection (array) of json objects.
 *
 * @param {string} name - Used to uniquely identify the database.
 * @constructor
 */
function Database(name) {
  // @todo should really make this data private
  this.name = name;
  this.storage = localStorage;

  this.data = JSON.parse(this.storage.getItem(this.name));
  if (this.data === null) {
    this.clear();    
  }
}

/**
 * Clears all entries from the database.
 */
Database.prototype.clear = function() {
  // @todo should really make this data private
  this.data = [];
  this.storage.setItem(this.name, JSON.stringify(this.data));
}

/**
 * Returns the number of objects in the collection.
 *
 * @this {Database}
 * @return {number} - How many objects are in the collection.
 */
Database.prototype.length = function() {
  return this.data.length;
}

// Implement a CRUD interface

/**
 * Implements the C in CRUD by inserting a new object into
 * the collection.
 *
 * @this {Database}
 * @param {object} value - 
 */
Database.prototype.insert = function(value) {
  var i = this.data.push(value) - 1;
  this.storage.setItem(this.name, JSON.stringify(this.data));
  return i;
};

/**
 * Implements the R in CRUD by finding an existing
 * object based on supplied function
 *
 * @this {Database}
 * @param {number} i - Index to find in the array.
 */
Database.prototype.find = function(i) {
  return this.data[i];
};

/**
 * Implements the U in CRUD by updating the item in the
 * collection and saving the collection to localStorage.
 *
 * @this {Database}
 * @param {number} i - Index to update in the array.
 */
Database.prototype.update = function(i) {

};

/**
 * Implements the D in CRUD by removing an item from the 
 * collection and saving the collection to localStorage.
 *
 * @this {Database}
 * @param {number} i - Index to remove from the array.
 */
Database.prototype.delete = function(i) {
  this.data.splice(i, 1);
  this.storage.setItem(this.name, JSON.stringify(this.data));
};
