package at.fhj.mobsecdev.cookit.rest;

import javax.ejb.EJBException;
import javax.faces.bean.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import at.fhj.mobsecdev.cookit.controller.RecipeUploadController;
import at.fhj.mobsecdev.cookit.service.CredentialsService;
import at.fhj.mobsecdev.cookit.service.RecipeUploadService;

@Path("/upload")
@RequestScoped
public class RecipeUploadRestService {	
	@Inject
	private CredentialsService credentialsService;
	
	@Inject
	private RecipeUploadService recipeUploadService;
	
	@POST
	@Consumes("multipart/form-data")
	public Response uploadRecipe(@MultipartForm RecipeUploadController recipeController)
	{		
		/* Validate credentials */
		if(credentialsService.validateCredentials(recipeController.getUsername(), recipeController.getPasswordHash()) != true)
		{
			return Response.status(400).entity("Credentials inalid").build();
		}
		
		try
		{
			recipeUploadService.insertRecipe(recipeController, recipeController.getUsername());
			return Response.status(200).entity("Upload successful").build();
		}
		catch (EJBException e)
		{
			if(e.getCause().getClass() == IllegalArgumentException.class) {
				return Response.status(400).entity(e.getCause().getMessage()).build();
			} else {
				return Response.status(500).entity("Upload failed for unknown reasons").build();
			}
		}
	}
}
