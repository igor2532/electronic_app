import React, { useContext } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import AboutScreen from '../screens/AboutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AuthComponent from '../screens/AuthComponent';
import NewProductsScreen from '../screens/NewProductsScreen';
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
      color="#fff"
      onPress={() => navigation.navigate('SearchScreen')}
    />
    <Ionicons
      name="call-outline"
      size={22}
      color="#fff"
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
      color="#fff"
    />
  </TouchableOpacity>
);

// -------------------- STACKS --------------------
function NewProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewProductsScreen"
        component={NewProductsScreen}
        options={({ navigation }) => ({
          title: 'Новые поступления',
          headerTitleStyle: { fontSize: 18, color: '#1E90FF' },
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
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

function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff' },
          title: 'Контакты',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthScreen"
        component={AuthComponent}
        options={({ navigation }) => ({
            headerStyle: { backgroundColor: '#191B22' },
         headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Авторизация',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}


function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={({ navigation }) => ({
            headerStyle: { backgroundColor: '#191B22' },
         headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Хочу купить',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}


function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({ navigation }) => ({
        headerStyle: { backgroundColor: '#191B22' },
         headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Профиль',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Редактировать профиль',
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
             headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Торговый дом - Электроник',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={({ navigation }) => ({
           headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Каталог',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={({ navigation, route }) => ({
           headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: route.params?.product?.name?.slice(0, 20) || 'Товар',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={({ navigation }) => ({
              headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
          title: 'Поиск',
          headerRight: () => <IconsView navigation={navigation} />,
          headerLeft: () => <IconsMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen
  name="NewProductsScreen"
  component={NewProductsScreen}
  options={({ navigation }) => ({
     headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
    title: 'Новые поступления',
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
           headerStyle: { backgroundColor: '#191B22' },
          headerTitleStyle: { fontSize: 19, color: '#fff'},
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

  // Меню для Drawer
  const menu = [
    { label: 'Главная', icon: 'home-outline', screen: 'Главная' },
    { label: 'Доставка', icon: 'car-outline', screen: 'Доставка' },
    { label: 'О нас/Контакты', icon: 'information-circle-outline', screen: 'О нас/Контакты' },
    !user && { label: 'Авторизация', icon: 'log-in-outline', screen: 'Авторизация' },
    user && { label: 'Профиль', icon: 'person-outline', screen: 'Профиль' },
    user && { label: 'Хочу купить', icon: 'heart-outline', screen: 'Хочу купить' },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: '#181A20' }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#181A20', paddingTop: 0 }}
      >
        <View style={drawerStyles.header}>
          <Image
            style={drawerStyles.logo}
            source={require('../assets/favicon.png')}
          />
          <Text style={drawerStyles.title}>Торговый дом "Электроник"</Text>
          {user && (
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Text style={drawerStyles.emailActive}>{user.email}</Text>
            </View>
          )}
        </View>
        <View style={drawerStyles.menuWrap}>
          {menu.map(item => (
            <TouchableOpacity
              key={item.screen}
              style={[
                drawerStyles.menuItem,
                props.state.routeNames[props.state.index] === item.screen && drawerStyles.menuItemActive,
              ]}
              onPress={() => props.navigation.navigate(item.screen)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={props.state.routeNames[props.state.index] === item.screen ? '#F9227F' : '#bbb'}
                style={{ marginRight: 18, minWidth: 22 }}
              />
              <Text
                style={[
                  drawerStyles.menuLabel,
                  props.state.routeNames[props.state.index] === item.screen && drawerStyles.menuLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* ВЫЙТИ — ФИКСИРУЕМ В САМОМ НИЗУ */}
      {user && (
        <View style={drawerStyles.logoutBottomBlock}>
          <TouchableOpacity
            style={drawerStyles.logoutBtnBottom}
            onPress={logout}
            activeOpacity={0.88}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={drawerStyles.logoutBottomText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}



// -------------------- MAIN NAVIGATOR --------------------

export default function AppNavigator() {
  const { user } = useContext(MyContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
     screenOptions={{
    headerShown: false,
    drawerActiveTintColor: '#F9227F',
    drawerActiveBackgroundColor: '#23262F',
    drawerStyle: { backgroundColor: '#181A20', width: 305 },
  }}
    >
      <Drawer.Screen name="Главная" component={MainStack} />
      <Drawer.Screen name="Доставка" component={DileveryStack} />
      <Drawer.Screen name="О нас/Контакты" component={AboutStack} />
      {!user && <Drawer.Screen name="Авторизация" component={AuthStack} />}
      {user && <Drawer.Screen name="Профиль" component={ProfileStack} />}
       {user && <Drawer.Screen name="Хочу купить" component={FavoritesStack} />}
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
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: '#181A20',
    borderBottomWidth: 0,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 22,
    marginBottom: 9,
    backgroundColor: '#23262F',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  userBlock: {
    marginTop: 12,
    alignItems: 'center',
    marginBottom: 2,
    width: '90%',
  },
  label: {
    color: '#F9227F',
    fontSize: 14,
    marginBottom: 2,
  },
  email: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#2C2C3B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  menuWrap: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 12,
    backgroundColor: '#181A20',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 13,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: '#23262F',
  },
  menuLabel: {
    color: '#bbb',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  menuLabelActive: {
    color: '#F9227F',
    fontWeight: 'bold',
  },
   emailActive: {
    color: '#F9227F', // или '#1E90FF'
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 0,
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  logoutBottomBlock: {
    paddingHorizontal: 17,
    paddingVertical: 21,
    borderTopWidth: 1,
    borderTopColor: '#242535',
    backgroundColor: '#181A20',
  },
  logoutBtnBottom: {
    flexDirection: 'row',
    backgroundColor: '#23262F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    elevation: 2,
    width: '100%',
  },
  logoutBottomText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16.5,
    letterSpacing: 0.3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
