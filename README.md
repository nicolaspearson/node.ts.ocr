# Node Typescript OCR

A Typescript implementation for PDF / Image OCR (Optical Character Recognition) processing using [Tesseract.js](http://tesseract.projectnaptha.com/).

## Installation

`npm install node-ts-ocr --save`

## Dependencies

After installing node.ts.ocr, the following binaries need to be on your system, as well as in the paths in your environment settings.

### PDF To Text

Many PDF's already have plain text embedded in them, either because they were born-digital (i.e. created from a word processing document) or because OCR was already performed on them. If we are able to extract the text using this utility we do not need to perform image conversion and subsequently OCR.

**OSX**

`pdftotext` is included as part of the `xpdf` utilities library.

```bash
brew install xpdf
```

**Ubuntu**

`pdftotext` is included in the `poppler-utils` library

```bash
sudo apt-get install poppler-utils
```

**CLI Example**

Attempt to extract the text from a PDF:

```bash
pdftotext /path/to/document.pdf output.txt
```

### ImageMagick & Ghostscript

A PDF is a jumble of instructions for how to render a document on a screen or page. Although it may contain images, a PDF is not itself an image, and therefore we can't perform OCR on it directly. To convert PDF's to images, we use [ImageMagick's](https://www.imagemagick.org/) convert function which depends on [Ghostscript](https://www.ghostscript.com/).

**OSX**
```bash
brew install imagemagick
brew install gs
```

**Ubuntu**
```bash
sudo apt-get update
sudo apt-get install imagemagick --fix-missing
sudo apt-get install ghostscript
```

**CLI Example**

Convert a PDF to a TIFF representation:

```bash
convert -density 300 /path/to/document.pdf -depth 8 -strip -background white -alpha off image.tiff
```

Once we have a TIFF representation of the document, we can use Tesseract to (attempt to) extract plain text:

```bash
tesseract image.tiff output.txt
```
_Note this command is only possible if you have installed Tesseract on your OS_

## Usage

The following functions are available

## Docker

You can run this in a docker image as follows