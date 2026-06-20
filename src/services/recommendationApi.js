import mockRecommendation from "../data/mockRecommendation";

export async function getImageRecommendations(imageFile) {
  console.log("Mock analyzing image:", imageFile.name);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecommendation);
    }, 1200);
  });
}