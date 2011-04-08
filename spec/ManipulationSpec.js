describe('A Flapjack', function() {
  var fixture = '<select id="cheeses">' +
                '  <optgroup label="Soft">' +
                '    <option value="12">Brie</option>' +
                '    <option value="27">Camembert</option>' +
                '  </optgroup>' +
                '  <optgroup label="Hard">' +
                '    <option value="98">Parmesan</option>' +
                '</select>';

  beforeEach(function() {
    setFixtures(fixture);
    flapjack = new Flapjack('#cheeses');
  });

  describe('findOrCreateGroup', function() {

    it('should find a group that exists', function() {
      var group = flapjack.findOrCreateGroup('Soft');
      expect(group.length).toEqual(2);
      expect(group[0].text).toEqual('Brie');
    });

    it('should create groups when necessary', function() {
      var numberOfGroupsBefore = flapjack.length;
      var group = flapjack.findOrCreateGroup('Crumbly');
      expect(group).toBeTruthy();
      expect(group.text).toEqual('Crumbly');
      expect(group.parent).toEqual(flapjack);
      expect(flapjack.length).toEqual(numberOfGroupsBefore + 1);
    });

    it('should accept nested group names', function() {
      var group = flapjack.findOrCreateGroup('Hard', 'Crumbly');
      expect(group).toBeTruthy();
      expect(group.text).toEqual('Crumbly');
      expect(group.parent).toEqual(flapjack.findOrCreateGroup('Hard'));
    });

  });
});