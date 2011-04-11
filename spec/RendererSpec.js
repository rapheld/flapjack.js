describe('The Flapjack renderer', function() {

  var flapjack = null;

  describe('by default', function() {

    var fixture = '<div id="cheesesContainer">' +
                  '  <select id="cheeses">' +
                  '    <optgroup label="Soft">' +
                  '      <option value="12">Brie</option>' +
                  '      <option value="27">Camembert</option>' +
                  '    </optgroup>' +
                  '    <optgroup label="Hard">' +
                  '      <option value="98">Parmesan</option>' +
                  '    </optgroup>' +
                  '  </select>' +
                  '</div>';

    beforeEach(function() {
      setFixtures(fixture);
      flapjack = new Flapjack('#cheeses');
    });

    it('should hide the select', function() {
      expect($('#cheeses')).toBeHidden();
    });

    it('should create a search input', function() {
      expect($('#cheesesContainer input[type="search"]').length).toEqual(1);
    });

    it('should create a hidden tree of ordered lists', function() {
      var root = $('#cheesesContainer > ol.flapjack');
      expect(root.length).toEqual(1);
      expect(root).toBeHidden();

      var groups = root.find('> li');
      expect(groups.length).toEqual(2);
      expect(groups.first().find('> a').text()).toEqual('Soft ►');
      expect(groups.last().find('> a').text()).toEqual('Hard ►');

      var softCheeses = root.find('> li').first().find('ol li');
      expect(softCheeses.length).toEqual(2);
      expect(softCheeses.first().text()).toEqual('Brie');
      expect(softCheeses.last().text()).toEqual('Camembert');

      var hardCheeses = root.find('> li').last().find('ol li');
      expect(hardCheeses.length).toEqual(1);
      expect(hardCheeses.first().text()).toEqual('Parmesan');
    });

  });

});
