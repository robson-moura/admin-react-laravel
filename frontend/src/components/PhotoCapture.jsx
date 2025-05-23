import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Webcam from "react-webcam";

const PhotoCapture = ({
  photo,
  onPhotoChange,
  disabled = false,
  label = "Foto",
  previewSize = 120,
}) => {
  const fileInputRef = useRef();
  const webcamRef = useRef();
  const [showWebcam, setShowWebcam] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (photo instanceof File) {
      setPhotoPreview(URL.createObjectURL(photo));
    } else if (typeof photo === "string" && photo) {
      setPhotoPreview(photo);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onPhotoChange(file);
  };

  const handleCapturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const arr = imageSrc.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "webcam-photo.jpg", { type: mime });
      onPhotoChange(file);
      setShowWebcam(false);
    }
  };

  return (
    <>
      <div
        style={{
          width: previewSize,
          height: previewSize,
          marginBottom: 8,
          marginTop: 30,
        }}
      >
        <img
          src={photoPreview || "/default-avatar.png"}
          alt="Preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
            border: "1px solid #ccc",
          }}
        />
      </div>
      {!disabled && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current.click()}
            className="mb-2"
          >
            Selecionar {label}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowWebcam(true)}
          >
            Tirar Foto com Câmera
          </Button>
        </>
      )}

      <Modal show={showWebcam} onHide={() => setShowWebcam(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tirar Foto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "user",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWebcam(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCapturePhoto}>
            Capturar Foto
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PhotoCapture;