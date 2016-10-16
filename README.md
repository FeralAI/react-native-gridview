# react-native-gridview
A flexible grid view based on React Native's ListView component.

![react-native-gridview-preview](https://github.com/jskuby/react-native-gridview/blob/master/demos/react-native-gridview-preview.gif?raw=true)

## Introduction
React Native's ListView can be customized to render in a grid layout, but suffers from some issues:

* Does not allow specifying a number of items per row, requiring fixing or calculating the width of your items for consistent row layouts
* If your items have variable heights, the item containers will not flex to match each other

`react-native-gridview` seeks to solve these issues, along with giving you some additional functionality
for grid-based layouts.

## Install
`npm install react-native-gridview --save`

## Basic Usage
A simple component that renders a static grid with 3 items per row:

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

Check out the `gridview` project in the examples folder for advanced usage.

## Properties

* **...ListView.props**
* **`data`** _(Array:Object)_ - The raw array or object (for sectioned grids) data source.  The `GridView` will create and manage its own `GridView.DataSource`.
* **`dataSource`** _(GridView.DataSource)_ - A `GridView.DataSource` (wrapper for `ListView.DataSource`) can be provided in place of, or override, the `data` property. `itemsPerRow` does not apply to this data source, and the data structure must be `[[item1, ...], [item1, ...]]` or `{ 'Section 1': [item1, ...], 'Section 2': [item1, ...] }`.  Since you control the data source structure, you can have a variable number of items per row by configuring your data source appropriately.
* **`itemsPerRow`** _(Integer)_ - The number of items to render per row.
* **`itemsPerRowLandscape/itemsPerRowPortrait`** _(Integer)_ - Provide one or both of these to override `itemsPerRow` in the specified orientation.  If one or both are provided, when `GridView` fires the `onLayout` event it will determine the orientation (using height/width check based on `Dimensions.get('window')`) and rebind the `data` or `dataSource` property to cause the grid content to re-render.
* **`itemStyle`** _(View.propTypes.style)_ - The style to apply to the item container after the default style of `{ flex: 1 }`.
* **`renderItem`** _(Function)_ - Render function called for each item in the data source.
* **`rowStyle`** _(View.propTypes.style)_ - The style to apply to the row container after the default style of `{ flexDirection: 'row' }`.
