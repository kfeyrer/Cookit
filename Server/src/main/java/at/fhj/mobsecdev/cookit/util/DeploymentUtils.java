package at.fhj.mobsecdev.cookit.util;

public class DeploymentUtils {

	/**
	 * Returns the path where the CookIt web app is deployed
	 * @return the path as string
	 */
	public static String getDeploymentPath() {
		return System.getProperty("jboss.server.base.dir") + "/deployments/CookIt.war/";
	}
}
