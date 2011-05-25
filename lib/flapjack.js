/*globals document, clearTimeout, setTimeout*/
(function($, undefined) {

  // ## Flapjack
  // A jQuery-UI widget that turns an unordered list into a combobox
  // with iOS-style nested menus.
  //
  // ### Requirements
  // An `<ul>` of the following form:
  //
  //     <ul>
  //       <li>
  //         <a>Cats</a>
  //         <ul>
  //           <li><a>Garfield</a></li>
  //           <li><a>Simba</a></li>
  //         </ul>
  //       </li>
  //       <li>
  //         <a>Dogs</a>
  //         <ul>
  //           <li><a>Odie</a></li>
  //           <li><a>Lassie</a></li>
  //         </ul>
  //       </li>
  //     </ul>
  //
  // ### Options
  // The following options can be passed to the `.flapjack()` call:
  //
  //  * `renderBackButtons` -- whether or not to insert back buttons in each
  //    sub-list. Defaults to `true`
  //  * `backText` -- the text to use for the back buttons. Defaults
  //    to "Back".
  //  * `slideDuration` -- the length of time, in milliseconds, it takes
  //    to slide in or out a menu. Defaults to 400.

  // ### Insert Back Buttons
  // The function that inserts back buttons in each nested list.
  // See also `renderBackButtons` and `backText` options, above.
  function insertBackButtons( $list, backText ) {
    $list.find( 'li ul' ).prepend(
      $( '<li>' +
         '  <span class="ui-icon ui-icon-carat-1-w"></span>' +
         '  <a href="#menu-back" class="flapjack-back-link">' +
              backText +
         '  </a>' +
         '</li>'
      ) );
  }

  // ### Default Search function.
  // A search function must take two arguments -- a String term and
  // a Flapjack widget instance -- and return a collection of `<li>`
  // elements to be added to the search results list element. The default
  // implementation looks for leaf nodes (other than "Back" buttons) that
  // have text matching the search term and sorts by the index of the match.
  function defaultSearch( term, flapjack ) {
    return flapjack.$list
            .find( 'li' )
            .not( ':has( ol, ul, .flapjack-back-link )' )
            .map(function( index, li ) {
              return [ li, $(li).text().indexOf( term ) ];
            })
            .filter(function( index, liAndIndexOfTerm ) {
              return liAndIndexOfTerm[1] >= 0;
            })
            .sort(function( firstLiAndIndexOfTerm, secondLiAndIndexOfTerm ) {
              return firstLiAndIndexOfTerm[1] - secondLiAndIndexOfTerm[1];
            })
            .map(function( index, liAndIndexOfTerm ) {
              return liAndIndexOfTerm[0].clone();
            });
  }

  $.widget( "ui.flapjack", {

    options: {
      renderBackButtons: true,
      backText: 'Back',
      slideDuration: 400 // in milliseconds
    },

    _isMenuPositioned: false,

    // ### Flapjack#showMenu
    // Shows the navigable menu.
    //
    // Usage:
    //
    //     $('ul#flapjack').flapjack('showMenu');
    showMenu: function() {
      $( document ).one( "click", function() {
        this.hideMenu();
      });

      // Only position the list once. If we reposition every time the
      // button is clicked, the list marches down the page.
      if ( !this._isMenuPositioned ) {
        this._isMenuPositioned = true;
        this.$list.position({
          my: 'left top',
          at: 'left bottom',
          of: this.$controls
        });
      }
      this.$list.show().focus();
      return this;
    },

    // ### Flapjack#hideMenu
    // Hides the navigable menu.
    //
    // Usage:
    //
    //     $('ul#flapjack').flapjack('hideMenu');
    hideMenu: function() {
      this.$list.hide();
      return this;
    },

    // ### Flapjack.toggleMenu
    // Toggles the visibility of the menu. Accepts an optional argument
    // which is the desired visibility.
    //
    // Usage:
    //
    //     // hide it if it's visible; show it if it's not:
    //     $('ul#flapjack').flapjack('toggleMenu');
    //
    //     // show it if someFunction() evaluates to true; hide it otherwise:
    //     $('ul#flapjack').flapjack('toggleMenu', someFunction());
    toggleMenu: function( desiredVisibility ) {
      if ( desiredVisibility === undefined ) {
        desiredVisibility = !this.$list.is( ':visible' );
      }
      return desiredVisibility ? this.showMenu() : this.hideMenu();
    },

    // Initialize a Flapjack on an unordered list.
    _create: function() {
      var isList = ( /^[ou]l$/i.test( this.element.prop( 'nodeName' ) ) );
      if ( !isList ) {
        throw new Error('Flapjack may only be used on a list element');
      }

      var flapjack  = this;

      // ### Public Properties on the Flapjack widget:
      // `$list` -- the original `<ol>` or `<ul>`
      var $list     = this.$list = this.element;
      // `$controls` -- a `<span>` containing the search `<input>` and combobox `<button>`
      var $controls = this.$controls = $( '<span class="flapjack-controls"></span>' ).insertBefore( $list );
      // `$input` -- the search `<input>`
      var $input    = this.$input  = $( '<input>', { type: 'text' } ).appendTo($controls);
      // `$button` -- the combobox `<button>` that shows the menu
      var $button   = this.$button = $( "<button type='button'>&nbsp;</button>" ).appendTo($controls);

      if (flapjack.options.renderBackButtons) {
        insertBackButtons( $list, flapjack.options.backText );
      }

      $list
        .addClass( "flapjack-menu" )
        .menu({
          // When a submenu shows up, place it just to the right
          // of the current menu. Later, we'll slide it into view.
          position: {
            my: 'left top',
            at: 'right top',
            of: $list
          }
        })
        .hide();

      var menu = this.menu = $list.data( 'menu' );

      // don't open submenus on hover
      menu._startOpening = function() {
        clearTimeout(this.timer);
      };

      // clicking on an item that has a submenu opens it
      menu.select = function( event ){
        var ui = { item: this.active };

        // if you selected "back", go back:
        if ( ui && ui.item && ui.item.find( '> .flapjack-back-link' ).length ) {
          // ui.menu expects the selected item to currently be in-focus:
          menu.focus( event, ui.item );
          if ( menu.left( event ) ) {
            event.stopImmediatePropagation();
          }
          event.preventDefault();
        // if you selected something with children, show the children:
        } else if ( ui && ui.item && ui.item.find( '> ul' ).length ) {
          // ui.menu expects the selected item to currently be in-focus:
          menu.focus( event, ui.item );
          if ( menu.right( event ) ) {
            event.stopImmediatePropagation();
          }
          event.preventDefault();
        // fire a selected event and hide the list:
        } else {
          menu.closeAll();
          $list.hide();
          flapjack._trigger( 'select', event, ui );
        }
      };

      var menuOpenWithoutSliding = menu._open;
      menu._open = function ( submenu ) {
        menuOpenWithoutSliding.call( this, submenu );
        submenu.animate({
          left: 0
        }, flapjack.options.slideDuration);
      };

      menu.left = function (event) {
        var newItem = this.active && this.active.parents("li:not(.ui-menubar-item)").first(),
            self    = this,
            parent;
        if (newItem && newItem.length) {
          parent = this.active.parent();
          parent
            .attr("aria-hidden", "true")
            .attr("aria-expanded", "false")
            .animate({
              left: $list.css('width')
            }, flapjack.options.slideDuration, null, function() {
              parent.hide();
              self.focus(event, newItem);
            });
          return true;
        }
      };

      var downArrow = 40;

      $input.addClass( "ui-widget ui-widget-content ui-corner-left ui-autocomplete-input flapjack-input" );

      $button
        .attr( "tabIndex", -1 )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        })
        .removeClass( "ui-corner-all" )
        .addClass( "ui-corner-right ui-button-icon" )
        .click(function() {
          $( this ).blur();
          flapjack.toggleMenu();
          return false;
        });
    },

    destroy: function() {
      this.$list   && this.$list.show();
      this.$input  && this.$input.remove();
      this.$button && this.$button.remove();
      this.menu    && this.menu.destroy();
      $.Widget.prototype.destroy.call( this );
    }

  } );

}(this.jQuery));
