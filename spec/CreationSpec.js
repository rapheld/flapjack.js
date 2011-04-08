describe('A Flapjack', function() {

  var flapjack = null;

  describe('for something other than a select', function() {
    var fixture = '<ul id="cheeses">' +
                  '  <li value="12">Brie</option>' +
                  '  <li value="27">Camembert</option>' +
                  '  <li value="98">Parmesan</option>' +
                  '</ul>';

    beforeEach(function() {
      setFixtures(fixture);
    });

    it('should fail', function() {
      expect(function() {
        new Flapjack('#cheeses');
      }).toThrow();
    });
  });

  describe('built from a select with options', function() {
    var fixture = '<select id="cheeses">' +
                  '  <option value="12">Brie</option>' +
                  '  <option value="27">Camembert</option>' +
                  '  <option value="98">Parmesan</option>' +
                  '</select>';

    beforeEach(function() {
      setFixtures(fixture);
      flapjack = new Flapjack('#cheeses');
    });

    it('should have a reference to the select', function() {
      expect(flapjack.$select[0]).toEqual($('#cheeses')[0]);
    });

    it('should have a leaf for each option', function() {
      expect(flapjack[0].text).toEqual('Brie');
      expect(flapjack[0].value).toEqual('12');
      expect(flapjack[1].text).toEqual('Camembert');
      expect(flapjack[1].value).toEqual('27');
      expect(flapjack[2].text).toEqual('Parmesan');
      expect(flapjack[2].value).toEqual('98');
    });

    it('should assign the Flapjack as the parent of the leaves', function() {
      expect(flapjack[0].parent).toEqual(flapjack);
      expect(flapjack[1].parent).toEqual(flapjack);
      expect(flapjack[2].parent).toEqual(flapjack);
    });
  });

  describe('built from a select with optgroups', function() {
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

    it('should have a group for each optgroup', function() {
      expect(flapjack[0].text).toEqual('Soft');
      expect(flapjack[1].text).toEqual('Hard');
    });

    it('should assign the Flapjack as the parent of the top-level groups', function() {
      expect(flapjack[0].parent).toEqual(flapjack);
      expect(flapjack[1].parent).toEqual(flapjack);
    });

    it('should have a leaf for each option', function() {
      expect(flapjack[0][0].text).toEqual('Brie');
      expect(flapjack[0][0].value).toEqual('12');
      expect(flapjack[0][1].text).toEqual('Camembert');
      expect(flapjack[0][1].value).toEqual('27');
      expect(flapjack[1][0].text).toEqual('Parmesan');
      expect(flapjack[1][0].value).toEqual('98');
    });

    it('should assign the proper group as the parent of the leaves', function() {
      expect(flapjack[0][0].parent).toEqual(flapjack[0]);
      expect(flapjack[0][1].parent).toEqual(flapjack[0]);
      expect(flapjack[1][0].parent).toEqual(flapjack[1]);
    });
  });

  describe('built with a custom parser', function() {
    var fixture = '<select id="cheeses">' +
                  '  <option value="12">Soft - Brie</option>' +
                  '  <option value="27">Soft - Camembert</option>' +
                  '  <option value="98">Hard - Parmesan</option>' +
                  '</select>';

    beforeEach(function() {
      setFixtures(fixture);
      flapjack = new Flapjack('#cheeses', { parseSelect: function($select) {
        var fj = this;
        var result = [];
        $select.find('option').each(function() {
          var $element = $(this);
          var nesting = $element.text().split(' - ');
          var group = fj.findOrCreateGroup(nesting[0]);
          group.push(new Flapjack.Leaf({
            text: nesting[1],
            value: $element.attr('value')
          }));
        });
        return result;
      }});
    });

    it('should have a group for each optgroup', function() {
      expect(flapjack[0].text).toEqual('Soft');
      expect(flapjack[1].text).toEqual('Hard');
    });

    it('should have a leaf for each option', function() {
      expect(flapjack[0][0].text).toEqual('Brie');
      expect(flapjack[0][0].value).toEqual('12');
      expect(flapjack[0][1].text).toEqual('Camembert');
      expect(flapjack[0][1].value).toEqual('27');
      expect(flapjack[1][0].text).toEqual('Parmesan');
      expect(flapjack[1][0].value).toEqual('98');
    });
  });

});
