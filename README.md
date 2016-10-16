# react-native-gridview
A flexible grid view based on React Native's ListView component.

![react-native-gridview-preview](https://github.com/jskuby/react-native-gridview/blob/master/demos/react-native-gridview-preview.gif?raw=true)

## Introduction
React Native's ListView can be customized to render in a grid layout, but suffers from some issues:

* Does not allow specifying a number of items per row, requiring fixing or calculating the width of your
  items for consistent row layouts
* If your items have variable heights, the item containers will not flex to match each other

`react-native-gridview` seeks to solve these issues, along with giving you some additional functionality
for grid-based layouts.

## Install
`npm install react-native-gridview --save`

## Usage
```javascript
import React from 'react';
import { Text, View } from 'react-native';
import GridView from 'react-native-gridview';

// Create some dummy data
const data = Array(20)
  .fill(null)
  .map((item, index) => index + 1);

export default function MyGrid(props) {
  return (
    <GridView
      data={data}
      itemsPerRow={3}
      renderItem={(item, sectionID, rowID, index, itemID) => {
        return (
          <View style={{ flex: 1, backgroundColor: '#8F8', borderWidth: 1 }}>
            <Text>{`${item} (${sectionID}-${rowID}-${index}-${itemID})`}</Text>
          </View>
        );
      }}
    />
  );
}
```

## Example
Check out the `gridview` project in the examples folder for advanced usage.
