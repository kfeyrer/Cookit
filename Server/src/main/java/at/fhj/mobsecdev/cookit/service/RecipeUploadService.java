package at.fhj.mobsecdev.cookit.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import at.fhj.mobsecdev.cookit.controller.RecipeUploadController;
import at.fhj.mobsecdev.cookit.converter.DifficultyConverter;
import at.fhj.mobsecdev.cookit.data.FoodRepository;
import at.fhj.mobsecdev.cookit.data.RecipeRepository;
import at.fhj.mobsecdev.cookit.data.UserRepository;
import at.fhj.mobsecdev.cookit.model.Food;
import at.fhj.mobsecdev.cookit.model.Ingredient;
import at.fhj.mobsecdev.cookit.model.Recipe;
import at.fhj.mobsecdev.cookit.model.User;
import at.fhj.mobsecdev.cookit.util.PhotoUploader;

/**
 * Validates and inserts a recipe into the database
 */
@Stateless
public class RecipeUploadService
{
	@Inject
	private EntityManager em;

	@Inject
	private UserRepository userRepository;

	@Inject
	private FoodRepository foodRepository;

	@Inject
	private RecipeRepository recipeRepository;
	
	@Inject
	private PhotoUploader photoUploader;

	public void insertRecipe(RecipeUploadController recipeController,
			String username)
	{
		Recipe recipeToInsert = new Recipe();

		/* Name handling */
		if (recipeController.getName() == null
				|| recipeController.getName() == "")
		{
			throw new IllegalArgumentException("Recipe name is empty");
		}
		recipeToInsert.setName(recipeController.getName());

		/* Cooking instruction handling */
		if (recipeController.getCookingInstruction() == null
				|| recipeController.getCookingInstruction() == "")
		{
			throw new IllegalArgumentException(
					"Recipe cooking instruction is empty");
		}
		recipeToInsert.setCookingInstruction(recipeController
				.getCookingInstruction());

		/* IsVegetarian handling */
		if (!recipeController.getIsVegetarian().equals("true")
				&& !recipeController.getIsVegetarian().equals("false"))
		{
			throw new IllegalArgumentException(
					"Recipe isVegetarian must be either 'true' or 'false'");
		}
		recipeToInsert.setVegetarian(Boolean.parseBoolean(recipeController
				.getIsVegetarian()));

		/* Difficulty handling */
		if (recipeController.getDifficulty() == null
				|| recipeController.getDifficulty() == "")
		{
			throw new IllegalArgumentException("Recipe difficulty is empty");
		}
		recipeToInsert.setDifficulty(DifficultyConverter
				.convertFromString(recipeController.getDifficulty()));

		/* Owner handling */
		List<Long> ownerId = userRepository.findIdByName(username);
		User owner = userRepository.findById(ownerId.get(0));
		recipeToInsert.setOwner(owner);
		
		/* Check if owner has already uploaded recipe with that name */
		List<Recipe> recipesWithThatNameForOwner = recipeRepository.findByNameAndOwner(recipeToInsert.getName(), owner.getId());
		if(recipesWithThatNameForOwner.size() != 0) {
			throw new IllegalArgumentException("You have already uploaded a recipe with that name");
		}

		/* Image handling */
		String filePath = photoUploader.uploadAndCreateThumbnail(
				recipeController.getImage(), "JPG");
		recipeToInsert.setImageFilePath(filePath);

		/* Ingredient handling */
		List<Ingredient> ingredients = null;
		try
		{
			ingredients = parseIngredients(recipeController.getIngredients());
		}
		catch (JSONException ex)
		{
			throw new IllegalArgumentException("Could not parse ingredients",
					ex);
		}

		List<Ingredient> ingredientList = new ArrayList<Ingredient>();
		
		/* Validate if there are any duplicate ingredients */
		Set<String> duplicateNameCheck = new LinkedHashSet<String>();
		for(Ingredient i : ingredients) {
			if(!duplicateNameCheck.add(i.getFood().getName())) {
				throw new IllegalArgumentException("Ingredients list does contain duplicates");
			}
		}
		
		/* Load or add ingredients from/into the database */
		for (Ingredient ingredient : ingredients)
		{
			String foodName = ingredient.getFood().getName();
			Food foodInDb = foodRepository.findByName(foodName);

			if (foodInDb == null)
			{
				foodInDb = new Food();
				foodInDb.setName(foodName);
				em.persist(foodInDb);
			}

			ingredient.setRecipe(recipeToInsert);
			ingredient.setFood(foodInDb);

			ingredientList.add(ingredient);
		}
		recipeToInsert.setIngredients(ingredientList);

		em.persist(recipeToInsert);
	}

	/**
	 * Parse JSON ingredient string into actual list of ingredients
	 * @param jsonString the raw json string
	 * @return list of ingredients
	 * @throws JSONException if JSON string is malformed
	 */
	private List<Ingredient> parseIngredients(String jsonString)
			throws JSONException
	{

		List<Ingredient> ingredientsList = new ArrayList<Ingredient>();
		JSONArray ingredientsArray = new JSONArray(jsonString);

		for (int i = 0; i < ingredientsArray.length(); i++)
		{
			final JSONObject jsonIngredient = ingredientsArray.getJSONObject(i);

			Ingredient ingredient = new Ingredient();
			ingredient.setAmount(jsonIngredient.getString("amount"));
			final Food food = new Food();
			food.setName(jsonIngredient.getString("ingredient"));
			ingredient.setFood(food);

			ingredientsList.add(ingredient);
		}

		return ingredientsList;
	}
}
