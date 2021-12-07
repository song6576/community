import React, { Component } from 'react'
import { reqDiagnoseList, reqAddDiagnose, reqDeldiagnose, reqUpdateDiagnose } from '../../api/diagnose'
import { Table, Input, Button, Space, message, Modal, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';

export default class Diagnosis extends Component {
  state = {
    selectedRowKeys: [],
    diagnoseList: [],
    loading: false,
    visible: false, // 添加弹窗
    editorVisible: false, // 编辑弹窗
    list: {}
  };

  componentDidMount() {
    this.queryDiagnoseList()
  }

  /**
   * 查询物资审批信息list
   */
  queryDiagnoseList = async() => {
    const result = await reqDiagnoseList()
    if (result.status === 200) {
      const diagnoseList = result.data
      this.setState({diagnoseList:diagnoseList})
    } else {
      message.error('物资审批信息更新失败!')
    }
  }

  /**
   * 添加物资审批信息
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
    const { name,diagnoseTime,iphone,address,status } = values
    const result = await reqAddDiagnose(name,diagnoseTime,iphone,address,status)
    if (result.status === 200) {
      message.success(`添加${name}成功!`)
      this.handleCancel()
      this.queryDiagnoseList()
    } else {
      message.error('添加失败')
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  /**
   * 删除物资审批信息
   * @param {*} selectedRowKeys
   */
  delSupplies = async(id,name) => {
    const result = await reqDeldiagnose(id)
    if(result.status === 200) {
      message.success(`删除${name}诊断信息成功!`)
      this.queryDiagnoseList()
    } else {
      message.error(`删除${name}诊断信息失败!`)
    }
  }

  /**
   * 编辑诊断信息
   * @param {*} selectedRowKeys
   */
  ediverList = React.createRef()
  editorShowModal = (i) => {
    const list = this.state.diagnoseList[i]
    this.setState({
      editorVisible: true,
      list: list
    })
    // 获取真实的诊断信息
    this.ediverList.current?.setFieldsValue({
      id: list.id,
      name: list.name,
      diagnoseTime: list.diagnoseTime,
      iphone: list.iphone,
      address: list.address,
      status: list.status
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
    const { id,name,diagnoseTime,iphone,address,status } = values
    const result = await reqUpdateDiagnose(id,name,diagnoseTime,iphone,address,status)
    if (result.status === 200) {
      message.success(`修改${name}诊断信息成功!`)
      this.editorHandleCancel()
      this.queryDiagnoseList()
    } else {
      message.error('修改诊断信息失败!')
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
    const { selectedRowKeys, diagnoseList } = this.state;
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
        title: '患者姓名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name')
      },
      {
        title: '诊断时间',
        dataIndex: 'diagnoseTime',
      },
      {
        title: '患者电话',
        dataIndex: 'iphone'
      },
      {
        title: '居住地址',
        dataIndex: 'address'
      },
      {
        title: '发布时间',
        dataIndex: 'createTime'
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: status => (
          <>
            {
              status.map(item => {
                let status = item === 1 ? '确诊' : '疑似'
                return <div>{status}</div>
              })
            }
          </>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:180,
      }
    ]
    const data = [];
    for (let i = 0; i < diagnoseList.length; i++) {
      data.push({
        key: i,
        id: `${i+1}`,
        name: `${diagnoseList[i].name}`,
        diagnoseTime: `${diagnoseList[i].diagnoseTime}`,
        iphone: `${diagnoseList[i].iphone}`,
        address: `${diagnoseList[i].address}`,
        status: [diagnoseList[i].status],
        createTime: `${diagnoseList[i].createTime}`,
        operation:<div>
        <Button type="primary">
          <span onClick={() => this.editorShowModal(i)}>编辑</span>
        </Button>
        <Button
          type="primary"
          danger
          style={{marginLeft:'10px'}} onClick={() => this.delSupplies(diagnoseList[i].id,diagnoseList[i].name)}>删除</Button>
      </div>
      });
    }

    return (
      <div className='materialInformation'>
        {/* 编辑 */}
        <Modal
          visible={this.state.editorVisible}
          title="添加诊断信息"
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
            label="患者姓名"
            name="name"
            initialValue={this.state.list.name}
            rules={[{ required: true, message: '请添加患者姓名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="诊断时间"
            name="diagnoseTime"
            initialValue={this.state.list.diagnoseTime}
            rules={[{ required: true, message: '请添加诊断时间!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="患者电话"
            name="iphone"
            initialValue={this.state.list.iphone}
            rules={[{ required: true, message: '请添加患者电话!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="居住地址"
            name="address"
            initialValue={this.state.list.address}
            rules={[{ required: true, message: '请添加居住地址!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            initialValue={this.state.list.status}
          >
            <Input size='small' />
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
            title="添加物资审批信息"
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
              label="患者姓名"
              name="name"
              rules={[{ required: true, message: '请添加患者姓名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="诊断时间"
              name="diagnoseTime"
              rules={[{ required: true, message: '请添加诊断时间!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="患者电话"
              name="iphone"
              rules={[{ required: true, message: '请添加患者电话!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="居住地址"
              name="address"
              rules={[{ required: true, message: '请添加居住地址!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="状态"
              name="status"
            >
              <Input disabled={true} size='small' />
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
