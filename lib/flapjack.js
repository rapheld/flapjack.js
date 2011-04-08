(function($, exports) {

  // Utility functions for the individual enumerable objects. Not mixed in
  // to Array.prototype. Enumerables in Flapjack are all wrapped as a
  // jQuery object, which provides `#each(callback)`.
  //
  // **TODO** if this set gets large, replace it with
  // [Underscore](https://github.com/documentcloud/underscore).
  var enumerableMixins = {

    // For each element in this `Array`, call `callback` with the
    // index and the element. Stop iterating if `callback` returns
    // `false`.
    each: function(callback) {
      var i = 0, length = this.length;
      for (; i < length; ++i) {
        if (callback(this[i], i) === false) {
          i = length + 1;
        }
      }
      return this;
    },

    // Find a value in an Array. Returns the first value in the Array for
    // which the `predicate` parameter returns something truthy, or
    // `null` if no such value is found.
    detect: function(predicate) {
      var result = null;
      this.each(function(value) {
        if (predicate(value)) {
          result = value;
          return false;
        }
      });
      return result;
    }
  };

  // Fake version of
  // [Underscore](https://github.com/documentcloud/underscore).
  // Provides collection utilities.
  var _ = function(array) {
    if (!$.isArray(array)) { array = Array.prototype.slice.call(array); }
    return $.extend(array, enumerableMixins);
  };

  // Given a `<select>`, build an Array of `Flapjack.Group` and `Flapjack.Leaf`
  // objects. The default behavior is to build a group for each `<optgroup>`
  // and a leaf for each `<option>`, placing the leaves in groups as
  // indicated in the DOM.
  function buildGroupsAndLeaves($select) {
    var parent = this;
    var result = [];
    $select.find('> optgroup, > option').each(function() {
      var $element = $(this);
      if ($element.attr('nodeName').toLowerCase() === 'optgroup') {
        var group = new Flapjack.Group({
          text: $element.attr('label'),
          parent: parent
        });
        // Nested `<optgroup>`s are forbidden by the HTML spec, but they're
        // not uncommon. We may as well recurse rather than write a
        // separate version that only does leaves.
        group.push.apply(group, buildGroupsAndLeaves.call(group, $element));
        result.push(group);
      } else {
        result.push(new Flapjack.Leaf({
          text:   $element.text(),
          value:  $element.attr('value'),
          parent: parent
        }));
      }
    });
    return result;
  }

  // ## `Flapjack`
  // An enhanced Array of children.
  var Flapjack = function(selector, options) {
    var $element = $(selector).first();
    if ($element.length === 0 || $element.attr('nodeName').toLowerCase() !== 'select') {
      throw new Error('Flapjack may only be called on a <select>');
    }
    this.$select = $element;
    $.extend(this, options);
    // parse the element and push all entries into this:
    this.push.apply(this, this.parseSelect($element));
  };

  Flapjack.prototype = $.extend([], {

    // ### `Flapjack#$select`
    // A reference to the underlying `<select>`.
    $select: null,

    // ### `Flapjack#parseSelect($select)`
    // Parse a `<select>` into an `Array` of `Flapjack.Group`s and
    // `Flapjack.Leaf`s. Takes one argument, the `<select>` as a
    // jQuery node. Called on the `Flapjack` instance.
    parseSelect: buildGroupsAndLeaves,

    // ### `Flapjack#findOrCreateGroup(*names)`
    // Find or create a `Flapjack.Group` by name.
    // Accepts any number of arguments, each of which is the name of a group
    // as a `String`. Treats a list of arguments as a nesting of groups.
    // Thus, `findOrCreateGroup('Produce', 'Cheese', 'Hard')` will find or
    // create three groups, with "Produce" a direct descendant of the
    // Flapjack root, "Cheese" a descendant of "Produce", and "Hard" a
    // descendant of "Cheese."
    findOrCreateGroup: function() {
      var currentContainer = this;
      _(arguments).each(function(name) {
        var group = _(currentContainer).detect(function(g) { return g.text === name && g.isFlapjackGroup; });
        if (!group) {
          group = new Flapjack.Group({ text: name, parent: currentContainer });
          currentContainer.push(group);
        }
        currentContainer = group;
      });
      return currentContainer;
    }

  });

  // ## `Flapjack.Group`
  // An enhanced Array of children.
  Flapjack.Group = function(properties) {
    if (!properties.text) {
      throw new Error('Cannot create a Flapjack Group with empty text');
    }
    $.extend(this, properties);
  };

  Flapjack.Group.prototype = $.extend([], {

    // ### `Flapjack.Leaf#text`
    // The text to be displayed in the dropdown container
    text: null,

    // ### `Flapjack.Group#parent`
    // A pointer to the parent container -- an instance of `Flapjack` or
    // `Flapjack.Group`.
    parent: null,

    // ### `Flapjack.Group#isFlapjackGroup`
    // An easy way to tell if this is an instance of `Flapjack.Group`.
    isFlapjackGroup: true

  });

  Flapjack.Leaf = function(properties) {
    $.extend(this, properties);
  };

  Flapjack.Leaf.prototype = {

    // ### `Flapjack.Leaf#text`
    // The text to be displayed in the dropdown container
    text: null,

    // ### `Flapjack.Leaf#value`
    // The value to be submitted as part of the form when this leaf
    // is selected
    text: null,

    // ### `Flapjack.Leaf#parent`
    // A pointer to the parent container -- an instance of `Flapjack` or
    // `Flapjack.Group`.
    parent: null

  };

  exports.Flapjack = Flapjack;

}(this.jQuery, this));
