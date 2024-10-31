import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  useToast,
  ModalOverlay,
  ModalContent,
  Modal,
  FormErrorMessage,
  FormLabel,
  PinInput,
  PinInputField, HStack,
} from '@chakra-ui/react'
import * as Yup from "yup";
import {ResponseType} from "../../types/response.type.ts";
import {resetUserPasswordAPI} from "../../services/auth.service.ts";
import {Field, Form, Formik, FormikHelpers} from "formik";

interface Props {
  isOpenPass: boolean;
  setIsOpenPass: (isOpen: boolean) => void;
  email: string;
}

interface FormValues {
  otp: string;
  newPassword: string;
}

const validationSchema = Yup.object().shape({
  newPassword: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!'),
  otp: Yup.string().required('OTP is required').matches(/^\d{6}$/, 'OTP must be exactly 6 digits and numeric!')
})

const ResetPassword = (props: Props) => {
  const {isOpenPass, setIsOpenPass, email} = props;
  const initialValues: FormValues = { otp: '', newPassword: '' };
  const toast = useToast();

  const reset = () => {

  }

  const handleReset = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const data = {email, otp: parseInt(values.otp), newPassword: values.newPassword};
    const res: ResponseType = await resetUserPasswordAPI(data);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
      setIsOpenPass(false);
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
    <Modal isOpen={isOpenPass} onClose={reset} closeOnOverlayClick={false} isCentered>
      <ModalOverlay/>
      <ModalContent mx={{ base: 4 }}>
        <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleReset}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={4} px={8} my={8}>
                <Heading lineHeight={1.1} size={{ base: 'sm', md: 'md' }}>
                  Enter new password
                </Heading>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.otp && touched.otp} isRequired>
                    <FormLabel htmlFor="otp">OTP</FormLabel>
                    <HStack>
                      <Field name="otp">
                        {({ field, form }) => (
                          <PinInput
                            otp
                            type="number"
                            value={field.value}
                            onChange={(value) => form.setFieldValue(field.name, value)}
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        )}
                      </Field>
                    </HStack>
                    <FormErrorMessage>{errors.otp}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.newPassword && touched.newPassword} isRequired>
                    <FormLabel htmlFor="newPassword">Password</FormLabel>
                    <Field as={Input} id="newPassword" name="newPassword" type="password" />
                    <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                  </FormControl>

                  <Button
                    colorScheme={'blue'}
                    variant={'solid'}
                    type="submit"
                    isLoading={isSubmitting}
                    mt={4}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Form>
            )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default ResetPassword