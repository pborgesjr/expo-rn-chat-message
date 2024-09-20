export const uploadImageService = async (formData) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  return data;
};
