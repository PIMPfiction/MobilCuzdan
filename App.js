/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { WheelPicker, DatePicker } from 'react-native-wheel-picker-android';
import React, { Component } from 'react';
//import { createStackNavigator, createAppContainer, StackNavigator, createBottomTabNavigator } from 'react-navigation';
 import {
   AppRegistry,
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   AsyncStorage,
   FlatList,
   RefreshControl
 } from 'react-native';
 import { DataTable, BottomNavigation, Button, List, Checkbox, Snackbar, FAB, Portal  } from 'react-native-paper';
 //import RNAppShortcuts from 'react-native-app-shortcuts';



fabobject = (obje) => {
  return (
      <FAB.Group
         open = {obje.state.fab}
         style={{flex: 1, position: 'absolute', left:0}}
         icon={obje.state.fab ? 'today' : 'add'}
         actions={[
          //{ icon: 'add', onPress: () => console.log('Pressed add') },
        //  { icon: 'star', label: 'Star', onPress: () => console.log('Pressed star')},
          //{ icon: 'email', label: 'Email', onPress: () => console.log('Pressed email') },
          { icon: 'notifications', label: 'Refresh Page', onPress: () => refreshPage(obje) },
        ]}
        onStateChange={({ fab }) => obje.setState({fab: obje.state.fab ? false : true}) }
       />
    )
}


refreshPage = (obje) => { // sayfa yenileme fonksiyonu
  obje.setState({Run:0});
  obje.forceUpdate();
}

var harcama = ['🍔Yemek', '⛽ Benzin', '🚌Akbil', '💇Kuaför', '🛒Market'];
var fiyat =  ['0 ₺', '5 ₺', '10 ₺', '20 ₺', '30 ₺', '50 ₺', '100 ₺', '200 ₺'];

_storeData = async (obje) => {
  if (obje.state.Run == 0){
    //first run for global variable
    global.obje = obje
    // finish global variable definition
    try {
      let arrHarcama = await AsyncStorage.getItem('Harcama');
      let arrFiyat = await AsyncStorage.getItem('Fiyat');
      if (arrFiyat == undefined){
        await AsyncStorage.setItem('Fiyat', JSON.stringify(fiyat));
        let arrFiyat = await AsyncStorage.getItem('Fiyat');
      }
      if (arrHarcama == undefined){
        await AsyncStorage.setItem('Harcama', JSON.stringify(harcama));
        let arrHarcama = await AsyncStorage.getItem('Harcama');
      }
      newFiyat = JSON.parse(arrFiyat);
      newHarcama = JSON.parse(arrHarcama);
      obje.setState({ Fiyat: newFiyat});
      obje.setState({ Harcama: newHarcama});
      obje.setState({Run : 1});

    }catch (error){
      alert(error);
  }
 } else {
   console.log("do nothing");
 }

}

class MyPicker extends Component {
 state = {
   Harcama: ['🍔Yemek'],
   Fiyat: ['0 ₺'],
   selectedItem: 0,
   selectedItem2: 0,
   text: "", //fiyat input
   harcamatext: "", //harcama input
   Run: 0,
   visible: false,  // snackybar1 init
   visible2: false, // snackybar2 init
   fab: false  // fab init
 }

 harcamaKaydet = async () => { // ODEME kaydetme ve ekrana getirme TODO: Tarih ekle
   const date = new Date()
   var day = new Date().getDate(); //Current Date
   var month = new Date().getMonth() + 1; //Current Month
   var year = new Date().getFullYear(); //Current Year
   var newDate = date.getHours() + ":" + date.getMinutes() + " " + day + '/' + month + '/' + year
   var lastid = parseInt(await AsyncStorage.getItem("lastid"));
   if (!lastid){
     lastid = 1
   } else {
     lastid += 1
   }
   await AsyncStorage.setItem("lastid", JSON.stringify(lastid));
   let odeme = {
     id: lastid,
     fiyat: this.state.Fiyat[this.state.selectedItem2].split(" ")[0],
     tur: this.state.Harcama[this.state.selectedItem].substring(2),
     tarih: newDate,
   };
   let dataArray = JSON.parse(await AsyncStorage.getItem('payments'));
   if (!dataArray) {
     dataArray = [];
   }
   dataArray.push(odeme)
   await AsyncStorage.setItem('payments', JSON.stringify(dataArray));
   this.setState({ visible: true });


 }

 onItemSelected = selectedItem => {
   this.setState({ selectedItem })
 }
 onItemSelected2 = selectedItem2 => {
   this.setState({ selectedItem2 })
 }

