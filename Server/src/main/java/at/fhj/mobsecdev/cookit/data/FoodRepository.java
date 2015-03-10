package at.fhj.mobsecdev.cookit.data;

import java.util.List;

import javax.faces.bean.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import at.fhj.mobsecdev.cookit.model.Food;

@ApplicationScoped
public class FoodRepository
{
	@Inject
	private EntityManager em;

	public Food findById(Long id)
	{
		return em.find(Food.class, id);
	}

	public Food findByName(String name)
	{
		Query q = em.createQuery("from Food as f where f.name=?");
		q.setParameter(1, name);
		
		@SuppressWarnings("unchecked")
		List<Food> result = (List<Food>)q.getResultList();
		if(result.size() == 0)
		{
			return null;
		}
		else if(result.size() == 1)
		{
			return result.get(0);
		}
		else
		{
			//Can not happen, as name column has an unique key constraint
			throw new IllegalStateException();
		}
	}
}
