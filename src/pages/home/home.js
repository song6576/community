import React, { Component } from 'react'
import * as echarts from 'echarts';
import 'echarts/map/js/china';
import geoJson from 'echarts/map/json/china.json';
import ReactEcharts from 'echarts-for-react';
import jsonp from "jsonp"; // 接口jsonp实现跨域
import './home.less';

import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

/**
  首页
 */
export default class Home extends Component {
  state = {
    mapData: [],
    searchText: '',
    searchedColumn: '',
  }
  getOption = () => {
    return {
      title: {
        text: "全国疫情地图",
        x: "center",
        textStyle: {
          color: "#9c0505"
        }
      },
      tooltip: { // 提示框
        trigger: "item",
        formatter: `省份: {b} <br/> 累计确诊：{c}` // a 系列名称 b 区域名称 c 合并数值
      },
      series: [
        {
          type: 'map',
          map: "china",
          data: this.state.mapData,
          label: {
            show: true,
            color: "black",
            fontStyle: 10,
            align: "center"
          },
          zoom: 1, // 当前缩放比例
          roam: true, // 是否支持拖拽
          itemStyle: {
            borderColor: "blue", // 区域边框线
          },
          emphasis: { // 高亮显示
            label: {
              color: "black",
              fontSize: 10
            },
            itemStyle: {
              areaColor: "lightyellow" // 区域高亮颜色
            }
          }
        },
      ],
      visualMap: {
        type: "piecewise",
        show: true,
        pieces: [
          { min: 10000 },
          { min: 1000, max: 9999 },
          { min: 500, max: 999 },
          { min: 100, max: 499 },
          { min: 10, max: 99 },
          { min: 1, max: 9 },
          { value: 0 }
        ],
        inRange: {
          color: ["#FFFFFF", "#FDEBCA", "#E25552", "#CA2B2D", "#831A26", "#500312"] // 颜色有个梯度变化
        }
      }
    }
  }
  getDate = () => {
    let self = this;
    jsonp("https://interface.sina.cn/news/wap/fymap2020_data.d.json", (err, data) => {
      var lists = data.data.list.map(item => {
        return {
          name: item.name, // 省份
          value: item.value, // 累计数值
          econNum: item.econNum, // 现有确诊
          cureNum: item.cureNum, // 累计治愈
          deathNum: item.deathNum, // 累计死亡
        }
      })
      self.setState({
        mapData: lists
      })
    })
  }
  componentDidMount() {
    this.getDate()
  }
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索地区`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  render() {
    const data = this.state.mapData.map((item,index) => {
      return (
        {
          key: index,
          name: item.name,
          value: item.value,
          econNum: item.econNum,
          cureNum: item.cureNum,
          deathNum: item.deathNum
        }
      )
    })
    const columns = [
      {
        title: '地区',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        align: 'center',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '累计',
        dataIndex: 'value',
        key: 'value',
        width: '30%',
        align: 'center',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.value - b.value
      },
      {
        title: '现有',
        dataIndex: 'econNum',
        key: 'econNum',
        width: '30%',
        align: 'center',
      },
      {
        title: '治愈',
        dataIndex: 'cureNum',
        key: 'cureNum',
        width: '30%',
        align: 'center',
      },
      {
        title: '死亡',
        dataIndex: 'deathNum',
        key: 'deathNum',
        width: '30%',
        align: 'center',
      }
    ]

    return (
      <div className='home'>
        <div className='home-zh' style={{padding:30}}>
          <ReactEcharts option={this.getOption()} style={{ height: "500px" }}></ReactEcharts>
        </div>
        <div className='home-table'>
          <Table
            bordered={true}
            columns={columns}
            dataSource={data}
            size='small'
          />
        </div>
      </div>
    )
  }
}
