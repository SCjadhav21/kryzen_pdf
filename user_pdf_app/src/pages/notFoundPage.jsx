import { Center, Image } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Center>
      <Image
        cursor={"pointer"}
        onClick={() => navigate("/")}
        src="https://media.istockphoto.com/id/1295689699/vector/print.jpg?s=612x612&w=0&k=20&c=o6VzHvVewc4JnDZAAeOMAjl8w6X6cLe0M4ql-flDKdU="
        alt="404 page not found"
      ></Image>
    </Center>
  );
};

export default NotFoundPage;
