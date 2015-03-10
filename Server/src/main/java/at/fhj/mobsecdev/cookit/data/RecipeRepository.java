package at.fhj.mobsecdev.cookit.data;

import java.util.List;

import javax.faces.bean.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import at.fhj.mobsecdev.cookit.model.Recipe;

@ApplicationScoped
public class RecipeRepository {
	
	@Inject
	private EntityManager em;

	public Recipe findById(Long id) {
		return em.find(Recipe.class, id);
	}
	
	@SuppressWarnings("unchecked")
	public List<Recipe> findByName(int firstResult, int maxResult, String searchString) {		
		return (List<Recipe>) em.createQuery("from Recipe r where r.name like CONCAT('%', :name ,'%') order by r.uploadDate").setParameter("name", searchString).setFirstResult(firstResult).setMaxResults(maxResult).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Recipe> findByNameAndOwner(String searchString, Long ownerId) {	
		return (List<Recipe>) em.createQuery("from Recipe r where r.name = :name and r.owner.id = :owner_id order by r.uploadDate")
				.setParameter("name", searchString)
				.setParameter("owner_id", ownerId)
				.getResultList();
	}
	
	public List<Recipe> findAllOrderedByUploadDate(int firstResult, int maxResult)
	{
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<Recipe> criteria = cb.createQuery(Recipe.class);
		Root<Recipe> recipe = criteria.from(Recipe.class);
		
		criteria
			.select(recipe)
			.orderBy(cb.desc(recipe.get("uploadDate")));
		TypedQuery<Recipe> query = em.createQuery(criteria);
		query.setFirstResult(firstResult);
		query.setMaxResults(maxResult);
		
		recipe.join("ingredients");
		
		return query.getResultList();
	}
	
	public List<Recipe> findAllByOwner(int firstResult, int maxResult, Long ownerId)
	{
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<Recipe> criteria = cb.createQuery(Recipe.class);
		Root<Recipe> recipe = criteria.from(Recipe.class);
		
		criteria
			.select(recipe)
			.where(cb.equal(recipe.get("owner"), ownerId))
			.orderBy(cb.desc(recipe.get("uploadDate")));
		TypedQuery<Recipe> query = em.createQuery(criteria);
		query.setFirstResult(firstResult);
		query.setMaxResults(maxResult);
		
		recipe.join("ingredients");
		
		return query.getResultList();		
	}
	
	public Recipe findRandomRecipe()
	{
		return (Recipe) em.createQuery("from Recipe r order by rand()").setMaxResults(1).getSingleResult();
	}
}
