package at.fhj.mobsecdev.cookit.converter;

/**
 * Converts database values of difficulty (integers) to human-readable ones (strings) and back
 */
public class DifficultyConverter {
	public static String convertFromInt(int difficulty)
	{
		if(difficulty <= 0)
		{
			return "Easy";
		}
		else if(difficulty == 1)
		{
			return "Medium";
		}
		else
		{
			return "Hard";
		}
	}
	
	public static int convertFromString(String difficulty)
	{
		String difficultyLowerCase = difficulty.toLowerCase();
		if(difficultyLowerCase.equals("easy"))
		{
			return 0;
		}
		else if(difficultyLowerCase.equals("hard"))
		{
			return 2;
		}
		else
		{
			return 1;
		}
	}
}
