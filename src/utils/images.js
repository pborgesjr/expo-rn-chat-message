import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/** Function requests permission to the user.
 * 
 * If the user grants permission, the function launches the image library.
 * 
 * If the user cancels the action, the function returns null and pops an alert
 */
export const handleSelectImageFromGallery = async () => {
    const permissionResponse = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permissionResponse.granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to grant permission to access the library to upload images.");
        return null;
      }
    }

    const imageFromLibrary = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if(!imageFromLibrary.cancelled) {
      return imageFromLibrary?.assets[0]?.uri
    }

    return null;
}

/** Function requests permission to the user.
 * 
 * If the user grants permission, the function launches the camera.
 * 
 * If the user cancels the action, the function returns null and pops an alert
 */
export const handleSelectImageFromCameraRoll = async () => {
    const permissionResponse = await ImagePicker.getCameraPermissionsAsync();

    
    if (!permissionResponse.granted) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to grant permission to access the camera to upload images.");
        return null;
    }
  }

    const imageFromCamera = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!imageFromCamera.canceled) {
      return imageFromCamera?.assets[0]?.uri;
    }

    return null;
}