package at.fhj.mobsecdev.cookit.converter;

import java.util.ArrayList;
import java.util.List;

import at.fhj.mobsecdev.cookit.dto.IngredientDTO;
import at.fhj.mobsecdev.cookit.model.Ingredient;

/**
 * Converter between Ingredient and IngredientDTO
 */
public class IngredientDTOConverter implements DTOConverter<IngredientDTO, Ingredient> {

	@Override
	public IngredientDTO convertToDto(final Ingredient entity) {
		IngredientDTO ingredientDto = new IngredientDTO();
		ingredientDto.setFood(entity.getFood().getName());
		ingredientDto.setAmount(entity.getAmount());
		
		return ingredientDto;
	}

	@Override
	public List<IngredientDTO> convertToDto(List<Ingredient> entities) {
		List<IngredientDTO> ingredientDtos = new ArrayList<IngredientDTO>();
		for(Ingredient entity : entities)
		{
			ingredientDtos.add(convertToDto(entity));
		}
		
		return ingredientDtos;
	}

}
