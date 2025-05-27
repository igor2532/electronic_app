import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, ImageBackground } from 'react-native';

export default function CategoryTile({ category, onPress }) {
     
    return (
        <TouchableOpacity onPress={onPress}  style={styles.tile}>
            {category.image && (
                // <Image source={{ uri: category.image.src }} style={styles.image} />
                <ImageBackground style={styles.imageBackground} source={{ uri: category.image.src }} resizeMode="cover" >
                   <View style= {{margin:'0 auto'}}>
                   <Text style={styles.text}>{category.name}</Text>
                    </View> 
                </ImageBackground>
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        justifyContent: 'flex-end',
       
    },
    tile: {
        aspectRatio: 1,
        width: '100%',
   
       
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
       
        textAlign:'center',
        elevation: 2,
    },
    text: {
        
        alignContent:'center',
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        color: 'white',
        backgroundColor:'black',
        paddingTop:5, 
        paddingBottom:5      
    },
    image: {
        
        width: 64,
        height: 64,
        resizeMode: 'contain',
    },
});
