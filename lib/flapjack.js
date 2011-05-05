(function($) {

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

      $list
        .addClass( "flapjack-menu" )
        .menu({
          position: {
            my: 'left top',
            at: 'right top'
          }
        }).hide();

      var menu    = this.menu    = $list.data( 'menu' )

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
          if (!listIsPositioned) {
            listIsPositioned = true;
            $list.position({
              my: 'left top',
              at: 'left bottom',
              of: $controls
            });
          }
          $list.show();
        });
    },

    destroy: function() {
      console.log('destroy', this);
      this.$list   && this.$list.show();
      this.$input  && this.$input.remove();
      this.$button && this.$button.remove();
      this.menu    && this.menu.destroy();
      $.Widget.prototype.destroy.call( this );
    }

  } );

}(this.jQuery));
