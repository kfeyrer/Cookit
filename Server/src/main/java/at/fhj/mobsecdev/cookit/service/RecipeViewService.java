package at.fhj.mobsecdev.cookit.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;

import at.fhj.mobsecdev.cookit.converter.RecipeDTOConverter;
import at.fhj.mobsecdev.cookit.data.RecipeRepository;
import at.fhj.mobsecdev.cookit.data.UserRepository;
import at.fhj.mobsecdev.cookit.dto.RecipeDTO;
import at.fhj.mobsecdev.cookit.model.Recipe;

@Stateless
public class RecipeViewService {

	@Inject
	private RecipeRepository recipeRepository;
	
	@Inject
	private UserRepository userRepository;
	
	@Inject
	private RecipeOfTheDayManager rotDManager;
	
	public List<RecipeDTO> getAllByDate(int firstResult, int maxResult)
	{
		List<Recipe> resultList = recipeRepository.findAllOrderedByUploadDate(firstResult, maxResult);
		return convertToDto(resultList);	
	}
	
	public List<RecipeDTO> getAllByOwner(int firstResult, int maxResult, String username)
	{
		List<Long> usersFound = userRepository.findIdByName(username);
		
		/* If nothing was found, return empty list */
		if(usersFound.size() > 1 || usersFound.size() < 1)
		{
			return new ArrayList<RecipeDTO>();
		}
		
		List<Recipe> resultList = recipeRepository.findAllByOwner(firstResult, maxResult, usersFound.get(0));
		return convertToDto(resultList);
	}
	
	public List<RecipeDTO> getAllByName(int firstResult, int maxResult, String searchString)
	{
		List<Recipe> resultList = recipeRepository.findByName(firstResult, maxResult, searchString);
		return convertToDto(resultList);	
	}
	
	public RecipeDTO getRecipeOfTheDay()
	{
		Recipe recipe = rotDManager.getRecipeOfTheDay();
		return convertToDto(recipe);
	}
	
	/* DTO Conversion */
	
	private RecipeDTO convertToDto(Recipe entities)
	{
		RecipeDTOConverter converter = new RecipeDTOConverter();
		return converter.convertToDto(entities);
	}
	
	private List<RecipeDTO> convertToDto(List<Recipe> entities)
	{
		RecipeDTOConverter converter = new RecipeDTOConverter();
		return converter.convertToDto(entities);
	}
}