 updateArr = async (money) => { //Fiyat Pickerini Update eder
   let newArr = this.state.Fiyat.concat([money+" ₺"]);
   this.setState({ Fiyat: newArr});
   await AsyncStorage.setItem('Fiyat', JSON.stringify(newArr));
   var sortedArray = [];
   var finalArray = [];
   this.state.Fiyat.map(function(name, index){
      sortedArray.push(parseInt(name.split(" ")[0]));
     });
    sortedArray.sort((a, b) => a - b);
    sortedArray.map(function(name, index){
      if (name == parseInt(money)){
        pickerLocation = index;
      };
      finalArray.push(name.toString()+" ₺");
    });
    await AsyncStorage.setItem('Fiyat', JSON.stringify(finalArray));
    this.setState({Fiyat: finalArray});
    this.setState({ selectedItem2: pickerLocation });
    this.setState({ visible: true });

 }

 updateArrHarcama = async (money) => { //Harcama Pickerini Update eder
   let newArr = this.state.Harcama.concat([money]);
   this.setState({ Harcama: newArr});
   await AsyncStorage.setItem('Harcama', JSON.stringify(newArr));
   var sortedArray = [];
   var finalArray = [];
   this.state.Harcama.map(function(name, index){
      sortedArray.push(name);
     });
    sortedArray.sort((a, b) => a - b);
    sortedArray.map(function(name, index){
      if (name == money){
        pickerLocation = index;
      };
      finalArray.push(name.toString());
    });
    await AsyncStorage.setItem('Harcama', JSON.stringify(finalArray));
    this.setState({Harcama: finalArray});
    this.setState({ selectedItem: pickerLocation });
    this.setState({ visible: true });

 }



 handleEnter = (event) => { //Numeric Keyboard inputunu fiyat pickerina yukler
   this.updateArr(this.state.text);
 }
 handleEnterHarcama = (event) => { //Numeric Keyboard inputunu fiyat pickerina yukler
   this.updateArrHarcama(this.state.harcamatext);
 }

 touchKaydet = () => {
   var type = this.state.Harcama[this.state.selectedItem];
   var price = this.state.Fiyat[this.state.selectedItem2];
 }

 render() {
   _storeData(this);

   return (
     <View style={styles.container}>
       <View style={styles.container2}>
         <WheelPicker
           selectedItem={this.state.selectedItem}
           data={this.state.Harcama}
           onItemSelected={this.onItemSelected}/>
        <WheelPicker
          selectedItem={this.state.selectedItem2}
          data={this.state.Fiyat}
          onItemSelected={this.onItemSelected2}/>
       </View>
       <TextInput
        placeholder = "Yeni Harcama Turu ekle"
        keyboardType="default"
        value= {this.state.harcamatext}
        onChangeText = {(text) => this.setState({harcamatext: text})}
        onSubmitEditing = {this.handleEnterHarcama}
       />
       <TextInput
        placeholder = "Yeni Para ekle"
        keyboardType="numeric"
        value= {this.state.text}
        onChangeText = {(text) => this.setState({text})}
        onSubmitEditing = {this.handleEnter}
       />
       <View style={styles.buttonContainer}>
       <Text style={{justifyContent: "center", backgroundColor: "transparent", fontSize: 20, paddingTop: 30}}>Yapilan Odeme: {this.state.Harcama[this.state.selectedItem]}   |   {this.state.Fiyat[this.state.selectedItem2]}</Text>
         <TouchableOpacity
           onPress={this.harcamaKaydet}
           style={{
               borderWidth:1,
               borderColor:'rgba(0,0,0,0.2)',
               width:100,
               height:100,
               backgroundColor:'#fff',
               borderRadius:50,
             }}
             >
             <Text
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 35,
                textAlign: "center",
              }}
              >
               Kaydet
              </Text>
          </TouchableOpacity>

          <Snackbar
             visible={this.state.visible}
             onDismiss={() => this.setState({ visible: false })}
             action={{
               label: 'Tamam',
               onPress: () => {

               },
             }}
           >
             Yeni veri başarıyla eklendi.
           </Snackbar>


           <Snackbar
              visible={this.state.visible2}
              onDismiss={() => this.setState({ visible2: false })}
              action={{
                label: 'Tamam',
                onPress: () => {

                },
              }}
            >
              Ödeme Kaydedildi.
            </Snackbar>
        </View>
          {fabobject(this)}
     </View>


   );
 }
}

 //


