package at.fhj.mobsecdev.cookit.service;

import java.util.Calendar;

import javax.faces.bean.ApplicationScoped;
import javax.inject.Inject;

import at.fhj.mobsecdev.cookit.data.RecipeRepository;
import at.fhj.mobsecdev.cookit.model.Recipe;

/**
 * Returns a new random recipe every day
 */
@ApplicationScoped
public class RecipeOfTheDayManager {

	@Inject
	private RecipeRepository recipeRepository;
	
	private static Recipe recipeOfTheDay;
	private static int currentDayOfYear;
	
	public Recipe getRecipeOfTheDay()
	{
		int currentDayOfYear = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
		
		/* Set recipe on first call and set recipe again when the day changes */
		if(recipeOfTheDay == null || RecipeOfTheDayManager.currentDayOfYear != currentDayOfYear)
		{
			recipeOfTheDay = recipeRepository.findRandomRecipe();
			RecipeOfTheDayManager.currentDayOfYear = currentDayOfYear;
		}
		
		return recipeOfTheDay;
	}
}
