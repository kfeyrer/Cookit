package at.fhj.mobsecdev.cookit.rest;

import java.util.Calendar;

import javax.faces.bean.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import at.fhj.mobsecdev.cookit.util.HashingUtils;

@Path("/timestamp")
@RequestScoped
public class TimeStampRestService {

	@GET
	public Long getTimeStampSalt() {
		//Return salt of time stamp for this exact minute
		return HashingUtils.getSaltForCalendar(Calendar.getInstance());
	}
}
