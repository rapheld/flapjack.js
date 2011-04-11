// I'm not sure about this behavior yet, so it's in an xdescribe block.
xdescribe('A Flapjack', function() {

  var fixture = '<select id="cheeses">' +
                '  <optgroup label="Soft">' +
                '    <option value="12">Brie</option>' +
                '    <option value="27">Camembert</option>' +
                '  </optgroup>' +
                '  <optgroup label="Hard">' +
                '    <option value="98">Parmesan</option>' +
                '</select>';
  var flapjack = null;

  beforeEach(function() {
    setFixtures(fixture);
    flapjack = new Flapjack('#cheeses');
  });

  it('should add a leaf when append.flapjack is triggered on its select', function() {
    var pecorino = $('<option value="493">Pecorino</option>');
    flapjack.$select
      .append(pecorino)
      .trigger('append.flapjack', pecorino);
    expect(flapjack.length).toEqual(1);
    expect(flapjack[0].text).toEqual('Pecorino');
  });

  it('should add a leaf when append.flapjack is triggered on an optgroup', function() {
    var pecorino = $('<option value="493">Pecorino</option>');
    $('optgroup[label="Hard"]')
      .append(pecorino)
      .trigger('append.flapjack', pecorino);
    var group = flapjack.findOrCreateGroup('Hard');
    expect(group.length).toEqual(2);
    expect(group[1].text).toEqual('Pecorino');
  });

  it('should add a group when append.flapjack is triggered on its select', function() {
    var crumbly = $('<optgroup label="Crumbly"><option value="224">Feta</option></optgroup>');
    flapjack.$select
      .append(crumbly)
      .trigger('append.flapjack', crumbly);
    expect(flapjack.length).toEqual(3);
    var group = flapjack.findOrCreateGroup('Crumbly');
    expect(group.length).toEqual(1);
    expect(group[0].text).toEqual('Feta');
  });

});
