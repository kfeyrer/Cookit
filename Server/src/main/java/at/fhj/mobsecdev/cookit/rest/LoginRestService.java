package at.fhj.mobsecdev.cookit.rest;

import javax.faces.bean.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import at.fhj.mobsecdev.cookit.service.CredentialsService;

@Path("/login")
@RequestScoped
public class LoginRestService
{
	@Inject
	private CredentialsService loginService;
	
	@POST
	public Response validateCredentials(@FormParam("username") String username, @FormParam("hash") String hash)
	{
		if(loginService.validateCredentials(username, hash) == true)
		{
			return Response.status(200).entity("Credentials valid.").build();
		}
		else {
			return Response.status(400).entity("Credentials invalid").build();
		}
	}
}
