package at.fhj.mobsecdev.cookit.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.codehaus.jackson.annotate.JsonManagedReference;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(name="recipeNameMaxOncePerUser", columnNames={"name","owner_id"}))
public class Recipe {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
	private Long id = null;
	
	@Column
	@NotNull
	private String name;
	
	@Column
	@NotNull
	private String cookingInstruction; 
	
	@Column
	private int difficulty = 0;
	
	@Column
	private String imageFilePath;
	
	@ManyToOne
	@JoinColumn(referencedColumnName = "id")
	private User owner;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "recipe")
	@JsonManagedReference //to prevent circular dependencies
	private List<Ingredient> ingredients;
	
	private boolean vegetarian;
	
	@Column
	@NotNull
	private Date uploadDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCookingInstruction() {
		return cookingInstruction;
	}

	public void setCookingInstruction(String cookingInstruction) {
		this.cookingInstruction = cookingInstruction;
	}

	public int getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(int difficulty) {
		this.difficulty = difficulty;
	}

	public String getImageFilePath() {
		return imageFilePath;
	}

	public void setImageFilePath(String imageFilePath) {
		this.imageFilePath = imageFilePath;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}
	
	public List<Ingredient> getIngredients() {
		return ingredients;
	}

	public void setIngredients(List<Ingredient> ingredients) {
		this.ingredients = ingredients;
	}

	public boolean isVegetarian() {
		return vegetarian;
	}

	public void setVegetarian(boolean vegetarian) {
		this.vegetarian = vegetarian;
	}
	
	/**
	 * Automatically adds a timestamp when uploading.
	 */
	@PrePersist
	protected void onUpload() {
		uploadDate = new Date();
	}
}
