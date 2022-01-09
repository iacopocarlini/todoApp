import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {TodoModel} from '../model/todoModel';
import { IconButton, Colors } from 'react-native-paper';
import { constants } from '../utils/constants';

export const TodoComponent: React.FC<{
  todo: TodoModel;
  deleteItem: Function;
}> = ({todo: {id, title, priority}, deleteItem}) => {

  // Set style based on priority 
  let priorityStyle; 
  switch (priority) {

    case 'A':
      priorityStyle = styles.A;
      break;
    case 'B':
      priorityStyle = styles.B;
      break;
    case 'C':
      priorityStyle = styles.C;
      break;
    case 'D':
      priorityStyle = styles.D;
      break;
    default:  
      priorityStyle = styles.D;
      break;
  }

  return (

    <View style={styles.item}>

      {/* Left  */}
      <View style={styles.itemLeft}>
        <View style={[styles.square, priorityStyle]} />
        <Text style={styles.itemText}> {title} </Text>
      </View>

      {/* Right  */}
      <IconButton 
        icon="delete"
        color={Colors.grey600}
        size={constants.DELETE_BUTTON_SIZE}
        onPress={() => deleteItem(id)}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  // Priority styles start
  square: {
    width: 24,
    height: 24,
    borderRadius: 5,
    marginRight: 15,
  },
  A: {
    backgroundColor: '#f16a70',
  },
  B: {
    backgroundColor: '#b1d877',
  },
  C: {
    backgroundColor: '#8cdcda',
  },
  D: {
    backgroundColor: '#4d4d4d',
  },
  // Priority styles end
  itemText: {
    maxWidth: '70%'
  },
});
