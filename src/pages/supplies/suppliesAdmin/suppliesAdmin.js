import React, { Component } from 'react'
import { reqAudit, reqAddaudit, reqDelaudit, reqUpdateAudit } from '../../../api/audits'
import { Table, Input, Button, Space, message, Modal, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';

export default class SuppliesAdmin extends Component {

  state = {
    selectedRowKeys: [],
    auditList: [],
    loading: false,
    visible: false, // 添加弹窗
    editorVisible: false, // 编辑弹窗
    list: {}
  };

  componentDidMount() {
    this.queryAudit()
  }

  /**
   * 查询物资审批信息list
   */
  queryAudit = async() => {
    const result = await reqAudit()
    if (result.status === 200) {
      const auditList = result.data
      this.setState({auditList:auditList})
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
    const { suppliesName,amount,auditPeople,iphone,address,status } = values
    const result = await reqAddaudit(suppliesName,amount,auditPeople,iphone,address,status)
    if (result.status === 200) {
      message.success(`添加${suppliesName}成功!`)
      this.handleCancel()
      this.queryAudit()
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
  delSupplies = async(id,suppliesName) => {
    const result = await reqDelaudit(id)
    if(result.status === 200) {
      message.success(`删除${suppliesName}物资审批信息成功!`)
      this.queryAudit()
    } else {
      message.error(`删除${suppliesName}物资审批信息失败!`)
    }
  }

  /**
   * 编辑物资审批信息
   * @param {*} selectedRowKeys
   */
  ediverList = React.createRef()
  editorShowModal = (i) => {
    const list = this.state.auditList[i]
    this.setState({
      editorVisible: true,
      list: list
    })
    // 获取真实的物资审批信息
    this.ediverList.current?.setFieldsValue({
      id: list.id,
      suppliesName: list.suppliesName,
      amount: list.amount,
      auditPeople: list.auditPeople,
      iphone: list.iphone,
      address: list.address,
      status: list.staus
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
    const { id,suppliesName,amount,auditPeople,iphone,address,status } = values
    const result = await reqUpdateAudit(id,suppliesName,amount,auditPeople,iphone,address,status)
    if (result.status === 200) {
      message.success(`修改${suppliesName}物资审批信息成功!`)
      this.editorHandleCancel()
      this.queryAudit()
    } else {
      message.error('修改物资审批信息失败!')
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
    const { selectedRowKeys, auditList } = this.state;
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
        title: '申领数量',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '申请人',
        dataIndex: 'auditPeople',
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
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: status => (
          <>
            {
              status.map(item => {
                // 判断status为0时：待审核  status为1时：通过
                let status = item === 1 ? '通过' : '待审核'
                return <div>{status}</div>
              })
            }
          </>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:180,
      }
    ]
    const data = [];
    for (let i = 0; i < auditList.length; i++) {
      data.push({
        key: i,
        id: `${i+1}`,
        suppliesName: `${auditList[i].suppliesName}`,
        amount: `${auditList[i].amount}`,
        auditPeople: `${auditList[i].auditPeople}`,
        iphone: `${auditList[i].iphone}`,
        address: `${auditList[i].address}`,
        status: [auditList[i].status],
        createTime: `${auditList[i].createTime}`,
        operation:<div>
        <Button type="primary">
          <span onClick={() => this.editorShowModal(i)}>编辑</span>
        </Button>
        <Button
          type="primary"
          danger
          style={{marginLeft:'10px'}} onClick={() => this.delSupplies(auditList[i].id,auditList[i].suppliesName)}>删除</Button>
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
            label="申请数量"
            name="amount"
            initialValue={this.state.list.amount}
            rules={[{ required: true, message: '请添加申请数量!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="申请人"
            name="auditPeople"
            initialValue={this.state.list.auditPeople}
            rules={[{ required: true, message: '请添加申请人!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话"
            name="iphone"
            initialValue={this.state.list.iphone}
            rules={[{ required: true, message: '请添加申请人电话!' }]}
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
              label="物资名称"
              name="suppliesName"
              rules={[{ required: true, message: '请添加物资名称!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="申请数量"
              name="amount"
              rules={[{ required: true, message: '请添加申请数量!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="申请人"
              name="auditPeople"
              rules={[{ required: true, message: '请添加申请人!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="电话"
              name="iphone"
              rules={[{ required: true, message: '请添加申请人电话!' }]}
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
