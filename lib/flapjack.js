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

      var self    = this;
      var $list   = this.$list   = this.element.menu().hide();
      var $input  = this.$input  = $( '<input>', { type: 'text', 'class': 'ui-widget ui-corner-left' } )
        .insertBefore( $list )
        .autocomplete();

      $input.data( "autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
        .data( "item.autocomplete", item )
        .append( "<a>" + item.label + "</a>" )
        .appendTo( ul );
      }

      var $button = this.$button = $( "<button type='button'>&nbsp;</button>" )
        .attr( "tabIndex", -1 )
        .insertAfter( $input )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        })
        .removeClass( "ui-corner-all" )
        .addClass( "ui-corner-right ui-button-icon" );
      var menu    = this.menu    = $list.data( 'menu' );
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
