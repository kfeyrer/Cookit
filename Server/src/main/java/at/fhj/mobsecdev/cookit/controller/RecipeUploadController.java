package at.fhj.mobsecdev.cookit.controller;

import javax.ws.rs.FormParam;

import org.jboss.resteasy.annotations.providers.multipart.PartType;

/**
 * Controller for uploading a recipe, used at RecipeUploadRestService
 */
public class RecipeUploadController {

	public RecipeUploadController() { }
	
	private String name;
	
	private String cookingInstruction;
	
	private String difficulty;
	
	private String isVegetarian;
	
	private String ownerUsername;
	
	private String ingredients;
	
	private byte[] image;
	
	private String username;

	private String passwordHash;

	public String getName() {
		return name;
	}

	@FormParam("name")
	public void setName(String name) {
		this.name = name;
	}

	public String getCookingInstruction() {
		return cookingInstruction;
	}

	@FormParam("cookingInstruction")
	public void setCookingInstruction(String cookingInstruction) {
		this.cookingInstruction = cookingInstruction;
	}

	public String getDifficulty() {
		return difficulty;
	}

	@FormParam("difficulty")
	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}

	public String getIsVegetarian() {
		return isVegetarian;
	}

	@FormParam("isVegetarian")
	public void setIsVegetarian(String isVegetarian) {
		this.isVegetarian = isVegetarian;
	}

	public String getOwnerUsername() {
		return ownerUsername;
	}
	
	@FormParam("ownerUsername")
	public void setOwnerUsername(String ownerUsername) {
		this.ownerUsername = ownerUsername;
	}

	public String getIngredients() {
		return ingredients;
	}

	@FormParam("ingredients")
	public void setIngredients(String ingredients) {
		this.ingredients = ingredients;
	}

	public byte[] getImage() {
		return image;
	}

	@FormParam("image")
	@PartType("image/jpeg")
	public void setImage(byte[] image) {
		this.image = image;
	}
	

	public String getUsername() {
		return username;
	}

	@FormParam("username") 
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPasswordHash() {
		return passwordHash;
	}

	@FormParam("passwordHash")
	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}
}
