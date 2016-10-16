import React, { Component } from 'react';
import {
  Platform,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GridView from 'react-native-gridview';

const BASE_SIZE = 30;
const RANDOM_FACTOR_MAX = 30;

class App extends Component {
  constructor(props) {
    super(props);

    this._itemCountChanged = this._itemCountChanged.bind(this);
    this._itemsPerRowChanged = this._itemsPerRowChanged.bind(this);
    this._randomizeContent = this._randomizeContent.bind(this);
    this._useRandomCountsChanged = this._useRandomCountsChanged.bind(this);
    this._renderTimeout = null;

    const itemCount = 10;
    const data = generateData(itemCount);

    this.state = {
      data,
      dataSource: null,
      itemCount,
      itemsPerRow: 4,
      variableContent: false,
      useRandomCounts: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderGridView()}
        {this._renderOptions()}
      </View>
    );
  }

  _renderGridView() {
    return (
      <GridView
        data={this.state.data}
        /** `dataSource` will override `data` */
        dataSource={this.state.dataSource}
        padding={4}
        itemsPerRow={this.state.itemsPerRow}
        /** You can set different item counts for portrait and/or landscape mode */
        // itemsPerRowPortrait={4}
        // itemsPerRowLandscape={7}
        renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
          const randomValue = this.state.variableContent ? item.randomValue : BASE_SIZE;

          return (
            <View
              key={item.key}
              style={[
                styles.item,
                styles.itemSpacing,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <Text style={{ fontSize: randomValue }}>
                {item.text}
              </Text>
            </View>
          );
        }}
        renderSectionHeader={
          this.state.useRandomCounts
            ? this._renderSectionHeader
            : null
        }
      />
    );
  }

  _renderOptions() {
    return (
      <View style={styles.options}>
        <Text>Items per section</Text>
        <View style={styles.row}>
          <Slider
            style={styles.slider}
            minimumValue={1} maximumValue={10} step={1}
            value={this.state.itemsPerRow}
            onValueChange={this._itemsPerRowChanged}
          />
          <Text style={styles.sliderText}>{this.state.itemsPerRow}</Text>
        </View>
        <Text>Item count</Text>
        <View style={styles.row}>
          <Slider
            style={styles.slider}
            minimumValue={10} maximumValue={250} step={1}
            value={this.state.itemCount}
            onValueChange={this._itemCountChanged}
          />
          <Text style={styles.sliderText}>{this.state.itemCount}</Text>
        </View>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity style={styles.button} onPress={this._randomizeContent}>
            <Text style={styles.buttonText}>Randomize Content</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <Switch
              value={this.state.useRandomCounts}
              onValueChange={this._useRandomCountsChanged}
            />
            <Text style={{ marginLeft: 8 }}>Vary items per row</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.row}>
        <Text>{sectionID}</Text>
      </View>
    );
  }

  /**
   * Helper methods
   */
  _createRandomRows(data) {
    const { itemsPerRow } = this.state;
    const rowData = [];
    for (let i = 0; i < data.length; i) {
      const endIndex = Math.max(Math.round(Math.random() * itemsPerRow), 1) + i;
      rowData.push(data.slice(i, endIndex));
      i = endIndex;
    }

    return rowData;
  }

  _createRandomData(data) {
    return {
      'Section 1': this._createRandomRows(data),
      'Section 2': this._createRandomRows(data),
      'Section 3': this._createRandomRows(data),
    };
  }

  _createRandomDataSource(data) {
    const rowData = this._createRandomData(data);

    return new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }).cloneWithRowsAndSections(rowData);
  }

  _itemCountChanged(itemCount) {
    clearTimeout(this._renderTimeout);
    this._renderTimeout = setTimeout(() => {
      const data = generateData(itemCount);
      let dataSource = null;
      if (this.state.useRandomCounts)
        dataSource = this._createRandomDataSource(data);

      this.setState({
        data,
        dataSource,
        itemCount,
        variableContent: false,
      });
    }, 500);
  }

  _itemsPerRowChanged(itemsPerRow) {
    clearTimeout(this._renderTimeout);
    this._renderTimeout = setTimeout(() => {
      this.setState({ itemsPerRow }, () => this.forceUpdate());

      if (this.state.useRandomCounts) {
        const randomData = this._createRandomData(this.state.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(randomData),
        });
      }
    }, 500);
  }

  _randomizeContent() {
    const data = generateData(this.state.itemCount);
    let dataSource = null;
    if (this.state.useRandomCounts)
      dataSource = this._createRandomDataSource(data);

    this.setState({
      data,
      dataSource,
      variableContent: true,
    });
  }

  _useRandomCountsChanged(useRandomCounts) {
    let { dataSource } = this.state;
    if (useRandomCounts)
      dataSource = this._createRandomDataSource(this.state.data);
    else dataSource = null;

    this.setState({
      dataSource,
      useRandomCounts,
    });
  }
}

function generateData(itemCount) {
  return Array(itemCount)
    .fill(null)
    .map((item, index) => {
      const colorIndex = index % 3;
      return {
        key: index,
        text: `${index + 1}`,
        randomValue: Math.random() * RANDOM_FACTOR_MAX + BASE_SIZE,
        backgroundColor: `#${colorIndex === 0 ? 'FF' : '88'}` +
                          `${colorIndex === 1 ? 'FF' : '88'}` +
                          `${colorIndex === 2 ? 'FF' : '88'}`,
      };
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  options: {
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  slider: {
    flex: 1,
  },
  sliderText: {
    width: 30,
    textAlign: 'right',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  item: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    overflow: 'hidden',
  },
});

export default App;
