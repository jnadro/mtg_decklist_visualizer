var testCards =
"1 Lion's Eye Diamond\n" +
"1 Sol Ring\n" +
"1 Winter Orb\n" +
"1 Chimeric Idol\n" +
"1 Masticore\n" +
"1 Karn, Silver Golem\n" +
"1 Mindslaver\n" +
"1 Spine of Ish Sah\n" +
"1 Ugin, the Spirit Dragon\n" +
"1 Darksteel Forge\n" +
"1 Kozilek, Butcher of Truth\n" +
"1 Darksteel Colossus\n" +
"1 Blightsteel Colossus\n" +
"1 Emrakul, the Aeons Torn\n" +
"1 Draco\n" +
"1 Progenitus\n" +
"1 Cruel Ultimatum\n" +
"1 Ashenmoor Liege\n" +
"1 Balefire Liege\n" +
"1 Boartusk Liege\n" +
"1 Creakwood Liege\n" +
"1 Deathbringer Liege\n";

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
    .html(function(d) { return d.name; });

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
                            string = "hybrid-" + string.replace("/", "");
                          }
                          else {
                            string = "mana-" + string;
                          }
                          return string;
                        });

      manaSymbols.push(items);
    });

    // Add an image for each mana symbol on each card.
    li.selectAll("i")
      .data(function(d, i) { return manaSymbols[i]; })
      .enter().append("i")
      .attr("class", function(d) {
        return "mtg " + convertManaSymbolToClass(d);
      })
      .style("font-size", "16px");

    // Add the card count.
    li.append("span")
    .attr("class", "card-count badge pull-left")
    .html(function(d) { return d.count; });
}

function updateUI(deckliststring) {
  document.getElementById("visualdecklist").innerHTML  = "";
  document.getElementById("decklist").innerHTML = "";

  getJSONCardData(deckliststring, function(jsonDeck) {
    // populate with initial data.
    drawDecklist("#visualdecklist", jsonDeck);
    drawDeckList("#decklist", jsonDeck);
  });
}

updateUI(testCards);

var btn  = document.getElementById("build");
btn.addEventListener("click", function(event) {
  event.preventDefault();
  updateUI(document.getElementById("deck").value);
});
