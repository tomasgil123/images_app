import AsyncStorage from '@react-native-community/async-storage';

export const saveImageInAsyncStorage = async (image) => {
  //si hay notificaciones tenemos que sumarlas
  
  const keyItem = 'image_' + image.id;
  try {
    await AsyncStorage.setItem(keyItem, JSON.stringify(image));
  } catch (err) {
    console.error(err);
  }
};

export const getKeysItemsSavedInAsyncStorage = async () => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch (e) {
        return [];
    }
    return keys
}

export const getImagesFromAsyncStorage = async (image) => {

    const keys = await getKeysItemsSavedInAsyncStorage()

    let images = []
    
    try{
        const imagesRaw = await AsyncStorage.multiGet(keys)
        for (let i = 0; i < imagesRaw.length; i++) {
            images.push(JSON.parse(imagesRaw[i][1]))    
        }
    }catch(err){
        console.error(err);
    }
    return images
}