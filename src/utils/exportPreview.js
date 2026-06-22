import html2canvas from "html2canvas";

export async function exportElementAsPng(element, fileName = "music-preview.png") {
  if (!element) {
    throw new Error("Preview element is not available.");
  }

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    useCORS: true,
    scale: 2
  });

  const imageUrl = canvas.toDataURL("image/png");

  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = fileName;
  downloadLink.click();
}