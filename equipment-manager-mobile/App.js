import { ActivityIndicator, StyleSheet, Text, View, FlatList, Button, SafeAreaView, Item} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';


export default function App() {
    const [isLoading, setLoading] = useState(true)
    const [equipment, setEquipment] = useState([])
    const [orders, setOrders] = useState([])
    
    const getEquipmentState = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/equipment-state');
            setEquipment(response.data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/order');
            setOrders(response.data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    const updateEquipmentState = async (equipment_id) => {
        try {
            let index = equipment.findIndex(s => s.equipment_id == equipment_id)
            let updatedEquipment = [...equipment]
            let current_state = updatedEquipment[index].state 

            if(current_state == 'RED') {
                updatedEquipment[index].state = 'YELLOW'
            } else if(current_state == 'YELLOW') {
                updatedEquipment[index].state = 'GREEN'
            } else {
                updatedEquipment[index].state = 'RED'
            }

            setEquipment(updatedEquipment)

            console.log(updatedEquipment[index].state)
            
            const response = await axios.post(`http://127.0.0.1:3000/equipment-state/${equipment_id}`, {
                "new_state": updatedEquipment[index].state
            })
            
            await getEquipmentState()
            await getOrders()
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false)
    }

}

useEffect(() => {
    getEquipmentState()
    getOrders()
}, [])

return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView>
            <Text style={{marginTop: 10, fontSize: 20}}>SET STATE</Text>
            <FlatList
            data={equipment}
            renderItem={({item}) =>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <View style={{flex: 1}}>
                        <Text>Equipment #{item.equipment_id}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text>State: {item.state}</Text>
                    </View>
                    <Button 
                        style={{position: 'relative', margin: 50}} 
                        title="Submit" 
                        onPress={() => updateEquipmentState(item.equipment_id)}/>
                </View>}
            keyExtractor={item => item.id}
            />
            <Text style={{marginTop: 50, fontSize: 20}}>ORDERS</Text>
            <FlatList style={{marginTop: 10}}
            data={orders}
            renderItem={({item}) =>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <View style={{flex: 1}}>
                        <Text>Equipment #{item.equipment_id}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text>Order: {item.order.order_name}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text>State: {item.state}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text>Created At: {item.created_at}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text>Updated At: {item.updated_at}</Text>
                    </View>
                </View>}
            keyExtractor={item => item.id}
            />
        </SafeAreaView>
      )}
    </View>
    )
}
