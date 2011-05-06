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
  $.widget( "ui.flapjack", {

    options: {
      backText: 'Back'
    },

    // Initialize an uberCombobox on an unordered list.
    _create: function() {
      var isList = ( /^[ou]l$/i.test( this.element.prop( 'nodeName' ) ) );
      if ( !isList ) {
        throw new Error('Flapjack may only be used on a list element');
      }

      var self      = this;
      var $list     = this.$list = this.element;
      var $controls = this.$controls = $( '<span class="flapjack-controls"></span>' ).insertBefore( $list );
      var $input    = this.$input  = $( '<input>', { type: 'text' } ).appendTo($controls);
      var $button   = this.$button = $( "<button type='button'>&nbsp;</button>" ).appendTo($controls);
      var listIsPositioned = false;

      insertBackButtons( $list, self.options.backText );

      $list
        .addClass( "flapjack-menu" )
        .menu({
          position: {
            my: 'left top',
            at: 'right top',
            of: $list
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

        if ( ui && ui.item && ui.item.find( '> .flapjack-back-link' ).length ) {
          menu.focus( event, ui.item );
          if ( menu.left( event ) ) {
            event.stopImmediatePropagation();
          }
          event.preventDefault();
        } else if ( ui && ui.item && ui.item.find( '> ul' ).length ) {
          menu.focus( event, ui.item );
          if ( menu.right( event ) ) {
            event.stopImmediatePropagation();
          }
          event.preventDefault();
        } else {
          menu.closeAll();
          $list.hide();
          self._trigger( 'select', event, ui );
        }
      };

      var menuOpenWithoutSliding = menu._open;
      menu._open = function ( submenu ) {
        menuOpenWithoutSliding.call( this, submenu );
        submenu.animate({
          left: 0
        }, 200);
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
            }, 200, null, function() {
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
