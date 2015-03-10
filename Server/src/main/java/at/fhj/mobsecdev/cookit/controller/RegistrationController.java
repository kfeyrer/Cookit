package at.fhj.mobsecdev.cookit.controller;

import javax.ws.rs.FormParam;

/**
 * Controller for user registration, used at RegistrationRestService
 */
public class RegistrationController {

	public RegistrationController(){};
	
	public RegistrationController(String username, String password, String email) {
		setUsername(username);
		setPassword(password);
		setEmail(email);
	}
	
	private String username;
	private String password;
	private String email;
	
	public String getUsername() {
		return username;
	}
	
	@FormParam("username")
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}

	@FormParam("password")
	public void setPassword(String password) {
		this.password = password;
	}

	@FormParam("email")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
