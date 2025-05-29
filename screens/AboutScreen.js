import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';
const { width } = Dimensions.get('window');
const HEIGHT = 250;
function ShinyButton({ text, onPress, colors = ['#FF00CC', '#3333FF'] }) {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ marginBottom: 16 }}>
      <View style={styles.shinyWrapper}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientBase}
        />
        <Animated.View
          style={[
            styles.gradientShine,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shineLayer}
          />
        </Animated.View>
        <Text style={styles.phoneText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}


export default function AboutScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({ title: 'О нас / Контакты' });
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* 🔝 Фоновое изображение */}
      <View style={styles.topBlock}>
        <ImageBackground
          source={require('../assets/td.jpg')}
          style={styles.bgImage}
          imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>Добро пожаловать в ТД «Электроник»</Text>
            <Text style={styles.sub}>Техника и уют для каждого дома 💡</Text>
          </View>
        </ImageBackground>
      </View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.block}>
        <Text style={styles.paragraph}>
          Уже более 10 лет мы предлагаем широкий выбор бытовой техники, электроники, садовой техники и строительных
          инструментов. Вдохновляем на комфорт, автоматизируем быт и подбираем решение под ваш бюджет.
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.block}>
        <Text style={styles.blockTitle}>🔧 Почему выбирают нас:</Text>
        <Text style={styles.item}>📦 Более 5000 товаров в наличии</Text>
        <Text style={styles.item}>🚚 Доставка по всей Беларуси</Text>
        <Text style={styles.item}>🛠 Официальная гарантия и поддержка</Text>
        <Text style={styles.item}>💳 Рассрочка до 6 месяцев без переплат</Text>
        <Text style={styles.item}>🧠 Консультации от опытных специалистов</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} style={styles.block}>
        <Text style={styles.blockTitle}>🕒 Режим работы</Text>
        <Text style={styles.item}>ПН–ПТ: 10:00–18:00</Text>
        <Text style={styles.item}>СБ–ВС: 10:00–15:00</Text>
      </Animatable.View>
<Animatable.View animation="fadeInUp" delay={800} style={styles.callBlock}>
  <ShinyButton
    text="📞 +375 (29) 289-80-98"
    onPress={() => Linking.openURL('tel:+375292898098')}
    colors={['#FF00CC', '#3333FF']}
  />
  <ShinyButton
    text="📞 +375 (29) 651-90-78"
    onPress={() => Linking.openURL('tel:+375296519078')}
    colors={['#FF5F6D', '#FFC371']}
  />
  <ShinyButton
    text="📞 +375 (15) 956-00-96"
    onPress={() => Linking.openURL('tel:+375159560096')}
    colors={['#1E90FF', '#00BFFF']}
  />
  <Text style={styles.small}>Звоните, с радостью проконсультируем!</Text>
</Animatable.View>


      <Animatable.View animation="fadeInUp" delay={1000} style={styles.block}>
        <Text style={styles.blockTitle}>🏢 Реквизиты</Text>
        <Text style={styles.item}>ЧТУП «ТЕХНОИВЬЕ»</Text>
        <Text style={styles.item}>г. Ивье, ул. Красноармейская, д. 2, каб. 15</Text>
        <Text style={styles.item}>УНП 590191596</Text>
        <Text style={styles.item}>Торговый реестр №333340 от 11.10.2017</Text>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#191B22',
  },
  topBlock: {
    width: '100%',
    height: HEIGHT,
    marginBottom: 20,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  sub: {
    color: '#ddd',
    fontSize: 15,
    marginTop: 6,
  },
  block: {
    backgroundColor: '#23262F',
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 22,
  },
  blockTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    color: '#ccc',
    fontSize: 15.5,
    marginBottom: 6,
  },
  paragraph: {
    color: '#bbb',
    fontSize: 15.5,
    lineHeight: 22,
  },
  callBlock: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: -8,
  },
  phoneBtn: {
    backgroundColor: '#F9227F',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 20,
    overflow: 'hidden',
  },
  small: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 8,
  },
  shinyWrapper: {
  width: '92%',
  borderRadius: 24,
  overflow: 'hidden',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  marginHorizontal: 'auto', paddingLeft:30,paddingRight:30
},
gradientBase: {
  ...StyleSheet.absoluteFillObject,
},
gradientShine: {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '100%',
  opacity: 0.6,
 
},
shineLayer: {
  width: '100%',
  height: '100%',
  
},
phoneText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  zIndex: 2,
},
});
