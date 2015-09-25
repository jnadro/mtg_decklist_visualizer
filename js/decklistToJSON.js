/**
 * @author Jason Nadro
 * @license MIT
 * @version 0.1
 */

'use strict';

// Takes a name with characters that aren't URL friendly and replaces them with
// see http://www.w3schools.com/tags/ref_urlencode.asp 
// Replaces spaces with %20
// Replaces apostrophe's with %27
function beautifyNameForURL(cardname) {
  var space = /\s/g,      // globally match all spaces.  not just the first
      apostrophe = /'/g;  // globally match all apostrophe's.
  return cardname.replace(space, "%20").replace(apostrophe, "%27");
}

function cardImageURL(cardname) {
    return "http://gatherer.wizards.com/Handlers/Image.ashx?name=" + beautifyNameForURL(cardname) + "&type=card&.jpg";
}

// Copies over all properties from obj1 into obj2
// overwritting existing properties.
function mergeObject(obj1, obj2) {
  for(var key in obj1) {
    if(obj1.hasOwnProperty(key)) {
      obj2[key] = obj1[key];
    }
  }
  return obj2; 
}

function getJSONCardData(decklistString, callback) {
  decklistToJSON(decklistString, callback);
}

function decklistToJSON(decklistString, callback) {
  var lines = decklistString.split("\n");
  // lines that begin with any number of digits, followed by spaced, followed by any number of non digit characters
  // including apostrophe's and comma's.
  var re = /^(\d*)\s([\D']*)/,
      decklistJSON = [];

  lines.map(function(line) {
    var results = re.exec(line.trim());
    if (results != null) {
      var cardname = results[2];
      decklistJSON.push({
        name: cardname,
        count: parseInt(results[1]),
        gathererURL: cardImageURL(cardname)
      });
    }
  });

  requestCardData(decklistJSON, callback);
}

// This appears to work...
function requestCardData(cards, callback) {
  var limit = cards.length,
      cardData = new Array(limit);

  for (var i = 0; i < cards.length; i++) {

    function dataPayload() {
      // Capture all data we would like to send along with the callback instead
      // of us relying on the variables in the outer scope of this function.
      var card = cards[i],
          index = i;

      function xhrCallback(error, response) {
        if (error) return console.warn(error);
        var responseArray = JSON.parse(response.responseText);
        if (responseArray.length > 0) {
          // only take the item that matches the one we are looking for.
          var cardJSON = responseArray.filter(function(item) {
            return card.name.toLowerCase() === item.name.toLowerCase();
          });

          mergeObject(cardJSON[0], card);
        }
        else {
          console.log("Could not find " + card.name + " in the database.");
        }

        // place the card into the appropiate spot in the array
        // to preserve ordering.
        cardData[index] = card;

        if (--limit === 0) {
          callback(cardData);
        }
      }

      return xhrCallback;
    }

    d3.xhr("https://api.deckbrew.com/mtg/cards?name=" + beautifyNameForURL(cards[i].name), dataPayload());
  }
}
