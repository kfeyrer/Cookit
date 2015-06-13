var cm = new recipeController();

QUnit.test( "check if recipeController exist", function( assert ) {
  cm.count += 1;

  assert.ok(cm.count === 1, "Passed!" );
});

QUnit.test( "addIngredient count", function( assert ) {
    cm.count = 0;
    addIngredient({keycode: 13});
  assert.ok(cm.count === 1, "Passed!" );
});