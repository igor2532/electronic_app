import React, { useContext } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import AuthComponent from '../screens/AuthComponent';
import { TouchableOpacity, View, Text, StyleSheet, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyContext } from '../navigation/Context';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// -------------------- ICONS --------------------

const IconsView = ({ navigation }) => (
  <View style={styles.rightTopBlock}>
    <Ionicons
      name="search"
      size={22}
      color="#000"
      onPress={() => navigation.navigate('SearchScreen')}
    />
    <Ionicons
      name="call-outline"
      size={22}
      color="#000"
      onPress={() => Linking.openURL('tel:+375 (29) 289-80-98')}
    />
  </View>
);

const IconsMenu = ({ navigation }) => (
  <TouchableOpacity
    style={{ marginLeft: 15 }}
    onPress={() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.toggleDrawer();
      }
    }}>
    <Ionicons
      name={navigation.canGoBack() ? 'arrow-back' : 'menu'}
      size={24}
      color="#000"
    />
  </TouchableOpacity>
);

// -------------------- STACKS --------------------

function DileveryScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({ title: 'Доставка и оплата' });
  }, []);
  return (
    <View style={styles.dilevery}>
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Image style={styles.dileveryImage} source={require('../assets/dostavka-edy.jpg')} />
      </View>
      <View>
        <Text style={styles.dileveryText}>У нас бесплатная доставка</Text>
      </View>
    </View>
  );
}

function AboutScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({ title: 'Контакты' });
  }, []);
  return (
    <DrawerContentScrollView>
      <View style={styles.dilevery}>
        <View>
          <Image style={styles.dileveryImage} source={require('../assets/td.jpg')} />
        </View>
        <View>
          <Text style={styles.dileveryTextMain}>
            Розничная торговля бытовой техникой и электроникой, электроинструментом, мотоблоками, мотоциклами и др.
          </Text>
        </View>
        <View>
          <Text style={styles.dileveryText}>Режим работы:</Text>
          <Text style={styles.graphikText}>Понедельник: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Вторник: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Среда: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Четверг: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Пятница: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Суббота: 10:00–18:00</Text>
          <Text style={styles.graphikText}>Воскресенье: 10:00–18:00</Text>
        </View>
        <View style={styles.aboutView}>
          <TouchableOpacity onPress={() => { Linking.openURL('tel:+375 (29) 289-80-98'); }}>
            <Text style={{ color: '#F00', fontSize: 16, fontWeight: 'bold' }}>+375 (29) 289-80-98</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dileveryViewMain}>
          <Text style={styles.dileveryTextMain}>
            ЧТУП »ТЕХНОИВЬЕ»
            г. Ивье, ул. Красноармейская, д. 2, каб. 15
            УНП 590191596,
            Регистрационный номер в торговом реестре РБ 333340. Сведения внесены 11.10.017 г.
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthScreen"
        component={AuthComponent}
        options={({ navigation }) => ({
          title: 'Авторизация',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function MainStack() {
  const { user } = useContext(MyContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitleStyle: { fontSize: 19 },
          title: 'Торговый дом - Электроник',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={({ navigation }) => ({
          headerTitleStyle: { fontSize: 19 },
          title: 'Каталог',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: { fontSize: 15 },
          title: route.params?.product?.name?.slice(0, 20) || 'Товар',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={({ navigation }) => ({
          title: 'Поиск',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      {/* Здесь больше нет дублирующего "Авторизация" */}
    </Stack.Navigator>
  );
}

function DileveryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DileveryScreen"
        component={DileveryScreen}
        options={({ navigation }) => ({
          headerTitleStyle: { fontSize: 19 },
          title: 'Торговый дом - Электроник',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerTitleStyle: { fontSize: 19 },
          title: 'Торговый дом - Электроник',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

// -------------------- CUSTOM DRAWER --------------------
function CustomDrawerContent(props) {
  const { user, logout } = useContext(MyContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={drawerStyles.header}>
        <Image
          style={drawerStyles.logo}
          source={require('../assets/favicon.png')}
        />
        <Text style={drawerStyles.title}>Торговый дом "Электроник"</Text>
        {user && (
          <View style={drawerStyles.userBlock}>
            <Text style={drawerStyles.label}>Вы вошли как:</Text>
            <Text style={drawerStyles.email}>{user.email}</Text>
            <TouchableOpacity
              style={drawerStyles.logoutBtn}
              onPress={logout}
              activeOpacity={0.85}
            >
              <Text style={drawerStyles.logoutText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 4 }}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

// -------------------- MAIN NAVIGATOR --------------------

export default function AppNavigator() {
  const { user } = useContext(MyContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerActiveTintColor: 'white', drawerActiveBackgroundColor: '#F00' }}
    >
      <Drawer.Screen name="Главная" component={MainStack} />
      <Drawer.Screen name="Доставка" component={DileveryStack} />
      <Drawer.Screen name="О нас/Контакты" component={AboutStack} />
      {!user && <Drawer.Screen name="Авторизация" component={AuthStack} />}
    </Drawer.Navigator>
  );
}

// -------------------- STYLES --------------------

const styles = StyleSheet.create({
  dileveryViewMain: { paddingBottom: 30, paddingLeft: 10, paddingRight: 10 },
  dileveryTextMain: { fontSize: 17, paddingTop: 20 },
  aboutButton: { paddingLeft: '10px' },
  aboutView: { paddingTop: 20 },
  dileveryImage: { width: 300, height: 200, resizeMode: 'cover' },
  dileveryText: { fontWeight: 'bold', fontSize: 18, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 },
  graphikText: { fontSize: 18, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10 },
  dilevery: { margin: 5, alignItems: 'center', textAlign: 'center' },
  rightTopBlock: { flexDirection: 'row', columnGap: 16, marginRight: 15 },
  drawerHeader: { alignItems: 'center', backgroundColor: '#f2f2f2', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  drawerTitle: { fontSize: 18, marginBottom: 10, color: '#333' },
});

const drawerStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#e1e1e1',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: '#d70022',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  userBlock: {
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: '#009900',
    fontSize: 15,
    marginBottom: 2,
  },
  email: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  logoutBtn: {
    backgroundColor: '#f23a3a',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 28,
    marginTop: 0,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#f23a3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
