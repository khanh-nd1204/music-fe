import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalFooter, FormErrorMessage,
} from '@chakra-ui/react'
import {useState} from "react";
import * as Yup from "yup";
import {ResponseType} from "../../types/response.type.ts";
import {resendMailAPI} from "../../services/auth.service.ts";
import ResetPassword from "./reset-password.tsx";

interface Props {
  type: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const validationSchema =
  Yup.string().required('Email is required!').email('Invalid email!');

const SendMail = (props: Props) => {
  const {isOpen, setIsOpen, type} = props;
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState();
  const [isOpenPass, setIsOpenPass] = useState(false);

  const reset = () => {
    setEmail('');
    setIsOpen(false);
  }

  const handleRequest = async () => {
    try {
      await validationSchema.validate(email);
      setError(undefined);
      const res: ResponseType = await resendMailAPI({email, type});
      if (res && res.data) {
        setIsOpenPass(true);
        setIsOpen(false);
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
    } catch (validationError: Yup.ValidationError) {
      setError(validationError.message);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={reset} closeOnOverlayClick={false} isCentered>
        <ModalOverlay/>
        <ModalContent mx={{ base: 4 }}>
          <Stack spacing={4} px={8} my={8}>
            <Heading lineHeight={1.1} size={{ base: 'sm', md: 'md' }}>
              {type === 'password' ? 'Forgot your password?' : 'Activate account'}
            </Heading>
            <Text
              fontSize={{ base: 'sm', sm: 'md' }}
              color={useColorModeValue('gray.800', 'gray.400')}>
              You&apos;ll get an email with a OTP
            </Text>
            <FormControl isInvalid={error} isRequired>
              <Input
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </Stack>
          <ModalFooter>
            <Button
              colorScheme={'blue'}
              variant={'solid'}
              onClick={handleRequest}
            >
              Request
            </Button>
            <Button colorScheme='gray' ml={3} onClick={reset}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ResetPassword isOpenPass={isOpenPass} setIsOpenPass={setIsOpenPass} email={email} />
    </>
  )
}

export default SendMail