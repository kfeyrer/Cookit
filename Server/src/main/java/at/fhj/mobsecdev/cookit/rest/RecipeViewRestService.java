package at.fhj.mobsecdev.cookit.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.faces.bean.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import at.fhj.mobsecdev.cookit.dto.RecipeDTO;
import at.fhj.mobsecdev.cookit.service.RecipeViewService;

@Path("/view")
@RequestScoped
public class RecipeViewRestService {
	
	private final int NUMBEROFRECIPESPERPAGE = 20;
	
	@Inject
	private Logger log;
	
	@Inject
	private RecipeViewService recipeService;

	@GET
	@Path("/date/{page:[0-9][0-9]*}")
	@Produces("application/json")
	public List<RecipeDTO> getRecipesByDate(@PathParam("page") int page, @QueryParam("id") String id) {
		Delimiters delimiters = new Delimiters(page);

		log.info("Access from device with id " + (id == null ? "unknown" : id));
		
		return recipeService.getAllByDate(delimiters.getFirstResult(), delimiters.getMaxResult());
	}
	
	@GET
	@Path("/owner/{owner}/{page:[0-9][0-9]*}")
	@Produces("application/json")
	public List<RecipeDTO>  getRecipesByOwner(@PathParam("owner") String owner, @PathParam("page") int page)
	{
		Delimiters delimiters = new Delimiters(page);

		return recipeService.getAllByOwner(delimiters.getFirstResult(), delimiters.getMaxResult(), owner);
	}
	
	@GET
	@Path("/search/{searchQuery}/{page:[0-9][0-9]*}")
	@Produces("application/json")
	public List<RecipeDTO> getRecipesByDate(@PathParam("searchQuery") String query, @PathParam("page") int page) {
		Delimiters delimiters = new Delimiters(page);

		return recipeService.getAllByName(delimiters.getFirstResult(), delimiters.getMaxResult(), query);
	}
	
	@GET
	@Path("/rotd")
	@Produces("application/json")
	public List<RecipeDTO> getRecipeOfTheDay() {
		/* Return RotD in a list, so that existing parsers can be reused */
		List<RecipeDTO> recipeList = new ArrayList<RecipeDTO>();
		recipeList.add(recipeService.getRecipeOfTheDay());
		
		return recipeList;
	}
	
	private class Delimiters {

		private int firstResult;
		private int maxResult;

		public Delimiters(int page) {
			firstResult = 0;
			maxResult = NUMBEROFRECIPESPERPAGE;

			if (page > 0) {
				firstResult = page * NUMBEROFRECIPESPERPAGE;
				maxResult = firstResult + NUMBEROFRECIPESPERPAGE - 1;
			}
		}

		public int getFirstResult() {
			return firstResult;
		}

		public int getMaxResult() {
			return maxResult;
		}
	}
}
