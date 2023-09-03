import * as React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  LogBox,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import firebase from "firebase/compat/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  Provider as PaperProvider,
  Card,
  List,
  Button,
} from "react-native-paper";
import Constants from "expo-constants";
import LoginScreen from "./Login";
import 'react-native-gesture-handler'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6gp21X7BZgQUPmPnhCX2BEbGy8DNv4Tg",
  authDomain: "mobileweb-lab8-b0aca.firebaseapp.com",
  databaseURL: "https://mobileweb-lab8-b0aca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobileweb-lab8-b0aca",
  storageBucket: "mobileweb-lab8-b0aca.appspot.com",
  messagingSenderId: "350723728867",
  appId: "1:350723728867:web:6dd28145c340551fca2cd6",
  measurementId: "G-9884R90CY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

LogBox.ignoreAllLogs(true);

try {
  firebase.initializeApp(FirebaseConfig);
} catch (err) { }

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  });
}

function renderCorona(item, index, setItem){
  var icon = <Image style={{width:30,height:20}} source={{uri:`https://covid19.who.int/countryFlags/${item.code}.png`}}/>
  var desc = <View>
  <Text>{ "ผู้ป่วยสะสม "+item.confirmed+" ราย"}</Text>
  <Text>{ "เสียชีวิต "+item.death+" ราย"}</Text>
  <Text>{ "เสียชีวิตล่าสุด "+item.lastdeath+" ราย"}</Text>
  </View>;
  return <List.Item onPress={()=>setItem(item)} title={item.name} description={desc} left={(props=>icon)}></List.Item>
}


function Detail(props){
   
   return <View>
     <Text>{JSON.stringify(props.item)}</Text>
     <Button  onPress={() => props.setItem(null) }>
      Back
      </Button>
   </View>
};


function Loading() {
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
}

export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);


  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);


  if (user == null) {
    return <LoginScreen/>;
  }


  if (corona.length == 0) {
    return <Loading />;
  }


  if(citem!=null){
    return <Detail item={citem} setItem={setCitem} />;
  }
  return (
<PaperProvider>      
    <View style={styles.container}>    
     <ScrollView>
      <Card>      
      <Card.Cover source={require("./assets/covid.png")}/>    
      <Card.Title title="Coronavirus Situation"/>            
      <Card.Content>
      <Text>Your Phone Number: {user.phoneNumber}</Text>          
      <FlatList data={corona}
        renderItem={ ({item,index})=> renderCorona(item, index, setCitem) } >
      </FlatList>          
      </Card.Content>
             
      </Card>              
     </ScrollView>  
    </View>
    <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
      Sign Out
      </Button>
      <StatusBar backgroundColor="#1b1b1b" style="light" barStyle="light-content"/>
    </PaperProvider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
});
