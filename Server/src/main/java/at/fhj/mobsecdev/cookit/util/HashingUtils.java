package at.fhj.mobsecdev.cookit.util;

import java.util.Calendar;

import org.apache.commons.codec.digest.DigestUtils;

import at.fhj.mobsecdev.cookit.model.User;

public class HashingUtils {
	
	/**
	 * Returns salt for the provided time
	 * @param time the time to salt
	 * @return the salt
	 */
	public static long getSaltForCalendar(Calendar time)
	{
		return  (long)time.get(Calendar.YEAR) * 21 +
				(long)time.get(Calendar.DAY_OF_YEAR) * 17 +
				((long)time.get(Calendar.HOUR) * 101) % 40 +
				((long)time.get(Calendar.MINUTE) * 571) % 12;
	}
	
	/**
	 * Determines, whether hash is valid for a specific user
	 * @param user user that provided the hash
	 * @param hash the hash itself
	 * @return true, if hash is valid
	 */
	public static boolean isHashValid(User user, String hash)
	{
		Calendar currentTimestamp = Calendar.getInstance();
		
		/* Get timestamp from a minute ago, as user could have delievered hash inbetween two minutes */
		Calendar oneMinuteAgoTimestamp = ((Calendar)currentTimestamp.clone());
		oneMinuteAgoTimestamp.set(Calendar.MINUTE, currentTimestamp.get(Calendar.MINUTE) - 1);
		
		String oneMinuteAgoHash = DigestUtils.sha1Hex(user.getUsername() + user.getPasswordHash() + getSaltForCalendar(oneMinuteAgoTimestamp)); //get hash for the one minute ago timestamp
		String currentHash = DigestUtils.sha1Hex(user.getUsername() + user.getPasswordHash() + getSaltForCalendar(currentTimestamp)); //get hash for the current timestamp
		
		/* Check if one of the two hashes is valid with the provided one */
		if(oneMinuteAgoHash.equals(hash) || currentHash.equals(hash))
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}
