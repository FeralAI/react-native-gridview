import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Dimensions,
  ListView,
  StyleSheet,
  View,
} from 'react-native';

class GridView extends Component {
  constructor(props) {
    super(props);
    this._getDataSource = this._getDataSource.bind(this);
    this._initialLayout = true;
    const dataSource = this._getDataSource(props);
    this.state = { dataSource };
  }

  static get DataSource() {
    return ListView.DataSource;
  }

  static get propTypes() {
    return {
      data: PropTypes.array,
      fillMissingItems: PropTypes.bool,
      itemsPerRow: PropTypes.number,
      itemsPerRowLandscape: PropTypes.number,
      itemsPerRowPortrait: PropTypes.number,
      itemStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array,
      ]),
      renderItem: PropTypes.func.isRequired,
      rowStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array,
      ]),
    };
  }

  static get defaultProps() {
    return {
      fillMissingItems: true,
      itemsPerRow: 1,
      itemsPerRowLandscape: null,
      itemsPerRowPortrait: null,
    };
  }

  componentWillReceiveProps(props) {
    const dataSource = this._getDataSource(props);
    this.setState({ dataSource });
  }

  render() {
    if (!this.props.data && !this.props.dataSource)
      throw new Error('GridView component requires "data" or "dataSource"');

    const itemsPerRow = this.itemsPerRow;

    return (
      <ListView
        onLayout={(...args) => {
          /**
           * The grid data needs to be rebound if the items per row is
           * different between portrait and landscape modes.  Only rebind
           * after the first layout call, since we've already bound data
           * in the initial state.
           */
          if (this._initialLayout) {
            this._initialLayout = false;
          } else if (this.props.itemsPerRowLandscape || this.props.itemsPerRowPortrait) {
            const dataSource = this._getDataSource(this.props);
            this.setState({ dataSource });
          }

          if (this.props.onLayout)
            this.props.onLayout(...args);
        }}
        enableEmptySections={true}
        {...this.props}
        dataSource={this.state.dataSource}
        contentContainerStyle={[
          styles.list,
          this.props.contentContainerStyle,
        ]}
        renderRow={(rowData, sectionID, rowID, ...args) => {
          return (
            <View style={[styles.row, this.props.rowStyle]}>
              {rowData.map((item, index) => {
                const itemID = rowID * itemsPerRow + index;
                return (
                  <View key={itemID} style={[styles.item, this.props.itemStyle]}>
                    {
                      item
                        ? this.props.renderItem(item, sectionID, rowID, index, itemID, ...args)
                        : null
                    }
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    );
  }

  get itemsPerRow() {
    let { itemsPerRow } = this.props;
    const { itemsPerRowPortrait, itemsPerRowLandscape } = this.props;

    if (itemsPerRowPortrait || itemsPerRowLandscape) {
      const { width, height } = Dimensions.get('window');
      const isLandscape = width > height;

      if (isLandscape && itemsPerRowLandscape)
        itemsPerRow = itemsPerRowLandscape;
      else if (!isLandscape && itemsPerRowPortrait)
        itemsPerRow = itemsPerRowPortrait;
    }

    return itemsPerRow;
  }

  _getDataSource(props) {
    let { dataSource } = props;
    if (!dataSource) {
      const { data } = props;
      const hasHeaders = !Array.isArray(data);
      if (hasHeaders) {
        const rowData = Object.keys(data)
          .reduce((value, prop) => {
            value[prop] = this._getRowData(data[prop]);
            return value;
          }, {});

        dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }).cloneWithRowsAndSections(rowData);
      } else {
        const rowData = this._getRowData(data);

        dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }).cloneWithRows(rowData);
      }
    }

    return dataSource;
  }

  _getRowData(data) {
    const itemsPerRow = this.itemsPerRow;
    const rowCount = Math.ceil(data.length / itemsPerRow);
    const rowData = [];

    for (let i = 0; i < rowCount; i++) {
      const startIndex = i * itemsPerRow;
      const endIndex = startIndex + itemsPerRow;
      const items = data.slice(startIndex, endIndex);

      if (this.props.fillMissingItems && items.length < itemsPerRow) {
        const diff = itemsPerRow - items.length;
        items.push(...Array(diff).fill(null));
      }

      rowData.push(items);
    }

    return rowData;
  }
}

const styles = StyleSheet.create({
  list: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
  },
});

export default GridView;
