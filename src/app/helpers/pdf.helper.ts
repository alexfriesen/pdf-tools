import {
  decodePDFRawStream,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFRawStream,
  PDFStream,
  PDFString,
} from 'pdf-lib';

export const extractRawAttachments = (pdfDoc: PDFDocument) => {
  if (!pdfDoc.catalog.has(PDFName.of('Names'))) return [];
  const Names = pdfDoc.catalog.lookup(PDFName.of('Names'), PDFDict);

  if (!Names.has(PDFName.of('EmbeddedFiles'))) return [];
  let EmbeddedFiles = Names.lookup(PDFName.of('EmbeddedFiles'), PDFDict);

  if (
    !EmbeddedFiles.has(PDFName.of('Names')) &&
    EmbeddedFiles.has(PDFName.of('Kids'))
  )
    EmbeddedFiles = EmbeddedFiles.lookup(PDFName.of('Kids'), PDFArray).lookup(
      0
    ) as PDFDict;

  if (!EmbeddedFiles.has(PDFName.of('Names'))) return [];
  const EFNames = EmbeddedFiles.lookup(PDFName.of('Names'), PDFArray);

  const rawAttachments = [];
  for (let idx = 0, len = EFNames.size(); idx < len; idx += 2) {
    const fileName = EFNames.lookup(idx) as PDFHexString | PDFString;
    const fileSpec = EFNames.lookup(idx + 1, PDFDict);
    rawAttachments.push({ fileName, fileSpec });
  }

  return rawAttachments;
};

export const extractAttachments = (pdfDoc: PDFDocument) => {
  const rawAttachments = extractRawAttachments(pdfDoc);
  return rawAttachments.map(({ fileName, fileSpec }) => {
    const stream = fileSpec
      .lookup(PDFName.of('EF'), PDFDict)
      .lookup(PDFName.of('F'), PDFStream) as PDFRawStream;

    const description = fileSpec.lookup(PDFName.of('Desc'), PDFString);
    const subtype = stream.dict.lookup(PDFName.of('Subtype'), PDFName);

    return {
      name: fileName.decodeText(),
      description: description.decodeText(),
      mimeType: subtype.decodeText(),
      data: decodePDFRawStream(stream).decode(),
    };
  });
};
