import { Box, Button, Center, Image, Img, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AddContext } from "../context/AppContext";
import "../css/editeButton.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import EditeProfile from "./editeProfile";

const ViewProfile = () => {
  const [userData, setUserData] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { state, setState } = React.useContext(AddContext);

  const createPdfAndDownload = async (userData) => {
    const name = userData.name ? userData.name : "";
    const age = userData.age ? userData.age : "";
    const username = userData.username ? userData.username : "";
    const address = userData.address ? userData.address : "";
    const photo = userData.photo
      ? `https://kryzen-udsv.onrender.com/${userData.photo}`
      : "";
    const imageHeight = 200;
    const imageWidth = 200;

    try {
      const pdfDoc = await PDFDocument.create();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      // Center the text on the page
      const textOptions = {
        font,
        size: 14,
        color: rgb(0, 0, 0),
      };

      const textX = (width - 140) / 2;

      page.drawText(`Name: ${name}`, {
        x: textX,
        y: height - 300,
        ...textOptions,
      });

      page.drawText(`Age: ${age}`, {
        x: textX,
        y: height - 320,
        ...textOptions,
      });

      page.drawText(`Address: ${address}`, {
        x: textX,
        y: height - 340,
        ...textOptions,
      });

      page.drawText(`Username: ${username}`, {
        x: textX,
        y: height - 360,
        ...textOptions,
      });

      // Display the image at the top
      const imageResponse = await fetch(photo);

      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`
        );
      }

      const imageBytes = await imageResponse.arrayBuffer();
      const imageExtension = photo.split(".").pop().toLowerCase();
      let image;
      if (imageExtension === "jpg") {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (imageExtension === "jpeg") {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (imageExtension === "png") {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error(`Unsupported image format: ${imageExtension}`);
      }
      // Center the image horizontally
      const imageX = width / 2 - imageWidth / 2;

      page.drawImage(image, {
        x: imageX,
        y: height - 50 - imageHeight,
        width: imageWidth,
        height: imageHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "UserData.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const downloadPdf = () => {
    let res = window.confirm("are you sure you want to download the PDF?");
    if (res == true) {
      createPdfAndDownload(userData);
    }
  };

  useEffect(() => {
    axios
      .get(`https://kryzen-udsv.onrender.com/user`, {
        headers: {
          authorization: state.token,
        },
      })
      .then((res) => setUserData(res.data[0]))
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <Center>
      <Box>
        <Center>
          <Text padding={"20px"} fontWeight={"bold"} fontSize={"25px"}>
            Profile
          </Text>
        </Center>
        <Center>
          {" "}
          <Box
            padding={"20px"}
            margin={"20px"}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
          >
            <Box>userName: {userData.username}</Box>
            <Box>
              Name: {userData.name ? userData.name : "not added in profile"}
            </Box>
            <Box>
              Age: {userData.age ? userData.age : "not added in profile"}
            </Box>
            <Box>
              {" "}
              Address:{" "}
              {userData.address ? userData.address : "not added in profile"}
            </Box>
            <Box>
              Profile_Image:{" "}
              {userData.photo ? (
                <Image
                  width={"200px"}
                  height={"200px"}
                  src={`https://kryzen-udsv.onrender.com/${userData.photo}`}
                />
              ) : (
                "not added in profile"
              )}
            </Box>
          </Box>
        </Center>
        {!userData.name &&
          !userData.photo &&
          !userData.address &&
          !userData.age && (
            <Center>
              <button onClick={() => setOpenEdit(true)} className="button-29">
                Add profile data
              </button>
            </Center>
          )}
        {userData.name &&
          userData.photo &&
          userData.address &&
          userData.age && (
            <Center>
              <button onClick={downloadPdf} className="button-29">
                Download Your Data Pdf
              </button>
            </Center>
          )}
      </Box>
      {openEdit && (
        <EditeProfile
          setRefresh={setRefresh}
          refresh={refresh}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
        />
      )}
    </Center>
  );
};

export default ViewProfile;
