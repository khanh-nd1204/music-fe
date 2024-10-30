import {Button, Checkbox, Form, Grid, Input, message, notification, theme, Typography} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {useEffect, useState} from "react";
import {loginUserAPI} from "../../services/auth.service.ts";
import {useNavigate} from "react-router-dom";
import {ResponseType} from "../../types/response.type.ts";
import {UserType} from "../../types/user.type.ts";
import {doLoginAccountAction} from "../../redux/account/accountSlice.ts";
import {useDispatch} from "react-redux";
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const LoginPage = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [loginForm] = Form.useForm();
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [api, contextHolder] = notification.useNotification();

  useEffect(() => {

  }, [])

  // const openNotification = () => {
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <Space>
  //       <Button type="link" size="small" onClick={() => api.destroy()}>
  //         Destroy All
  //       </Button>
  //       <Button type="primary" size="small" onClick={() => api.destroy(key)}>
  //         Confirm
  //       </Button>
  //     </Space>
  //   );
  //   api.open({
  //     message: 'Notification Title',
  //     description:
  //       'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
  //     btn,
  //     key,
  //     onClose: close,
  //   });
  // };

  const onFinish = async (values: UserType) => {
    setLoading(true);
    const res: ResponseType = await loginUserAPI(values);
    setLoading(false);
    if (res && res.data) {
      message.success(res.message);
      dispatch(doLoginAccountAction(res.data));
      navigate("/");
    } else {
      notification.error({
        message: res.error,
        description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
        duration: 3,
      });
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px"
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center"
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100%" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src="../../../public/logo.png" alt="logo" width={100}/>
          <Title style={styles.title}>Login</Title>
          <Text style={styles.text}>
            Welcome back to Music App! Please enter your account below to sign in.
          </Text>
        </div>
        <Form
          form={loginForm}
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Invalid email!'
              },
              {
                max: 50,
                message: 'Email must be less than 50 characters',
              },
            ]}
          >
            <Input
              size="large"
              addonBefore={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                max: 20,
                min: 6,
                message: "Password must be between 6 and 20 characters",
              }
            ]}
          >
            <Input.Password
              size="large"
              addonBefore={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link style={styles.forgotPassword} href="">
              Forgot password?
            </Link>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block={true} onClick={() => loginForm.submit()} loading={loading}>
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="/register">Register now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default LoginPage