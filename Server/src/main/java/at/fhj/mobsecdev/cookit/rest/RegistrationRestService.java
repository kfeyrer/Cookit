package at.fhj.mobsecdev.cookit.rest;

import javax.faces.bean.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import at.fhj.mobsecdev.cookit.controller.RegistrationController;
import at.fhj.mobsecdev.cookit.service.RegistrationService;

@Path("/registration")
@RequestScoped
public class RegistrationRestService {
	
	@Inject
	private RegistrationService registrationService;
	
	private String responseMessage;
	
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response registerUser(@FormParam("username")String username, @FormParam("password") String password, @FormParam("email") String email)
	{	
		try {
			RegistrationController registrationController = new RegistrationController(username, password, email);
			responseMessage = registrationService.createUser(registrationController);
			
			if(responseMessage.equals("Registration was successful"))
			{
				return Response.status(200).entity(responseMessage).build();
			}
			else {
				return Response.status(400).entity(responseMessage).build();
			}
		} catch(Exception e) {
			return Response.status(500).entity("Registration failed for unknown reasons").build();
		}
	}
}
