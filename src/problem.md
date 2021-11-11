#### 1、遇到的问题
```
1、Switch在react-router里面，前面一直以为在react-router-dom里面
2、在登录成功后跳转admin页面时，出现清空用户信息后，无法跳转到login。原因是无法判断本身(!user ===> 返回的是false，if里面无法执行)，需要判断它的属性
```