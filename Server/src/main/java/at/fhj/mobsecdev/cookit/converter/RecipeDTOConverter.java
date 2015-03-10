package at.fhj.mobsecdev.cookit.converter;

import java.util.ArrayList;
import java.util.List;

import at.fhj.mobsecdev.cookit.dto.RecipeDTO;
import at.fhj.mobsecdev.cookit.model.Recipe;

/**
 * Converter between Recipe and RecipeDTO
 */
public class RecipeDTOConverter implements DTOConverter<RecipeDTO, Recipe> {

	@Override
	public RecipeDTO convertToDto(final Recipe entity) {
		RecipeDTO recipeDto = new RecipeDTO();
		recipeDto.setCookingInstruction(entity.getCookingInstruction());
		recipeDto.setDifficulty(DifficultyConverter.convertFromInt(entity.getDifficulty()));
		recipeDto.setImageFilePath(entity.getImageFilePath());
		recipeDto.setName(entity.getName());
		recipeDto.setVegetarian(entity.isVegetarian());
		recipeDto.setOwnerUsername(entity.getOwner().getUsername());
		recipeDto.setIngredients(new IngredientDTOConverter().convertToDto(entity.getIngredients()));
		
		
		return recipeDto;
	}

	@Override
	public List<RecipeDTO> convertToDto(List<Recipe> entities) {
		List<RecipeDTO> recipeDtos = new ArrayList<RecipeDTO>();
		for(Recipe entity : entities)
		{
			recipeDtos.add(convertToDto(entity));
		}
		
		return recipeDtos;
	}

}
