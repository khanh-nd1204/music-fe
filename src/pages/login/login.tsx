import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Text,
  FormErrorMessage,
  Link,
  useToast
} from "@chakra-ui/react";
import * as Yup from 'yup';
import {Field, Form, Formik, FormikHelpers} from "formik";
import logo from "../../../public/logo.png";
import loginBg from "../../../public/login-bg.jpg";
import {loginUserAPI} from "../../services/auth.service.ts";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {doLoginAccountAction} from "../../redux/account/accountSlice.ts";
import {ResponseType} from "../../types/response.type.ts";
import {useState} from "react";
import SendMail from "../../components/account/send-mail.tsx";

interface FormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Email is required!').email('Invalid email!'),
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!'),
})

const LoginPage = () => {
  const initialValues: FormValues = { username: '', password: '' };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('');

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await loginUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
      dispatch(doLoginAccountAction(res.data));
      navigate("/");
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
    }
  }

  const resetPassword = () => {
    setIsOpen(true);
    setType('password');
  }

  return (
    <>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Stack spacing={4} w={'full'} maxW={'md'}>
                <Form>
                  <Stack align={'center'}>
                    <Heading size={'lg'}>Welcome Back!</Heading>
                    <Image
                      borderRadius='full'
                      boxSize={32}
                      src={logo}
                      alt={'Logo'}
                    />
                  </Stack>

                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.username && touched.username} isRequired>
                      <FormLabel htmlFor="username">Email</FormLabel>
                      <Field as={Input} id="username" name="username" type="email" />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password && touched.password} isRequired>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field as={Input} id="password" name="password" type="password" />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                  </Stack>

                  <Stack spacing={4} mt={4}>
                    <Button colorScheme={'blue'} fontWeight={'normal'} variant={'link'} ml={'auto'}
                            onClick={resetPassword}>
                      Forgot password?
                    </Button>
                    <Button
                      colorScheme={'blue'}
                      variant={'solid'}
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Login
                    </Button>
                  </Stack>

                  <Stack mt={4}>
                    <Text align={'center'}>
                      Don't have an account? <Link color={'blue.400'} href={'/register'}>Register</Link>
                    </Text>
                  </Stack>
                </Form>
              </Stack>
            )}
          </Formik>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={loginBg}
          />
        </Flex>
      </Stack>
      <SendMail isOpen={isOpen} setIsOpen={setIsOpen} type={type}/>
    </>
  )
}

export default LoginPage