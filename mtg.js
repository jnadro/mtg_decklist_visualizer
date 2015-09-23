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

document.getElementById("deck").setAttribute("placeholder", testCards);

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
    });

    var spans = li.append("span")
        .attr("class", "pull-right");

    // Add an image for each mana symbol on each card.
    spans.selectAll("i")
      .data(function(d, i) { return manaSymbols[i]; })
      .enter().append("i")
      .attr("class", function(d) {
        return "mtg " + convertManaSymbolToClass(d);
      })
      .style("font-size", "16px");
}

function renderDropdown(parent, decks) {
    d3.select(parent)
      .selectAll("option")
      .data(decks)
      .enter().append("option")
      .html(function(d) { return d.name; });
}

var db = new Database("Decks", "name");

function updateUI(deckname, deckliststring) {
  document.getElementById("visualdecklist").innerHTML  = "";
  document.getElementById("decklist").innerHTML = "";
  document.getElementById("deckDatabase").innerHTML = "";

  getJSONCardData(deckliststring, function(jsonDeck) {
    jsonDeck["name"] = deckname;
    // @todo If the deck already exists update it.
    var i = db.insert(jsonDeck);

    // populate with initial data.
    drawDecklist("#visualdecklist", jsonDeck);
    drawDeckList("#decklist", jsonDeck);
    renderDropdown("#deckDatabase", [
    {
      name: "Elves"
    },
    {
      name: "ANT"
    },
    {
      name: "UBRG"
    },
    {
      name: "Grixis Delver"
    },
    {
      name: "Esper Deathblade"
    }]);
  });
}

updateUI("Test CC Deck", testCards);

var btn = document.getElementById("build"),
    deckname = document.getElementById("deckname");

btn.addEventListener("click", function(event) {
  event.preventDefault();
  updateUI(deckname.value || "Temp Name", document.getElementById("deck").value);
});
