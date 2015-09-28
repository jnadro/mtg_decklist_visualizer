/**
 * @author Jason Nadro
 * @license MIT
 * @version 0.1
 */

'use strict';

var testCards =
"4 Lion's Eye Diamond\n" +
"4 Sol Ring\n" +
"4 Winter Orb\n" +
"4 Chimeric Idol\n" +
"4 Masticore\n" +
"4 Karn, Silver Golem\n" +
"4 Mindslaver\n" +
"4 Spine of Ish Sah\n" +
"4 Ugin, the Spirit Dragon\n" +
"4 Darksteel Forge\n" +
"4 Kozilek, Butcher of Truth\n" +
"4 Darksteel Colossus\n" +
"4 Blightsteel Colossus\n" +
"4 Emrakul, the Aeons Torn\n" +
"4 Draco\n" +
"4 Progenitus\n" +
"4 Cruel Ultimatum\n" +
"4 Thistledown Liege\n" +
"4 Deathbringer Liege\n" +
"4 Glen Elendra Liege\n" +
"4 Mindwrack Liege\n" +
"4 Ashenmoor Liege\n" +
"4 Balefire Liege\n" +
"4 Boartusk Liege\n" +
"4 Creakwood Liege\n" +
"4 Wilt-Leaf Liege\n" +
"4 Murkfiend Liege\n" +
"4 Reaper King\n" +
"4 Apostle's Blessing\n" +
"4 Gitaxian Probe\n" +
"4 Gut Shot\n" +
"4 Vault Skirge\n" +
"4 Birthing Pod";

function drawDecklist(parent, decklist) {
  d3.select(parent)
    .selectAll("div")
      .data(decklist)
    .enter().append("div")
      .attr("class", "pile")
    .selectAll("div")
      .data(function(d, i) {
        var array = [];
        for (var i = 0; i < Math.min(d.count, 4); i++) {
          array.push(d);
        }
        return array;
      })
    .enter().append("div")
      .attr("class", function(d, i) {
        var cardClass = ["first", "second", "third", "fourth"]
        return cardClass[i] + " card";
      })
      .style("background", function(d) {
        return "url(" + d.gathererURL + ")";
      });  
}

function convertManaSymbolToClass(manaSymbol) {
  return manaSymbol.toLowerCase();
}

function getManaSymbolImage(manaSymbol) {
  return manaSymbol + ".png";
}

function drawDeckList(parent, decklist) {

  // Add a list item that contains the name of each card
  // in the decklist.
  var li = d3.select(parent)
    .selectAll("li")
    .data(decklist)
    .enter().append("li")
    .attr("class", "list-group-item")
    .html(function(d) { return d.count + "x " + d.name; });

    // Gather all the mana symbols for each card in the decklist.
    var manaSymbols = [];
    decklist.forEach(function(d, i) {
      if (d.cost !== undefined) {
        var items = d.cost.split("}")
                        // remove beginning bracket "{"
                        .map(function(string) { 
                          return string.slice(1) 
                        })
                        // remove empty strings.
                        .filter(function(string) {
                          return string.length > 0;
                        })
                        // handle hybrid symbols
                        .map(function(string) {
                          var i = string.indexOf("/");
                          if (i > -1) {
                            var hybrid = string.split("/");
                            if (hybrid.length === 2) {
                              // phyrexian mana symbol
                              if (hybrid[1] === "P") {
                                string = "phyrexian-" + hybrid[0];
                              }
                              // hybrid mana symbol (B/R)
                              else {
                                string = "hybrid-" + string.replace("/", "");
                              }
                            }
                          }
                          else {
                            string = "mana-" + string;
                          }
                          return string;
                        });

        manaSymbols.push(items);       
      }
    });

    var spans = li.append("span")
        .attr("class", "pull-right");

    if (manaSymbols.length > 0) {
      // Add an image for each mana symbol on each card.
      spans.selectAll("i")
        .data(function(d, i) { return manaSymbols[i]; })
        .enter().append("i")
        .attr("class", function(d) {
          return "mtg " + convertManaSymbolToClass(d);
        })
        .style("font-size", "16px");     
    }
}

