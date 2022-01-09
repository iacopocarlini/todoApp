import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {TodoModel} from '../model/todoModel';
import { IconButton, Colors } from 'react-native-paper';
import { constants } from '../utils/constants';
import logger from '../utils/logger';

export const TodoComponent: React.FC<{
  todo: TodoModel;
  deleteItem: Function;
}> = ({todo: {id, title, priority}, deleteItem}) => {

  // Local variables
  let linkStyle = {};
  let priorityStyle; 

  // Check if title contains a link
  let isLink = false;
  let regex = new RegExp(constants.LINK_PATTERN);
  if (title.match(regex)) {
    isLink = true;
    linkStyle = styles.link;
  } 

  // Functions

  // if todo text contains a link, it gets opened in the browser
  const openLink = () => {

    if (!isLink) return;
   
    Linking.canOpenURL(title).then(supported => {
      if (supported) {
        Linking.openURL(title);
      } else {
        logger.log('ERROR', 'Unable to open URL: ' + title);
      }
    });
  }

  // Set style based on priority 
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
        <Text style={[styles.itemText, linkStyle]} onPress={openLink}> {title} </Text>
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
  link: {
    color: constants.LINK_COLOR,
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
