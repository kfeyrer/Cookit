var cm = new captureMomentsController();

QUnit.test( "check if captureMomentsController exist", function( assert ) {
  cm.count += 1;

  assert.ok(cm.count === 1, "Passed!" );
});

QUnit.test( "random Recipe", function( assert ) {
    cm.count = 0;
    addIngredient({keycode: 13});
  assert.ok(cm.count === 1, "Passed!" );
});