function renderDropdown(parent, decks, selectedIdx) {
    d3.select(parent)
      .selectAll("option")
      .data(decks)
      .enter().append("option")
      .html(function(d) { return d.name; })
      .attr("selected", function(d, i) {
        return i !== selectedIdx ? null : "";
      });
}

/**
 * Given an array containing all the cards in the deck this
 * will return an array containing the count of the Casting Cost
 * of each card in the deck.
 *
 * @param {array} jsonDeck - An array containing a json object
 *                           for each card in the deck.
 * @return {array} manaCurve - Contains a number which is the count for
 *                             each CC.
 */
function calculateManaCurve(jsonDeck) {
  // Hold the count for the CC from 0-7+
  var manaCurve = [0, 0, 0, 0, 0, 0, 0, 0];
  jsonDeck.forEach(function(d, i) {
    // Don't count lands (they would have cmc of 0)
    if (d.types[0] !== "land" && 
        d.cmc !== undefined && 
        d.cmc >= 0) {
      // The last slot in the mana curve counts 
      // cmc >= 7 so anything greater than 7 should
      // just be clamped.
      var i = Math.min(d.cmc, 7);
      manaCurve[i] += (d.count);
    }
  });
  return manaCurve;
}

document.getElementById("deck").setAttribute("placeholder", testCards);
var db = new Database("Decks", "name"),
    manaCurve = manaCurveChart();

/**
 * Given a string containing the count and card names of all the cards in 
 * the deck it will return back the JSON card data from: https://deckbrew.com/api/
 * The json card data adheres to the form defined from: http://mtgjson.com/
 *
 * @param {string} deckname       - The name of the deck which is used as
 *                                  a unique identifier into the database.
 * @param {string} deckliststring - Newline separated list of all the cards
 *                                  in the deck.
 */
function fetchCards(deckname, deckliststring, callback) {
  getJSONCardData(deckliststring, callback);  
}

/**
 * Renders all the UI elements with the given card
 * data.
 *
 * @param {array} jsonDeck - An array containing a json object
 *                           for each card in the deck.
 */
function renderUI(jsonDeck, selectedIdx) {
  document.getElementById("visualdecklist").innerHTML  = "";
  document.getElementById("decklist").innerHTML = "";
  document.getElementById("deckDatabase").innerHTML = "";
  document.getElementById("manaCurve").innerHTML = "";

  drawDecklist("#visualdecklist", jsonDeck);
  drawDeckList("#decklist", jsonDeck);
  renderDropdown("#deckDatabase", db.query(), selectedIdx);

  var manaCurveData = calculateManaCurve(jsonDeck);
  d3.select("#manaCurve")
      .datum(manaCurveData)
      .call(manaCurve);
}

var btn = document.getElementById("build"),
    decknameTxt = document.getElementById("deckname"),
    clearDecksBtn = document.getElementById("clearDecks"),
    deckSelect = document.getElementById("deckDatabase");

var initialDeck = [];
if (db.length() > 0) {
  initialDeck = db.query()[0];
}
renderUI(initialDeck.cards, 0);

deckSelect.addEventListener("change", function(event) {
  var decks = db.query(),
      deckname = this.value;
  if (decks.length > 0) {
    for (var deckIdx = 0; deckIdx < decks.length; deckIdx++) {
      if (deckname === decks[deckIdx].name) {
        renderUI(decks[deckIdx].cards, deckIdx);     
        break;
      }
    }
  }
});

clearDecksBtn.addEventListener("click", function(event) {
  event.preventDefault();
  db.clear();

  // @todo Update the whole UI.
  //renderUI();
});

btn.addEventListener("click", function(event) {
  event.preventDefault();
  var deckname = decknameTxt.value || "Temp Name";
  fetchCards(deckname, document.getElementById("deck").value, function(jsonDeck) {
    // @todo If the deck already exists update it.
    var i = db.insert({
      name: deckname,
      cards: jsonDeck
    });

    renderUI(jsonDeck);
  });
});
