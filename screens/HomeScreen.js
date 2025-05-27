import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet,ActivityIndicator,Text,ImageBackground } from 'react-native';
import { api } from '../utils/api';
import CategoryTile from '../components/CategoryTile';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MyContext } from '../navigation/Context';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
   const { user, setUser, logout } = useContext(MyContext);   
  useEffect(() => {
    api.get('/products/categories?per_page=100')
      .then(res => {
        const filtered = res.data.filter(cat => cat.count > 0);
        setCategories(filtered);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>

 
     
    <FlatList
    ListHeaderComponent = {<View style={styles.FlatListHeader}><ImageBackground style={styles.imageBackground} source={require('../assets/rassr.png')} resizeMode="cover" >
    <Text style={styles.TextHeader}>Рассрочка без переплат до 6 месяцев</Text>
    </ImageBackground>
  </View>}
      contentContainerStyle={styles.listContainer}
      data={categories}
      numColumns={2}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Animated.View entering={FadeInDown} style={styles.animatedWrap}>
          <CategoryTile
            category={item}
            onPress={() => navigation.navigate('Catalog', { categoryId: item.id })}
          />
        </Animated.View>
      )}
    />
       {categories.length==0 && (
     <ActivityIndicator style={{marginTop:50}} size="large" color="#FF0000" />
          )
          }
    </>
  );
}

const styles = StyleSheet.create({
  TextHeader: {
   color:'white',
   fontSize:18,
   backgroundColor:'#F00',
   width:'100%',
   textAlign:'center'
  },
  FlatListHeader: {
paddingBottom:10,
  },
  imageBackground: {
    width: '100%',
    height: '150',
    justifyContent: 'center',
    justifyContent: 'flex-end',
    textAlign:'center',
    alignContent:'center',
   alignItems:'center',

   
},
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
  animatedWrap: {
    flex: 1,
    margin: 5,
    maxWidth: '50%',
  },
});
