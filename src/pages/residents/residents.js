import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Input, Form, message, Space } from 'antd';
import { reqResidentsUsers, reqAddresidentsUsers, reqdelResidents, reqUpdataResidentsUser } from '../../api';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './residents.less';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

/*目标组件 */
const Residents = () => {

  const [userList,setUserList] = useState([])
  const [userEditor, setUserEditor] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEditor, setIsModalVisibleEditor] = useState(false);
  // const [searchText,setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState();
  // const [selectedRowKeys,setSelectedRowKeys] = useState([]);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const onFinish = async(values) => {
    const {name,age,email,professional,iphone,birthday,address} = values
    const result = await reqAddresidentsUsers(name,age,email,professional,iphone,birthday,address)
    if (result.status === 200) {
      message.success('添加用户成功')
      handleCancel() // 添加成功关闭弹窗
      queryUsers() // 添加成功重新查询用户列表
    } else {
      message.error('添加用户失败/用户名已存在')
    }
  }

  const onFinishFailed = (errorInfo) => {
    message.error('请添加用户')
  };

  /**
   * 查询所有用户
   */
  const queryUsers = async() => {
    const result = await reqResidentsUsers()
    // console.log("🚀 ~ file: residents.js ~ line 17 ~ queryUsers ~ result", result)
    if(result.status === 200) {
      const userList = result.data
      setUserList(userList)
    }
  }

  useEffect(() => {
    queryUsers()
  }, [])

  /**
   * 编辑居民信息
   */
  const editorUser = React.useRef() // 通过表单ref，拿到每个数据
  const editor = (i) => {
    // console.log(i)
    const userEditor = userList[i] // 点击每个i，并赋值给userEditor
    setIsModalVisibleEditor(true)
    setUserEditor(userEditor) // 改变userEditor初始化值
    editorUser.current?.setFieldsValue({
      id: userEditor.id,
      name: userEditor.name,
      age: userEditor.age,
      email: userEditor.email,
      professional: userEditor.professional,
      iphone: userEditor.iphone,
      birthday: userEditor.birthday,
      address: userEditor.address
    })
    // console.log("🚀 ~ file: residents.js ~ line 68 ~ editor ~ userEditor", userEditor,editorUser)
  }

  const showEditor = () => {
    setIsModalVisibleEditor(true)
  }

  const editorHandleOk = () => {
    setIsModalVisibleEditor(false);
  };

  const editorHandleCancel = () => {
    setIsModalVisibleEditor(false);
  };

  /**
   * 修改表单提交
   * @param {*} values
   */
  const editorOnFinish = async(values) => {
    const { id,name,age,email,professional,iphone,birthday,address } = values
    // const a = moment(birthday).format('YYYY-MM-DD')
    // console.log("🚀 ~ file: residents.js ~ line 104 ~ editorOnFinish ~ birthday", a)
    const result = await reqUpdataResidentsUser(id,name,age,email,professional,iphone,birthday,address)
    result.status === 200 ? message.success(`修改${name}用户成功!`) : message.error(`修改${name}用户失败!`)
    setIsModalVisibleEditor(false)
    queryUsers()
    // console.log("🚀 ~ file: residents.js ~ line 81 ~ editorOnFinish ~ values", values)
  }

  const editorOnFinishFailed = (errorInfo) => {
    // message.error('请添加用户')
  };

    /**
   * 删除居民用户
   */
    const delUsers = async(i,name) => {
    const result = await reqdelResidents(i)
    if(result.status === 200) {
      message.success(`删除${name}用户成功!`)
      queryUsers() // 重新调用userlist表
    } else {
      message.error(`删除${name}用户失败!`)
    }
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 50,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
    },
    {
      title: '职业',
      dataIndex: 'professional',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'iphone',
      width: 150,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
    }
  ]

  const data = [];
  for (let i = 0; i < userList.length; i++) {
    data.push({
      key: i,
      id: `${i+1}`,
      name: `${userList[i].name}`,
      age: `${userList[i].age}`,
      email: `${userList[i].email}`,
      professional: `${userList[i].professional}`,
      iphone: `${userList[i].iphone}`,
      birthday: `${userList[i].birthday}`,
      address: `${userList[i].address}`,
      operation: <div>
        <Button type="primary" onClick={() => editor(i)}>
          <span onClick={() => showEditor()}>编辑</span>
        </Button>
        <Button
          type="primary"
          danger
          style={{marginLeft:'10px'}}
          onClick={() => delUsers(userList[i].id,userList[i].name)}>删除</Button>
      </div>
    });
  }

  return (
    <div className='residents'>
      {/* 编辑modal */}
      <Modal
          title="添加居民信息"
          footer={null}
          visible={isModalVisibleEditor}
          onOk={editorHandleOk}
          onCancel={editorHandleCancel}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={editorOnFinish}
            onFinishFailed={editorOnFinishFailed}
            autoComplete="off"
            ref={editorUser}
          >
            <Form.Item
              label="id"
              name="id"
              initialValue={userEditor.id}
            >
              <Input disabled={true} size='small' />
            </Form.Item>

            <Form.Item
              label="姓名"
              name="name"
              initialValue={userEditor.name}
              rules={[{ required: true, message: '请添加居民姓名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="年龄"
              name="age"
              rules={[{ required: true, message: '请添加居民年龄!' }]}
              initialValue={userEditor.age}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: '请添加居民邮箱!' }]}
              initialValue={userEditor.email}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="职业"
              name="professional"
              rules={[{ required: true, message: '请添加居民职业!' }]}
              initialValue={userEditor.professional}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手机号码"
              name="iphone"
              rules={[{ required: true, message: '请添加用户手机号码!' }]}
              initialValue={userEditor.iphone}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="生日"
              name="birthday"
              rules={[{ required: true, message: '请添加居民生日!' }]}
              initialValue={userEditor.birthday}
            >
              <Input />
              {/* <DatePicker style={{ width: '50%' }} /> */}
            </Form.Item>

            <Form.Item
              label="居住地址"
              name="address"
              rules={[{ required: true, message: '请添加居民居住地址!' }]}
              initialValue={userEditor.address}
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
      <div>
        <Button type="primary"
          icon={<PlusCircleOutlined />}
          onClick={showModal}
          style={{margin: '10px 0'}}
        >
          添加
        </Button>
        <Modal
          title="添加居民信息"
          footer={null}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请添加居民姓名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="年龄"
              name="age"
              rules={[{ required: true, message: '请添加居民年龄!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: '请添加居民邮箱!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="职业"
              name="professional"
              rules={[{ required: true, message: '请添加居民职业!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手机号码"
              name="iphone"
              rules={[{ required: true, message: '请添加用户手机号码!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="生日"
              name="birthday"
              rules={[{ required: true, message: '请添加居民生日!' }]}
            >
              <Input placeholder='格式: 1999-05-08' />
            </Form.Item>

            <Form.Item
              label="居住地址"
              name="address"
              rules={[{ required: true, message: '请添加居民居住地址!' }]}
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
export default Residents