const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0 ,
    backgroundColor: '#F5FCFF',
  },
  container2: {
    flexDirection: "row",
    top: 0,
    left: 0 ,
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    top: 70,
    paddingRight: 50,
    paddingLeft: 10,
    flexDirection: "row",
  },

});


class HarcamaList extends Component {

  constructor() {
    super();
    //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {

      //dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      Run: 0,
      defined: 0,
      isLoading: false,
    };
  }

  renderRow(data){
    return (<Text>{`\u2022 ${data}`}</Text>);
  }
  _returnList = async () => {
    if (parseInt(this.state.Run) == 0){
      let items = JSON.parse(await AsyncStorage.getItem('payments'));
      if (items){
        this.setState({array: items});
        this.setState({defined: "1"})
      }
      this.setState({ Run: 1});
    }
  };
  renderRefreshControl() {
    this.setState({ isLoading: true })
  }

  render() {
    this._returnList();
    if (this.state.array){
      return (
        <View style={{
          top: 0,
          left: 0,
          flex: 1
        }}>
          <Button mode="contained" onPress={() => { refreshPage(this) }}>Yenile</Button>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Fiyat</DataTable.Title>
              <DataTable.Title>Tur</DataTable.Title>
              <DataTable.Title>Tarih</DataTable.Title>
            </DataTable.Header>
            {this.state.array.map((prop) => { return (<DataTable.Row><DataTable.Cell>{prop["fiyat"]}</DataTable.Cell><DataTable.Cell>{prop["tur"]}</DataTable.Cell><DataTable.Cell>{prop["tarih"]}</DataTable.Cell></DataTable.Row>) })}
            <DataTable.Pagination
              page={1}
              numberOfPages={3}
              onPageChange={(page) => { console.log("PAGING FUNCTION WILL BE ADDED"); }} //hack TODO: pagination function, render icindeki fonksiyonda da ilk 5 tanesini goster her sayfada 5'er tane olsun
              label="1-2 of 6" />
          </DataTable>
          {fabobject(this)}
        </View>

      );
    } else {
      return (
        <View style={{
          top: 0,
          left: 0,
          flex: 1
          }}>
          <Button mode="contained" onPress={ () => { refreshPage(this)} }>Yenile</Button>
          <View style={{top: 70, left: 20, justifyContent: "center"}}>
          <Text>Daha harcama yapmadiniz</Text>
          </View>
          {fabobject(this)}
        </View>

        )
    }
  }
}

class Settings extends Component {   //SETTINGS

  state = {
    expanded: true,
    visible: false
  }

  _handlePress = () =>
  this.setState({
    expanded: !this.state.expanded
  });



  fiyatsil = async () => {
    await AsyncStorage.setItem("Fiyat", JSON.stringify(['0 ₺', '5 ₺', '10 ₺', '20 ₺', '30 ₺', '50 ₺', '100 ₺', '200 ₺']));
    this.setState({ visible: true });

  }
  harcamasil = async () => {
    await AsyncStorage.setItem("Harcama", JSON.stringify(['🍔Yemek', '⛽ Benzin', '🚌Akbil', '💇Kuaför', '🛒Market']));
    this.setState({ visible: true });

  }
  odemesil = async() => {
    await AsyncStorage.removeItem("payments");
    this.setState({ visible: true });
  }



  render (){
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <List.Section title="Ayarlar">
         <List.Accordion
           title="Verileri Sil"
           left={props => <List.Icon {...props} icon="folder" />}
         >
           <List.Item title="Harcamaları Sil" onPress={this.harcamasil} description="Sonradan eklenen harcama türlerini siler."/>
           <List.Item title="Fiyatları Sil" onPress={this.fiyatsil} description="Sonradan eklenen fiyatları siler."/>
           <List.Item title="Ödemeleri Sil." onPress={this.odemesil} description="Tüm ödeme geçmişini siler."/>
         </List.Accordion>
       </List.Section>

       <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'Tamam',
            onPress: () => {

            },
          }}
        >
          Veriler başarıyla silindi.
        </Snackbar>
        {fabobject(this)}
      </View>
      )
  }

}

export default class MyComponent extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'ekle', title: 'Ekle', icon: 'queue-music' },
      { key: 'goruntule', title: 'Goruntule', icon: 'album' },
      { key: 'ayarlar', title: 'Ayarlar', icon: 'history' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    ekle: MyPicker,
    goruntule: HarcamaList,
    ayarlar: Settings,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
