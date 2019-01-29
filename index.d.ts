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
	 * @returns Promise<KeyValue>
	 */
	public static extractInfo(pdfPath: string): Promise<KeyValue>;

	/**
	 * Extracts the text from the pdf using the pdf-to-text binary
	 *
	 * Note: requires pdftotext, Tesseract, ImageMagick, and GhostScript to be installed
	 *
	 * @param pdfPath absolute path to the pdf file
	 * @param ExtractTextOptions options, e.g. { pdfToTextArgs: {f: 1, l: 23} }, includes page 1 to 23
	 * @returns Promise<string>
	 */
	public static extractText(pdfPath: string, options?: ExtractTextOptions): Promise<string>;

	/**
	 * Converts a PDF file to its TIFF representation
	 *
	 * @param outDir the desired output directory
	 * @param pdfPath absolute path to the pdf file
	 * @param ExtractTextOptions options, e.g. { pdfToTextArgs: {f: 1, l: 23} }, includes page 1 to 23
	 * @returns Promise<string>
	 */
	public static invokePdfToTiff(
		outDir: string,
		pdfPath: string,
		options?: ExtractTextOptions
	): Promise<string>;

	/**
	 * Performs OCR on an image in order to extract the text
	 *
	 * @param outDir the desired output directory
	 * @param imagePath absolute path to the image file
	 * @param ExtractTextOptions options, e.g. { pdfToTextArgs: {f: 1, l: 23} }, includes page 1 to 23
	 * @returns Promise<string>
	 */
	public static invokeImageOcr(
		outDir: string,
		imagePath: string,
		options?: ExtractTextOptions
	): Promise<string>;
}
