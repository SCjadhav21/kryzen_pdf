import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  useDisclosure,
  Box,
  Text,
  FormLabel,
  Input,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";
import { AddContext } from "../context/AppContext";

const Login = () => {
  const { state, setState } = React.useContext(AddContext);

  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => setShow(!show);

  const handleChange = (e) => {
    const { value, name } = e.target;

    setData({ ...data, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    if (data.username && data.password) {
      axios("https://kryzen-udsv.onrender.com/user/login", {
        method: "POST",
        data: data,
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200 && res.data.msg == "Login Successfull") {
            toast({
              title: "Login Successfull",
              description: "You've Logged In your account.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            localStorage.setItem(
              "user",
              JSON.stringify({
                name: res.data.name,
                token: res.data.token,
              })
            );
            setState({
              ...state,
              token: res.data.token,
              userName: res.data.name,
            });

            setLoading(false);
          } else {
            toast({
              title: "Wrong Credentials",
              description: "Please Check your Email or Password.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          let message = err.message;
          toast({
            title: "Error",
            description: { message },
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Some filed are Empty",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    onOpen();
  }, []);

  if (state.token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <Box w={["", "", "100vh"]} bgColor="#fff" p="10px" display="flex">
            <Box w={["100%", "100%", "70%"]}>
              <ModalHeader
                p="0px 20px 0px 20px"
                display="flex"
                gap="10%"
                justifyContent="space-between"
              >
                <Box display="flex" gap="10%" w="80%">
                  {" "}
                  <Text
                    color="#24a3b5"
                    padding="0 8px "
                    borderBottom="2px solid #24a3b5"
                  >
                    <Link to="/login">LOGIN</Link>
                  </Text>
                  <Text color="#24a3b5" padding="0 8px 8px">
                    <Link to="/signup">REGISTER</Link>
                  </Text>
                </Box>
                <Box fontSize={15} fontWeight="bold">
                  <Button
                    bgColor="#fff"
                    border="1px solid #E8F0FE"
                    onClick={() => navigate("/")}
                  >
                    {" "}
                    <CloseIcon />
                  </Button>
                </Box>
              </ModalHeader>

              <Box p="20px 20px 0px 20px">
                <form onSubmit={handelSubmit} isRequired>
                  <FormLabel
                    borderBottom="1px solid #ddd"
                    width="100%"
                    fontSize="14px"
                    padding="6px 0px"
                    color="#212121"
                  >
                    UserName
                  </FormLabel>

                  <Input
                    name="username"
                    onChange={handleChange}
                    value={data.username}
                    isRequired
                    type="text"
                    placeholder="Enter username"
                  />

                  <FormLabel
                    borderBottom="1px solid #ddd"
                    width="100%"
                    fontSize="14px"
                    padding="6px 0px"
                    color="#212121"
                  >
                    Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                      isRequired
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  <FormLabel></FormLabel>
                  <Button
                    textAlign="center "
                    fontSize="16px"
                    fontWeight="500"
                    borderRadius="3px"
                    backgroundClip="padding-box"
                    border="2px solid #FF7558"
                    outline="none"
                    padding="auto 20px"
                    whiteSpace="nowrap"
                    bgGradient="linear(0deg,#ff934b 0%,#ff5e62 100%)"
                    type="submit"
                    color="#fff"
                    isLoading={loading}
                    loadingText="Loading"
                    colorScheme="#FF7558"
                    spinnerPlacement="end"
                  >
                    Login
                  </Button>
                </form>
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
