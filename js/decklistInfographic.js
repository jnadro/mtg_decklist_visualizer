function decklistInfographic() {
  var margin_top = 200, margin_bottom = 20;
  var margin = 20,
      card_w = 223, card_h = 311,
      num_cols = 4;
      card_padding_x = 10,
      card_pile_padding_y = 34;

  var card_pile_h = card_h + 3 * card_pile_padding_y;

  var manaCurveChartSvg = undefined,
      colorPieChartSvg = undefined;

  function svgToImage(svgHtml, callback) {
    var image = new Image();
    image.src = "data:image/svg+xml;base64," + btoa(svgHtml);
    image.onload = callback;
  }
 
  function chart(selection) {
    selection.each(function(data) {
      // number of rows is dependent on how many cards in total we
      // have and how many we can fit in a column.
      var num_rows = Math.ceil(data.cards.length / num_cols);
      var canvas_w = (margin * 2) + (card_w * num_cols) + ((num_cols - 1) * card_padding_x),
          canvas_h =  (margin_top + margin_bottom) + 
                      (card_pile_h * num_rows) + ((num_rows - 1) * card_padding_x);
      
      // precalculate where each card should be drawn to
      var cardLocations = [];
      for (var i = 0; i < data.cards.length; i++) {
        var c = i % num_cols, r = Math.floor(i / num_cols);
        cardLocations[i] = {
          x: (margin + card_w * c) + card_padding_x * c,
          y: (margin_top + card_pile_h * r) + (card_padding_x * r)
        };
      }
      
      // create canvas and context
      var canvas = d3.select(this).append("canvas")
          .attr("width", canvas_w)
          .attr("height", canvas_h)
          .attr("id", "infographic");
      var ctx = canvas.node().getContext("2d");

      // draw the deck name to the canvas
      ctx.font = "48px sans-serif";
      ctx.fillText(data.name, 10, 50);

      // draw svg image to the canvas.
      if (manaCurveChartSvg !== undefined) {
        svgToImage(manaCurveChartSvg, function() {
          ctx.drawImage(this, 0, 50);
        });
      }

      if (colorPieChartSvg !== undefined) {
        svgToImage(colorPieChartSvg, function() {
          ctx.drawImage(this, 300, 50);
        });
      }
      
      var imageLoadCount = 0;
      var images = new Array(data.cards.length);
      
      var drawImagesCallback = function() {
        images.forEach(function(image, i) {
          var p = cardLocations[i];
          // draw the pile of cards
          for (var j = 0; j < data.cards[i].count; j++) {
            ctx.drawImage(image, p.x, p.y + j * card_pile_padding_y);            
          }
        });
      };
      
      // for each unique card in the deck fetch its image.
      data.cards.forEach(function(card, i) {
        images[i] = new Image();
        images[i].src = card.gathererURL;
        images[i].onload = function() {
          // draw all the images once we load the last one.
          if (++imageLoadCount === images.length) { drawImagesCallback(); }
        }
      });
      
    });
  }

  chart.manaCurve = function(manaCurveSvg) {
    manaCurveChartSvg = manaCurveSvg;
    return chart;
  }

  chart.colorPie = function(colorPieSvg) {
    colorPieChartSvg = colorPieSvg;
    return chart;
  }

  return chart;
}