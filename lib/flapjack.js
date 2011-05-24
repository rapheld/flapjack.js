/*globals document, clearTimeout, setTimeout*/
(function($) {

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
  $.widget( "ui.flapjack", {

    options: {
      renderBackButtons: true,
      backText: 'Back',
      slideDuration: 400 // in milliseconds
    },

    // Initialize an uberCombobox on an unordered list.
    _create: function() {
      var isList = ( /^[ou]l$/i.test( this.element.prop( 'nodeName' ) ) );
      if ( !isList ) {
        throw new Error('Flapjack may only be used on a list element');
      }

      var flapjack  = this;
      var $list     = this.$list = this.element;
      var $controls = this.$controls = $( '<span class="flapjack-controls"></span>' ).insertBefore( $list );
      var $input    = this.$input  = $( '<input>', { type: 'text' } ).appendTo($controls);
      var $button   = this.$button = $( "<button type='button'>&nbsp;</button>" ).appendTo($controls);
      var listIsPositioned = false;

      if (flapjack.options.renderBackButtons) {
        insertBackButtons( $list, flapjack.options.backText );
      }

      $list
        .addClass( "flapjack-menu" )
        .menu({
          position: {          // When a submenu shows up,
            my: 'left top',    // place it
            at: 'right top',   // just to the right
            of: $list          // of the current menu.
          }
        })
        .hide();

      var menu = this.menu = $list.data( 'menu' );

      // don't open submenus on hover:
      menu._startOpening = function() {
        clearTimeout(this.timer);
      };

      // clicking on an item that has a submenu opens it:
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
          if ( ( $list ).is( ":visible" ) ) {
            $list.hide();
            return;
          }
          $( this ).blur();
          $( document ).one( "click", function() {
            $list.hide();
          });

          // Only position the list once. If we reposition every time the
          // button is clicked, the list marches down the page.
          if (!listIsPositioned) {
            listIsPositioned = true;
            $list.position({
              my: 'left top',
              at: 'left bottom',
              of: $controls
            });
          }
          $list.show().focus();
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
