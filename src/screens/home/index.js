
import React, { useEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { saveImageInAsyncStorage, getImagesFromAsyncStorage, getKeysItemsSavedInAsyncStorage } from '../../utils'

const HomeScreen = () =>{

    const [ loading, setLoading ] = useState(false)
    const [ images, setImages ] = useState([])

    useEffect(()=>{

        setLoading(true)

        //we get images from api, download them and then display them or
        // if there are already images store on the phone, we just display them
        const getImages = async () => {

            //we check if images are saved in async storage
            const areImagesSavedInAsyncStorage = (await getKeysItemsSavedInAsyncStorage()).length > 0;

            if(!areImagesSavedInAsyncStorage){

                const images = await (await fetch('https://picsum.photos/v2/list')).json()
            
                for (let i = 0; i < images.slice(0,3).length; i++) {
                    RNFetchBlob.config({
                        path: RNFetchBlob.fs.dirs.DocumentDir + `image_${images[i].id}.png`,
                        fileCache : true,
                        appendExt : 'png'
                    }).fetch('GET', `${images[i].download_url}`)
                    .then((res) => {
                        let status = res.info().status;
            
                        if (status === 200) {
                            let base64Str = res.base64();
                            console.log('The file saved to ', res.path());
                            saveImageInAsyncStorage({path: res.path(), ...images[i]})
                        } 
                    })
                    // Something went wrong:
                    .catch((errorMessage, statusCode) => {
                        // error handling
                        console.log('error saving file', errorMessage);
                    });
                }
                
            }
            
            const pathImagesSavedInAsyncStorage = await getImagesFromAsyncStorage()
            setImages(pathImagesSavedInAsyncStorage)
            setLoading(false)
            
        }

        getImages()


    },[])

    return (
    <View>
        {loading ? <View><Text>Loading...</Text></View> : <View>
            <Text>This is the home </Text>
        </View>}
        
    </View>)
    
}

const styles = StyleSheet.create({
    image: {
      width: 50,
      height: 50,
    },
  });

export default HomeScreen