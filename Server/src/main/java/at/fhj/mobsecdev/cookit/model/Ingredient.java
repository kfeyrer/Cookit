package at.fhj.mobsecdev.cookit.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.codehaus.jackson.annotate.JsonBackReference;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(name="ingredientMaxOncePerRecipe", columnNames={"food_id","recipe_id"}))
public class Ingredient {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
	private Long id = null;
	
	@ManyToOne
	@JsonBackReference //to prevent circular dependencies
	@JoinColumn(referencedColumnName = "id")
	private Recipe recipe;
	
	@ManyToOne
	@JoinColumn(referencedColumnName = "id")
	private Food food;
	
	@Column
	@NotNull
	private String amount;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Recipe getRecipe() {
		return recipe;
	}

	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
	}

	public Food getFood() {
		return food;
	}

	public void setFood(Food food) {
		this.food = food;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}
}
