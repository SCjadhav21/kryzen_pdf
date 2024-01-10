import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Button,
  useDisclosure,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { AddContext } from "../context/AppContext";
const EditeProfile = ({ openEdit, setOpenEdit, setRefresh, refresh }) => {
  const { state } = useContext(AddContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputData, setinputData] = useState({
    name: "",
    file: "",
    address: "",
    age: "",
  });
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const handelSubmit = (e) => {
    e.preventDefault();
    if (
      !inputData.name ||
      !inputData.file ||
      !inputData.address ||
      !inputData.age
    ) {
      alert("Add All inputs");
    } else {
      let formData = new FormData();
      formData.append("file", inputData.file);
      formData.append("name", inputData.name);
      formData.append("age", inputData.age);
      formData.append("address", inputData.address);

      axios
        .post("https://kryzen-udsv.onrender.com/uploaddata", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: state.token,
          },
        })
        .then((response) => {
          if (response.data.message == "User updated successfully") {
            setRefresh(!refresh);
            setinputData("");
            alert("User updated successfully");
            setOpenEdit(false);
          } else {
            alert("error while updating");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handelChangeInput = (e) => {
    let { name, value } = e.target;
    if (name == "age") {
      value = +value;
    }
    if (name == "file") {
      setinputData({ ...inputData, file: e.target.files[0] });
    } else {
      setinputData({ ...inputData, [name]: value });
    }
  };

  useEffect(() => {
    onOpen();
  }, []);
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form action="" onSubmit={handelSubmit}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={handelChangeInput}
                  value={inputData.name}
                  name="name"
                  isRequired
                  ref={initialRef}
                  placeholder="Name..."
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Age</FormLabel>
                <Input
                  onChange={handelChangeInput}
                  value={inputData.age}
                  name="age"
                  type="number"
                  isRequired
                  placeholder="Age..."
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Address</FormLabel>
                <Input
                  onChange={handelChangeInput}
                  value={inputData.address}
                  name="address"
                  isRequired
                  placeholder="Address..."
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Profile Photo</FormLabel>
                <Input
                  onChange={handelChangeInput}
                  name="file"
                  isRequired
                  type="file"
                  placeholder="profile..."
                />
              </FormControl>
              <Button type="submit" mt={10} colorScheme="blue" mr={3}>
                Save
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                setOpenEdit(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditeProfile;
