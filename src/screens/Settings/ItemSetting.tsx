import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';
import styles from './index.style';

interface Props {
  title?: string;
  listContent?: string[];
}

function ItemSetting({title = '', listContent = []}: Props): ReactElement {
  return (
    <View style={styles.itemSetting}>
      <View>
        <Text>{title}</Text>
      </View>
      <View>
        {/* {listContent.map(itemText => (
          <View></View>
        ))} */}
      </View>
    </View>
  );
}

export default ItemSetting;
