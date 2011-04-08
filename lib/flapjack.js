(function($, exports) {

  function Flapjack(selector, options) {
    var $element = $(selector).first();
    if ($element.length === 0 || $element.attr('nodeName').toLowerCase() !== 'select') {
      throw new Error('Flapjack may only be called on a <select>');
    }
  }

  exports.Flapjack = Flapjack;

}(jQuery, this));
