
import React, { useEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import { saveImageInAsyncStorage, getImagesFromAsyncStorage, getKeysItemsSavedInAsyncStorage } from '../../utils'

const HomeScreen = () =>{

    const [ loading, setLoading ] = useState(false)
    const [ getImages, setGetImages ] = useState(false)
    const [ images, setImages ] = useState([])

    useEffect(()=>{

        setLoading(true)

        //we get images from api, download them and then display them or
        //if there are already images store on the phone, we just display them
        const getImages = async () => {

            //we check if images are saved in async storage
            const areImagesSavedInAsyncStorage = (await getKeysItemsSavedInAsyncStorage()).length > 0;

            if(!areImagesSavedInAsyncStorage){

                const images = await (await fetch('https://picsum.photos/v2/list')).json()
            
                for (let i = 0; i < images.length; i++) {
                    try{
                        const res = await RNFetchBlob.config({
                            path: RNFetchBlob.fs.dirs.DocumentDir + `image_${images[i].id}.png`,
                            fileCache : true,
                            appendExt : 'png'
                        }).fetch('GET', `${images[i].download_url}`)
    
                        let status = res.info().status;
                        if (status === 200) {
                            let base64Str = res.base64();
                            console.log('The file saved to ', res.path(), i);
                            saveImageInAsyncStorage({path: res.path(), ...images[i]})
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                
            }

            const pathImagesSavedInAsyncStorage = await getImagesFromAsyncStorage()
            setImages(pathImagesSavedInAsyncStorage)
            setLoading(false)
            
        }

        getImages()


    },[])

    return (
    <SafeAreaView>
        {loading ? <View><Text>Loading...</Text></View> : 
        <>
            <View>
                <Text>This is the home </Text>
            </View>
            {images.length > 0 && 
                <View>
                    <FlatList
                        data={images}
                        renderItem={({item}) => (
                        <Image 
                            style={styles.image}
                            source={{
                                uri: `file://${item.path}`,
                            }}
                        />)}
                        keyExtractor={item => item.id}
                    />    
                </View>}
        </>
        
        }
      
    </SafeAreaView>)
    
}

const styles = StyleSheet.create({
    image: {
      width: 50,
      height: 50,
    },
  });

export default HomeScreen