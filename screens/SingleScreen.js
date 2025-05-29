// screens/SingleScreen.js
import React from 'react';
import { View, Text, ScrollView, Image,Dimensions } from 'react-native';

export default function SingleScreen({ route }) {
  const { post } = route.params;
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
const screenWidth = Dimensions.get('window').width;
  return (
    <ScrollView style={{ backgroundColor: '#191B22', padding: 0, }}>
      {image && <Image source={{ uri: image }} style={{
    width: screenWidth,
    height: undefined,
    aspectRatio: 1, // квадратное изображение
  }}
  resizeMode="contain" />}
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 16 ,padding:14}}>{post.title.rendered}</Text>
      <Text style={{ color: '#ccc', marginTop: 12, lineHeight: 24,paddingBottom:60, padding:14}}>
        {post.content.rendered.replace(/<[^>]+>/g, '')}
      </Text>
    </ScrollView>
  );
}
