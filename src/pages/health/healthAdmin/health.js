import React, { Component } from 'react'
import { reqHealthUser, reqDelHealth } from '../../../api/health'
import { Table, Input, Button, Space, message} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

export default class HealthAdmin extends Component {
  state = {
    selectedRowKeys: [],
    healthList: [],
    loading: false,
    visible: false, // 添加弹窗
    editorHealth: false, // 编辑弹窗
    list: {}
  };

  componentDidMount() {
    this.queryHealthList()
  }

  /**
   * 查询物资审批信息list
   */
  queryHealthList = async() => {
    const result = await reqHealthUser()
    if (result.status === 200) {
      const healthList = result.data
      this.setState({healthList:healthList})
    } else {
      message.error('健康信息更新失败!')
    }
  }

  /**
   * 删除物资审批信息
   * @param {*} selectedRowKeys
   */
  delSupplies = async(id,name) => {
    const result = await reqDelHealth(id)
    if(result.status === 200) {
      message.success(`删除${name}信息成功!`)
      this.queryhealthList()
    } else {
      message.error(`删除${name}信息失败!`)
    }
  }

  /**
   * 用户名搜索
   * @param {*} selectedRowKeys
   */
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  /**
   * 用户名搜索
   */
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索用户名`}
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
        </Space>
      </div>
    ),
    // icon图标
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

  /**
   * 搜索
   * @param {*} selectedKeys
   * @param {*} confirm
   * @param {*} dataIndex
   */
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
  };

  render() {
    const { selectedRowKeys, healthList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: '温度',
        dataIndex: 'animal',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name')
      },
      {
        title: '电话',
        dataIndex: 'iphone',
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: status => (
          <>
            {
              status.map(item => {
                let status = item === 0 ? '正常' : '异常'
                return <div>{status}</div>
              })
            }
          </>
        )
      },
      {
        title: '发布时间',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:180,
      }
    ]
    const data = [];
    for (let i = 0; i < healthList.length; i++) {
      data.push({
        key: i,
        id: `${i+1}`,
        animal: `${healthList[i].animal}`,
        name: `${healthList[i].name}`,
        iphone: `${healthList[i].iphone}`,
        address: `${healthList[i].address}`,
        status: [healthList[i].status],
        createTime: `${healthList[i].createTime}`,
        operation:<div>
        <Button
          type="primary"
          danger
          style={{marginLeft:'10px'}} onClick={() => this.delSupplies(healthList[i].id,healthList[i].name)}>删除</Button>
      </div>
      });
    }

    return (
      <div className='materialInformation'>
        <Table
          bordered={true}
          columns={columns}
          dataSource={data}
          scroll={{y:'380px'}}
        />
      </div>
    )
  }
}
