import React, { Component } from 'react'
import { Table, Input, Button, Space, Modal, Form, message } from 'antd';
// 接口
import { reqUsers, reqAddUser, reqdelUser, reqUpdataUser } from '../../api';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './user.less'

export default class User extends Component {

  state = {
    selectedRowKeys: [],
    loading: false,
    users: [], // 定义空的用户数组
    size: '', // 不设置值，则为中性尺寸
    searchText: '',
    searchedColumn: '',
    isModalVisible: false,
    isModalVisibleedv: false,
    setIsModalVisible: false,
    user: {}
  };

  componentDidMount() {
    // 调用用户接口
    this.queryUser()
  }

  /**
   * 查询用户接口
   */
  queryUser = async() => {
    const result = await reqUsers()
    if(result.status === 200) {
      const role = result.data
      this.setState({users:role})
    }
  }

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
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

  /**
   * modal对话框
   */
  showModal = () => {
    this.setState({isModalVisible: true})
  };

  handleOk = () => {
    this.setState({isModalVisible: false})
  };

  handleCancel = () => {
    this.setState({isModalVisible: false})
  };
  /**
   * form表单
   * @param {*} values
   */
  onFinish = async(values) => {
    const {username,password,iphone} = values
    const result = await reqAddUser(username,password,iphone)
    if (result.status === 200) {
      message.success('添加用户成功')
      this.handleCancel() // 添加成功关闭弹窗
      this.queryUser() // 添加成功重新查询用户列表
    } else {
      message.error('添加用户失败/用户名已存在')
    }
  };
  onFinishFailed = (errorInfo) => {
    message.error('请添加用户')
  };

  /**
   * 删除用户
   * @returns
   */
  delect = async(i,username) => {
    const result = await reqdelUser(i)
    if (result.status === 200) {
      message.success(`删除${username}用户成功`)
      this.queryUser()
    } else {
      message.error(`删除${username}用户失败`)
    }
  }

  /**
   * 编辑用户信息modul弹窗
   * @returns
   */
  editorOnFinish = async(values) => {
    const { id,username,password,role,iphone } = values
    const result = await reqUpdataUser(id,username,password,role,iphone)
    if(result.status === 200) {
      message.success(`${username}用户修改成功`)
      this.queryUser()
    } else {
      message.error(`${username}用户修改失败`)
    }
    this.setState({isModalVisibleedv: false})
  }
  editorOnFinishFailed = (errorInfo) => {
    console.log("🚀 ~ file: user.js ~ line 188 ~ User ~ errorInfo", errorInfo)
  }
  editorHandleOk = () => {
    this.setState({isModalVisibleedv: false})
  }

  editorHandleCancel = () => {
    this.setState({isModalVisibleedv: false})
  }

  showEditor = () => {
    this.setState({isModalVisibleedv: true})
  }

  ediver = (i) => {
    const user = this.state.users[i]
    this.setState(() =>({isModalVisibleedv: true,user:user}))
    // console.log(this.state.users[i],user,this.ediver2)
    this.ediver2.current?.setFieldsValue({id: user.id,username: user.username,password: user.password,role: user.role,iphone: user.iphone})
  }

  ediver2 = React.createRef()
  render() {
    const { users, loading, selectedRowKeys, size } = this.state
    // 列
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        ...this.getColumnSearchProps('username'),
      },
      {
        title: '角色',
        dataIndex: 'role',
      },
      {
        title: '电话',
        dataIndex: 'iphone',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      }
    ];

    const data = [];
    for (let i = 0; i < users.length; i++) {
      data.push({
        key: i,
        id: `${i+1}`,
        username: `${users[i].username}`,
        role: `${users[i].role}`,
        iphone: `${users[i].iphone}`,
        createTime: `${users[i].created}`,
        operation:<div>
          <Button type="primary" size={size} onClick={() => this.ediver(i)}>
            <span onClick={this.showEditor}>编辑</span>
          </Button>
          {/* users[i].id 拿到用户的真实id  users[i].username 拿到用户名 */}
          <Button type="primary" danger style={{marginLeft:'10px'}} onClick={() => this.delect(users[i].id,users[i].username)}>删除</Button>
        </div>
      });
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;


    return (
      <div className='user'>
        <Modal
          title='编辑'
          footer={null}
          visible={this.state.isModalVisibleedv}
          onOk={()=>this.editorHandleOk()}
          onCancel={()=>this.editorHandleCancel()}
          >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.editorOnFinish}
            onFinishFailed={this.editorOnFinishFailed}
            autoComplete="off"
            ref={this.ediver2}
          >
            <Form.Item
              label="id"
              name="id"
              initialValue={this.state.user.id}
            >
              <Input disabled={true} size='small' />
            </Form.Item>
            <Form.Item
              label="用户名"
              name="username"
              initialValue={this.state.user.username}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="角色"
              name="role"
              initialValue={this.state.user.role}
            >
              <Input  />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              initialValue={this.state.user.password}
            >
              <Input.Password  />
            </Form.Item>
            <Form.Item
              label="手机号码"
              name="iphone"
              initialValue={this.state.user.iphone}
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

        <div className='user-add'>
          <Button type="primary"
            icon={<PlusCircleOutlined />}
            onClick={this.showModal}
          >
            添加
          </Button>
          <Modal
            title="添加用户"
            footer={null}
            visible={this.state.isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请添加用户账号!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请添加用户密码!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="手机号码"
                name="iphone"
                rules={[{ required: true, message: '请添加用户手机号码!' }]}
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
        <div style={{ marginBottom: 16}}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            删除
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `选择了 ${selectedRowKeys.length} 个` : ''}
          </span>
        </div>
        <Table
          size='small'
          bordered={true}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          scroll={{y:'350px'}}
        />
      </div>
    )
  }
}
