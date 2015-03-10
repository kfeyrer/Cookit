package at.fhj.mobsecdev.cookit.data;

import java.util.List;

import javax.faces.bean.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import at.fhj.mobsecdev.cookit.model.User;

@ApplicationScoped
public class UserRepository {

	@Inject
	private EntityManager em;

	public User findById(Long id) {
		return em.find(User.class, id);
	}
	
	@SuppressWarnings("unchecked")
	public List<Long> findIdByName(String name)
	{
		Query q = em.createQuery("select id from User as u where u.username=?");
		q.setParameter(1, name);
		
		return (List<Long>)q.getResultList();
	}
}
