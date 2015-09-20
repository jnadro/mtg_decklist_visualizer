function Database(name) {
	this.name = name;
	this.storage = localStorage;
}

var itemKey = function(name, key) {
	return name + ":" + key;
}

Database.prototype.clear = function() {
	this.storage.clear();
}

Database.prototype.length = function() {
	return this.storage.length;
}

// Implement a CRUD interface

// Create
Database.prototype.insert = function(key, value) {
	return this.storage.setItem(itemKey(this.name, key), JSON.stringify(value));
};

// Read
Database.prototype.find = function(key) {
	return JSON.parse(this.storage.getItem(itemKey(this.name, key)));
};

// Update
Database.prototype.update = function(key) {

};

// Delete
Database.prototype.delete = function(key) {
	this.storage.removeItem(itemKey(this.name, key));
};
