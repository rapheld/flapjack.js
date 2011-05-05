describe('A Flapjack', function() {

  var flapjack = null, // the flapjack widget instance
      menu     = null, // the menu widget instance
      $input   = null, // the search input
      $button  = null, // the combobox button
      $list    = null; // the original <ul>

  describe('for something other than an unordered list', function() {
    var fixture = '<select id="cheeses">' +
                  '  <option value="12">Brie</option>' +
                  '  <option value="27">Camembert</option>' +
                  '  <option value="98">Parmesan</option>' +
                  '</select>';

    beforeEach(function() {
      setFixtures(fixture);
    });

    it('should fail', function() {
      expect(function() {
        $('#cheeses').flapjack();
      }).toThrow();
    });
  });

  describe('built from nested unordered lists', function() {
    var fixture = '<ul id="cheeses">' +
                  '  <li>' +
                  '    <a>Soft</a>' +
                  '    <ul>' +
                  '      <li><a>Brie</a></option>' +
                  '      <li><a>Camembert</a></option>' +
                  '    </ul>'
                  '  <li>' +
                  '    <a>Hard</a>' +
                  '    <ul>' +
                  '      <li><a>Parmesan</a></option>' +
                  '    </ul>' +
                  '  </li>' +
                  '</ul>';

    beforeEach(function() {
      setFixtures(fixture);
      $list    = $('#cheeses').flapjack();
      flapjack = $list.data('flapjack');
      menu     = $list.data('menu');
      $input   = $list.prevAll('input[type="text"]').first();
      $button  = $list.prevAll('button').first();
    });

    it('should have a reference to the list', function() {
      expect(flapjack.$list[0]).toEqual($list[0]);
    });

    it('should hide the list', function() {
      expect($list).not.toBeVisible();
    });

    it('should create a text input', function() {
      expect($input).toBeVisible();
      expect(flapjack.$input[0]).toEqual($input[0]);
    });

    it('should create a button', function() {
      expect($button).toBeVisible();
      expect(flapjack.$button[0]).toEqual($button[0]);
    });
  });

});
