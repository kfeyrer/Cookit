package at.fhj.mobsecdev.cookit.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import net.coobird.thumbnailator.Thumbnails;

import org.apache.commons.lang3.RandomStringUtils;

/**
 * Uploads a photo to the web server
 */
public class PhotoUploader {
	private final File UPLOAD_DIR = new File(
			DeploymentUtils.getDeploymentPath() + "/resources/photos");

	/**
	 * Stores a photo with a random name and creates a thumbnail for it
	 * @param fileContent the bytestream of the photo
	 * @param fileType the file type of the photo
	 * @return the path where the photo is stored
	 * @throws IllegalArgumentException if something is wrong with the provided photo
	 */
	public String uploadAndCreateThumbnail(byte[] fileContent, String fileType)
			throws IllegalArgumentException {

		File f;
		String fileName;
		do {
			fileName = RandomStringUtils.randomAlphanumeric(8); //generate a random filename for the photo
			f = new File(UPLOAD_DIR, fileName + "." + fileType); //append filetype to random filename
		} while (f.exists());

		try {
			OutputStream fOut = new BufferedOutputStream(new FileOutputStream(
					f.toString())); //Get stream to store photo

			fOut.write(fileContent); //Store photo

			/* Close stream */
			fOut.flush();
			fOut.close();
			
			/* Create thumbnail with prefix 't_'  for photo */
			Thumbnails
					.of(f)
					.size(200, 200)
					.outputFormat(fileType)
					.toFile(new File(UPLOAD_DIR, "t_" + fileName + "."
							+ fileType));
		} catch (Exception e) { //delete file too if something fails
			f.delete();
			throw new IllegalArgumentException();
			
		}

		//Return path for photo
		return fileName + "." + fileType;
	}
}
