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
import registerBg from "../../../public/register-bg.jpg";
import {registerUserAPI} from "../../services/auth.service.ts";
import {ResponseType} from "../../types/response.type.ts";
import VerifyEmail from "../../components/account/verify.tsx";
import {useState} from "react";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").min(2, 'Name must be at least 2 characters!'),
  email: Yup.string().required('Email is required!').email('Invalid email!'),
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!'),
})

const RegisterPage = () => {
  const initialValues: FormValues = { name: '', email: '', password: '' };
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await registerUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      setIsOpen(true);
      setEmail(values.email);
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
                    <Heading size={'lg'}>Get Started!</Heading>
                    <Image
                      borderRadius='full'
                      boxSize={32}
                      src={logo}
                      alt={'Logo'}
                    />
                  </Stack>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.name && touched.name} isRequired>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Field as={Input} id="name" name="name" type="text" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email && touched.email} isRequired>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Field as={Input} id="email" name="email" type="email" />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password && touched.password} isRequired>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field as={Input} id="password" name="password" type="password" />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Button
                    colorScheme={'blue'}
                    variant={'solid'}
                    type="submit"
                    isLoading={isSubmitting}
                    mt={8}
                    w={'full'}
                  >
                    Register
                  </Button>
                  <Stack pt={6}>
                    <Text align={'center'}>
                      Already a user? <Link color={'blue.400'} href={'/login'}>Login</Link>
                    </Text>
                  </Stack>
                </Form>
              </Stack>
            )}
          </Formik>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Register Image'}
            objectFit={'cover'}
            src={registerBg}
          />
        </Flex>
      </Stack>
      <VerifyEmail isOpen={isOpen} email={email}/>
    </>
  )
}

export default RegisterPage