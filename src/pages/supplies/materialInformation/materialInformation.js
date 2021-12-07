import React, { Component } from 'react'
import { reqSupplies, reqAddsupplies, reqDelsupplies, reqUpdateSupplies } from '../../../api/supplies'
import { Table, Input, Button, Space, message, Modal, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './materialInformation.less'

export default class MaterialInformation extends Component {

  state = {
    selectedRowKeys: [],
    suppliesList: [],
    loading: false,
    visible: false, // 添加弹窗
    editorVisible: false, // 编辑弹窗
    list: {}
  };

  componentDidMount() {
    this.querySupplies()
  }

  /**
   * 查询物资信息list
   */
  querySupplies = async() => {
    const result = await reqSupplies()
    if (result.status === 200) {
      const suppliesList = result.data
      this.setState({suppliesList:suppliesList})
    } else {
      message.error('物资信息更新失败!')
    }
  }

  /**
   * 添加物资信息
   * @param {*} selectedRowKeys
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onFinish = async(values) => {
    const { suppliesName,inventory,unit } = values
    const result = await reqAddsupplies(suppliesName,inventory,unit)
    if (result.status === 200) {
      message.success(`添加${suppliesName}成功!`)
      this.handleCancel()
      this.querySupplies()
    } else {
      message.error('添加失败')
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  /**
   * 删除物资信息
   * @param {*} selectedRowKeys
   */
  delSupplies = async(id,suppliesName) => {
    const result = await reqDelsupplies(id)
    if(result.status === 200) {
      message.success(`删除${suppliesName}物资成功!`)
      this.querySupplies()
    } else {
      message.error(`删除${suppliesName}物资失败!`)
    }
  }

  /**
   * 编辑物资信息
   * @param {*} selectedRowKeys
   */
  ediverList = React.createRef()
  editorShowModal = (i) => {
    const list = this.state.suppliesList[i]
    this.setState({
      editorVisible: true,
      list: list
    })
    // 获取真实的物资信息
    this.ediverList.current?.setFieldsValue({
      id: list.id,
      suppliesName: list.suppliesName,
      inventory: list.inventory,
      unit: list.unit
    })
  };

  editorHandleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, editorVisible: false });
    }, 3000);
  };

  editorHandleCancel = () => {
    this.setState({ editorVisible: false });
  };

  editorOnFinish = async(values) => {
    const { id,suppliesName,inventory,unit } = values
    const result = await reqUpdateSupplies(id,suppliesName,inventory,unit)
    console.log("🚀 ~ file: materialInformation.js ~ line 121 ~ MaterialInformation ~ editorOnFinish=async ~ result", result)
    if (result.status === 200) {
      message.success(`修改${suppliesName}成功!`)
      this.editorHandleCancel()
      this.querySupplies()
    } else {
      message.error('修改失败')
    }
  };

  editorOnFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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
    const { selectedRowKeys, suppliesList } = this.state;
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
        title: '物资名称',
        dataIndex: 'suppliesName',
        ...this.getColumnSearchProps('suppliesName')
      },
      {
        title: '库存',
        dataIndex: 'inventory',
        sorter: (a, b) => a.inventory - b.inventory,
      },
      {
        title: '单位',
        dataIndex: 'unit',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        dataIndex: 'operation'
      }
    ];
    const data = [];
    for (let i = 0; i < suppliesList.length; i++) {
      data.push({
        key: i,
        id: `${i+1}`,
        suppliesName: `${suppliesList[i].suppliesName}`,
        inventory: `${suppliesList[i].inventory}`,
        unit: `${suppliesList[i].unit}`,
        createTime: `${suppliesList[i].createTime}`,
        operation:<div>
        <Button type="primary">
          <span onClick={() => this.editorShowModal(i)}>编辑</span>
        </Button>
        <Button
          type="primary"
          danger
          style={{marginLeft:'10px'}} onClick={() => this.delSupplies(suppliesList[i].id,suppliesList[i].suppliesName)}>删除</Button>
      </div>
      });
    }

    return (
      <div className='materialInformation'>
        {/* 编辑 */}
        <Modal
          visible={this.state.editorVisible}
          title="添加物资信息"
          onOk={this.editorHandleOk}
          onCancel={this.editorHandleCancel}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.editorOnFinish}
            onFinishFailed={this.editorOnFinishFailed}
            autoComplete="off"
            ref={this.ediverList}
          >
            <Form.Item
              label="id"
              name="id"
              initialValue={this.state.list.id}
            >
              <Input disabled={true} size='small' />
            </Form.Item>
          <Form.Item
            label="物资名称"
            name="suppliesName"
            initialValue={this.state.list.suppliesName}
            rules={[{ required: true, message: '请添加物资名称!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="库存"
            name="inventory"
            initialValue={this.state.list.inventory}
            rules={[{ required: true, message: '请添加库存!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="单位"
            name="unit"
            initialValue={this.state.list.unit}
            rules={[{ required: true, message: '请添加单位!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </Form.Item>
        </Form>
        </Modal>
        {/* 添加 */}
        <div className='materialInformation-btn'>
          <Button type="primary"
            icon={<PlusCircleOutlined />}
            style={{margin: '10px 0'}}
            onClick={this.showModal}
          >
            添加
          </Button>
          <Modal
            visible={this.state.visible}
            title="添加物资信息"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
              ref={this.ediver2}
            >
            <Form.Item
              label="物资名称"
              name="suppliesName"
              rules={[{ required: true, message: '请添加物资名称!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="库存"
              name="inventory"
              rules={[{ required: true, message: '请添加库存!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="单位"
              name="unit"
              rules={[{ required: true, message: '请添加单位!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Form.Item>
          </Form>
          </Modal>
        </div>
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
