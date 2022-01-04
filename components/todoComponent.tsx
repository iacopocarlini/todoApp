import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {TodoModel} from '../model/todoModel';

export const TodoComponent: React.FC<{
  todo: TodoModel;
  deleteItem: Function;
}> = ({todo: {id, title, priority}, deleteItem}) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square} />
        <Text style={styles.itemText}> {title} </Text>
      </View>
      <TouchableOpacity 
        key={id}  
        onPress={() => deleteItem(id)}
        style={styles.circular}>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
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
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});
