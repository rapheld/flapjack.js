(function($, exports) {

  var Flapjack = function(selector, options) {
    var $element = $(selector).first();
    if ($element.length === 0 || $element.attr('nodeName').toLowerCase() !== 'select') {
      throw new Error('Flapjack may only be called on a <select>');
    }
    var root = this.root = [];
    $element.find('option').each(function() {
      var $option = $(this);
      root.push(new Flapjack.Leaf({
        text:  $option.text(),
        value: $option.attr('value')
      }))
    });
  };

  Flapjack.Leaf = function(properties) {
    $.extend(this, properties);
  };

  exports.Flapjack = Flapjack;

}(jQuery, this));
