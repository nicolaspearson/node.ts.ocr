export interface KeyValue {
	[key: string]: string | number;
}

interface ExtractTextOptions {
	pdfToTextArgs?: KeyValue;
	convertArgs?: KeyValue;
	convertDensity?: number;
	tesseractArgs?: KeyValue;
	tesseractLang?: string;
}

export default class Ocr {
	/**
	 * Retrieve the pdf info using the pdfinfo binary
	 * and parse the result to a key value object.
	 *
	 * Note: requires pdfinfo to be installed
	 *
	 * @param pdfPath absolute path to the pdf file
	 * @returns Promise<KeyValue> the extracted pdf info
	 */
	public static extractInfo(pdfPath: string): Promise<KeyValue>;

	/**
	 * Extracts the text from the pdf using the pdftotext binary
	 *
	 * Note: requires pdftotext, Tesseract, ImageMagick, and GhostScript to be installed
	 *
	 * @param pdfPath absolute path to the pdf file
	 * @param options ExtractTextOptions e.g. { pdfToTextArgs: { f: 1, l: 4 } }, includes page 1 to 4
	 * @returns Promise<string> the text contained in the pdf file
	 */
	public static extractText(pdfPath: string, options?: ExtractTextOptions): Promise<string>;

	/**
	 * Converts a PDF file to its TIFF representation using the convert binary
	 *
	 * Note: requires ImageMagick, and GhostScript to be installed
	 *
	 * @param outDir the desired output directory
	 * @param pdfPath absolute path to the pdf file
	 * @param options ExtractTextOptions e.g. { convertDensity: 600, convertArgs: { trim: '' } }, sets the convert density to 600, and trim to on
	 * @returns Promise<string> the output path of the generated tiff
	 */
	public static invokePdfToTiff(
		outDir: string,
		pdfPath: string,
		options?: ExtractTextOptions
	): Promise<string>;

	/**
	 * Performs OCR on an image in order to extract the text using the tesseract binary
	 *
	 * Note: requires Tesseract to be installed
	 *
	 * @param outDir the desired output directory
	 * @param imagePath absolute path to the image file
	 * @param options ExtractTextOptions e.g. { tesseractLang: 'eng', tesseractArgs: { psm: 6 } }, sets page segmentation mode = 6
	 * @returns Promise<string> the text contained in the image
	 */
	public static invokeImageOcr(
		outDir: string,
		imagePath: string,
		options?: ExtractTextOptions
	): Promise<string>;
}
