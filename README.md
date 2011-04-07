## flapjacks.js
### A jQuery-based combobox plus hierarchical navigation

### User Stories

#### Only leaf nodes are selectable:

Sally wants to select ingredients for her shopping list. She clicks the
"ingredients" label, which causes the flapjack text input to gain focus
and a "|" cursor appears.

  * (a) she presses the down key, causing the list of main categories to
    appear and the first entry, "Produce ►", to be highlighted. She
    continues to press the down key until "Pantry ►" is highlighted, at
    which point she presses the right key to open that category. The
    "Pantry" category slides in from the right, and she repeats the
    navigation procedure until she gets to a leaf node, "Flour." Pressing
    enter on "Flour" closes the flapjack box and adds flour to the list of
    ingredients.
  * (b) she clicks on the "▼" in the flapjack header, causing the list
    of main categories to appear with nothing highlighted. She clicks
    "Pantry ►", causing the "Pantry" category to slide in from the right.
    She continues clicking categories (things with ► markers) until she
    gets to a leaf node, "Flour." She clicks "Flour", causing the
    flapjack box to close and flour to be added to the list of ingredients.
  * (c) she clicks on the "▼" in the flapjack header, causing the list of
    main categories to appear with nothing highlighted. She clicks
    "Fish ►" by accident, causing the Fish menu to slide in from the right.
    She then clicks "◀ Main" to go back to the main menu and start over.
  * (d) she doesn't know where flour might be categorized, so she types
    "flour" into the search bar. After she types "flo", a list of matching
    search results drops down. As she continues to type, the list is
    continually refined. She clicks "Flour" from the list, causing the
    flapjack box to close and flour to be added to the list of ingredients.

### Events

Each event passes some subset of the following event data:

    {
      name:             the name of the event,
      flapjack:         the flapjack instance,
      from:             the backing data object that the user navigated away from,
      to:               the backing data object that the user navigated to,
      selected:         the backing data object that the user selected,
      originatingEvent: the browser event that triggered this event
    }

where `from`, `to`, and `selected` are of the following form:

    {
      parent:     the parent node if present,
      text:       the text to display in the list,
      value:      the value used for form submission,
      fullText(): the text to display in the text box when the dropdown closes,
      element:    the DOM node representing this element (likely an `li`)
    }

 * `navigation-up.flapjack` -- triggered when the user moves the selector up
 * `navigation-down.flapjack` -- triggered when the user moves the selector down
 * `navigation-in.flapjack` -- triggered when the user opens a group
 * `navigation-out.flapjack` -- triggered when the user goes back from a group
   to the parent group
 * `search.flapjack` -- triggered on each keypress (optionally after some
   minimum threshold) in the search bar
 * `select.flapjack` -- triggered when the user selects a leaf node
 * `open.flapjack` -- triggered when the menu drops down
 * `close.flapjack` -- triggered when the menu closes (e.g. after a selection
   is made or when the user presses `esc` to cancel)
 * `cancel.flapjack` -- triggered when the user leaves the menu without
   making a selection

### Ideas & Questions

 * only in-list values are allowed; the user cannot select a value
   that is not in the dropdown by typing it into the search box and
   hitting enter
 * Flapjack can only be called on a `select` DOM element (even if it's empty).
   This makes the `select` element itself the medium through which the
   Flapjack instance communicates, which makes it interact well with other
   plugins and jQuery scripts.
 * Have a default renderer, `Flapjack.Renderer`, but allow the user of the
   library to use a different one on a per-instance basis.
 * magnifying glass with down-arrow attached to indicate predefined searches
   (e.g. "recent" or "popular")
 * collection-specific sticky elements that show up at the top of the list
 * when doing a text search, show leaf nodes from *all* hierarchies. How
   should lineage be shown?
 * how to pop back up to the top?
   * clear the search
   * some sort of clear button
   * an "up" or "back" link at each level (incl. the global search results)
 * pluggable back-ends
   * a `select` with `optgroup`s that have links to their parents and
     `option`s for the leaf nodes
   * an arbitrary function
   * a `datalist`
   * an in-browser database query
 * in cases when the non-leaf nodes are themselves selectable, how do you
   differentiate between navigation into the group and selecting the group?
 * if an entry has a `children` value (even if it's an empty `Array`), add
   the "►" marker and treat it as a group. Give the data back-end a chance
   to later fill in the children when it's selected.
 * possible for leaf nodes to have two different text representations:
    * a short version for in the list
    * a longer version to be shown as the selected value when the
      combobox is closed. By default, this is a breadcrumbs version
      ("Category > Subcategory > Value").
 * when a group is selected
   * if `group.children` is an `Array`, render them
   * if `group.children` is a `Function`, call it and render the results.
 * how does an outside script (e.g. periodic poller)
   tell the flapjack instance to refresh a list? Trigger an event that
   the instance listens to? Call a method directly on the instance?

    function checkForNewIngredients() {
      $.ajax({
        ...
        success: function(newIngredient) {
          // either call a method on the flapjack instance:
          $('select#something').data('flapjack').addData(newIngredient);

          // or trigger an event that the flapjack instance observes:
          $('select#something').trigger('data-added.flapjack', newIngredient);
        }
      });
      window.setTimeout(checkForNewIngredients, 1000);
    }