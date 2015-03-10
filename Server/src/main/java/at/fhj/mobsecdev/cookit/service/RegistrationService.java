package at.fhj.mobsecdev.cookit.service;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.persistence.EntityManager;

import at.fhj.mobsecdev.cookit.controller.RegistrationController;
import at.fhj.mobsecdev.cookit.data.UserRepository;
import at.fhj.mobsecdev.cookit.model.User;

/**
 * Validates and adds new user in the database
 */
@Stateless
public class RegistrationService {
	@Inject
	private EntityManager em;
	
	@Inject
	private UserRepository userRepository;
	
	public String createUser(RegistrationController rc)
	{
		String username = rc.getUsername();
		String hash = rc.getPassword();
		String email = rc.getEmail();
		
		/* Validation */
		if(username == null || username.equals(""))
		{
			return "Username must not be empty";
		} else if(userRepository.findIdByName(username).size() != 0)
		{
			return "Username already exists";
		} else if(hash == null || hash.equals(""))
		{
			return "Password must not be empty";
		} else if(email == null || email.equals("")) {
			return "Email must not be empty";
		} else if(isValidEmailAddress(email) == false)
		{
			return "Not a valid Email Address";
		}

		/* Insert user */
		User userToInsert = new User();
		userToInsert.setUsername(username);
		userToInsert.setPasswordHash(hash);
		userToInsert.setEmail(email);
		
		em.persist(userToInsert);
		
		/* Return positive feedback */
		return "Registration was successful";
	}
	
	/**
	 * Validate email address according to RFC822
	 * @param email the email to validate
	 * @return true, if email is valid
	 */
	private static boolean isValidEmailAddress(String email) {
	   boolean result = true;
	   try {
	      InternetAddress emailAddr = new InternetAddress(email);
	      emailAddr.validate();
	   } catch (AddressException ex) {
	      result = false;
	   }
	   return result;
	}
}
