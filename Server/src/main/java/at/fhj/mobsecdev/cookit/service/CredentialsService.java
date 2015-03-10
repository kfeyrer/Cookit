package at.fhj.mobsecdev.cookit.service;

import java.util.List;

import javax.faces.bean.ApplicationScoped;
import javax.inject.Inject;

import at.fhj.mobsecdev.cookit.data.UserRepository;
import at.fhj.mobsecdev.cookit.model.User;
import at.fhj.mobsecdev.cookit.util.HashingUtils;

/**
 * Service to validate credentials
 */
@ApplicationScoped
public class CredentialsService
{
	@Inject
	private UserRepository userRepository;
	
	public boolean validateCredentials(String username, String hash)
	{
		/* If no username is provided, always return false */
		if(username == null || username.equals(""))
		{
			return false;
		}
		
		/* If user wasn't found, return false */
		List<Long> usersFound = userRepository.findIdByName(username);
		if(usersFound.size() > 1 || usersFound.size() < 1)
		{
			return false;
		}
		
		/* Get user for user_id */
		User user = userRepository.findById(usersFound.get(0));
		
		/* Do actual credentials check */
		return HashingUtils.isHashValid(user, hash);
	}
}
