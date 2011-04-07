describe('A Flapjack', function() {

  var fixture = "";
  var flapjack = null;

  it('should not be able to be built from something other than a select', function() {
    fixture = '<ul id="cheeses>"' +
              '  <li value="12">Brie</option>' +
              '  <li value="27">Camembert</option>' +
              '  <li value="98">Parmesan</option>' +
              '</ul>';
    setFixtures(fixture);
    expect(function() {
      new Flapjack('#cheeses');
    }).toThrow();
  });

  describe('built from a select with options', function() {
    fixture = '<select id="cheeses>"' +
              '  <option value="12">Brie</option>' +
              '  <option value="27">Camembert</option>' +
              '  <option value="98">Parmesan</option>' +
              '</select>';

    beforeEach(function() {
      setFixtures(fixture);
      flapjack = new Flapjack('#cheeses');
    });

    it('should have a leaf for each option', function() {
      expect(flapjack.root[0].text).toEqual('Brie');
      expect(flapjack.root[0].value).toEqual('12');
      expect(flapjack.root[1].text).toEqual('Camembert');
      expect(flapjack.root[1].value).toEqual('27');
      expect(flapjack.root[2].text).toEqual('Parmesan');
      expect(flapjack.root[2].value).toEqual('98');
    });
  });

  describe('built from a select with optgroups', function() {
    fixture = '<select id="cheeses>"' +
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

    it('should have a group for each optgroup', function() {
      expect(flapjack.root[0].text).toEqual('Soft');
      expect(flapjack.root[1].text).toEqual('Hard');
    });

    it('should have a leaf for each option', function() {
      expect(flapjack.root[0][0].text).toEqual('Brie');
      expect(flapjack.root[0][0].value).toEqual('12');
      expect(flapjack.root[0][1].text).toEqual('Camembert');
      expect(flapjack.root[0][1].value).toEqual('27');
      expect(flapjack.root[1][0].text).toEqual('Parmesan');
      expect(flapjack.root[1][0].value).toEqual('98');
    });
  });

  describe('built with a custom parser', function() {
    fixture = '<select id="cheeses>"' +
              '  <option value="12">Soft - Brie</option>' +
              '  <option value="27">Soft - Camembert</option>' +
              '  <option value="98">Hard - Parmesan</option>' +
              '</select>';

    beforeEach(function() {
      setFixtures(fixture);
      flapjack = new Flapjack('#cheeses', { parser: function(fj, $element) {
        var nesting = $element.text().split(' - ');
        var group = fj.findOrCreateGroup(nesting[0]);
        group.add(new Flapjack.Leaf({
          text: nesting[1],
          value: $element.attr('value')
        }));
      }});
    });

    it('should have a group for each optgroup', function() {
      expect(flapjack.root[0].text).toEqual('Soft');
      expect(flapjack.root[1].text).toEqual('Hard');
    });

    it('should have a leaf for each option', function() {
      expect(flapjack.root[0][0].text).toEqual('Brie');
      expect(flapjack.root[0][0].value).toEqual('12');
      expect(flapjack.root[0][1].text).toEqual('Camembert');
      expect(flapjack.root[0][1].value).toEqual('27');
      expect(flapjack.root[1][0].text).toEqual('Parmesan');
      expect(flapjack.root[1][0].value).toEqual('98');
    });
  });

});
