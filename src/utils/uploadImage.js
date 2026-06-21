import toast from "react-hot-toast";

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    console.log("IMGBB RESPONSE:", data);

    if (data.success) {
      return data.data.display_url;
    } else {
      toast.error(data.error?.message || "Image upload failed");
      return null;
    }
  } catch (err) {
    console.log(err);
    toast.error("Upload error");
    return null;
  }
};
