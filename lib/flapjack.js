(function($, exports) {

  // Given a <select>, build an Array of `Flapjack.Group` and `Flapjack.Leaf`
  // objects. The default behavior is to build a grup for each `<optgroup>`
  // and a leaf for each `<option>`, placing the leaves in groups as
  // indicated in the DOM.
  var buildGroupsAndLeaves = function($select) {
    var result = [];
    $select.find('> optgroup, > option').each(function() {
      var $element = $(this);
      if ($element.attr('nodeName').toLowerCase() === 'optgroup') {
        result.push(new Flapjack.Group({
          text: $element.attr('label'),
          // Nested <optgroup>s are forbidden by the HTML spec, but they're
          // not uncommon. We may as well recurse rather than write a
          // separate version that only does leaves.
          children: buildGroupsAndLeaves($element)
        }));
      } else {
        result.push(new Flapjack.Leaf({
          text:  $element.text(),
          value: $element.attr('value')
        }));
      }
    });
    return result;
  };

  var Flapjack = function(selector, options) {
    var $element = $(selector).first();
    if ($element.length === 0 || $element.attr('nodeName').toLowerCase() !== 'select') {
      throw new Error('Flapjack may only be called on a <select>');
    }
    this.root = buildGroupsAndLeaves($element);
  };

  // An enhanced Array of children.
  Flapjack.Group = function(properties) {
    if (!properties.text) {
      throw new Error('Cannot create a Flapjack Group with empty text');
    }
    var result = properties.children || [];
    result.text = properties.text;
    return result;
  };

  Flapjack.Leaf = function(properties) {
    $.extend(this, properties);
  };

  exports.Flapjack = Flapjack;

}(jQuery, this));
