import React, { useState, useEffect } from "react";
import axios from "axios";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import "./ImageGallery.css";
import "./NavBar.css";
import "./DarkMode.css";
import "./ImagePopup.css";
import Masonry from "@mui/lab/Masonry";
import { TextField, InputAdornment, Modal, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalStyle, setModalStyle] = useState({});

  const UNSPLASH_API_KEY = "Jl3Nx4tfvwigsOqLG0glLEBug0jPu1HzrFT_RWSdgRE";
  const UNSPLASH_API_BASE_URL = "https://api.unsplash.com";

  useEffect(() => {
    fetchImages();
  }, [searchQuery]);

  const fetchImages = () => {
    if (searchQuery === "") {
      // Fetch photos
      axios
        .get(`${UNSPLASH_API_BASE_URL}/photos`, {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
          },
          params: {
            per_page: 20,
          },
        })
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching images: ", error);
        });
    } else {
      // Fetch images based on the searchQuery
      axios
        .get(`${UNSPLASH_API_BASE_URL}/search/photos`, {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
          },
          params: {
            query: searchQuery,
            per_page: 20,
          },
        })
        .then((response) => {
          setImages(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching images: ", error);
        });
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    calculateModalDimensions(image);
  };

  const handleCloseImageCard = () => {
    setSelectedImage(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to calculate modal dimensions
  const calculateModalDimensions = (image) => {
    if (image) {
      const imageAspectRatio = image.width / image.height;
      const maxWidthPercent = 90;
      const maxHeightPercent = 90;
      let maxWidth = window.innerWidth * (maxWidthPercent / 100);
      let maxHeight = window.innerHeight * (maxHeightPercent / 100);

      if (imageAspectRatio > 1 && image.width > maxWidth) {
        maxWidth = image.width;
        maxHeight = maxWidth / imageAspectRatio;
      } else if (image.height > maxHeight) {
        maxHeight = image.height;
        maxWidth = maxHeight * imageAspectRatio;
      }

      setModalStyle({
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      });
    }
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="box">
        <div className="navigation-bar">
          <div className="logo">Image Gallery</div>
          <div className="search-bar-wrapper">
            <TextField
              className="topsearchbar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search Images here"
              color="primary"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="div">
            <div className="text-wrapper">Explore</div>
            <div className="text-wrapper">Collection</div>
            <div className="text-wrapper">Community</div>
          </div>
          <div className="dark-mode-toggle" onClick={toggleDarkMode}>
            Dark Mode
            <div className={`toggle-switch ${isDarkMode ? "on" : "off"}`}></div>
          </div>
        </div>
      </div>

      <div className="hero-section">
        <p className="text-wrapper">Download High-Quality Images by Creators</p>
        <p className="div">
          Over 2.4 million+ stock images by our talented community
        </p>
        <div className="rectangle">
          <TextField
            className="group-child"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search high-resolution images, categories, wallpapers"
            color="primary"
            sx={{ width: 808 }}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="image-grid">
        <Masonry columns={3} spacing={4}>
          {images.map((image) => (
            <div
              className="image-card"
              key={image.id}
              onClick={() => handleImageClick(image)}
            >
              <img
                className="image"
                src={image.urls.small}
                alt={image.description}
              />
              <div className="frame">
                <div className="div">
                  <div className="author-photo-wrapper">
                    <img
                      className="author-photo"
                      alt="Author photo"
                      src={image.user.profile_image.small}
                    />
                  </div>
                  <div className="frame-2">
                    <div className="author-name">{image.user.name}</div>
                    <div className="username">@{image.user.username}</div>
                  </div>
                </div>
                <div className="frame-3">
                  <ThumbUpOffAltIcon />
                  <div className="likes">{image.likes}</div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </div>
      {selectedImage && (
        <Modal open={true} onClose={handleCloseImageCard}>
          <div
            className={`image-popup ${isDarkMode ? "dark-mode" : ""}`}
            style={modalStyle}
          >
            <CloseIcon onClick={handleCloseImageCard} className="close-icon" />
            <div
              className="container"
              style={{ background: isDarkMode ? "#232323" : "#fff" }}
            >
              <div className="image-container">
                <img
                  className="image"
                  src={selectedImage.urls.regular}
                  alt={selectedImage.description}
                />
                <div className="download-button">
                  <a href={selectedImage.links.download} download>
                    <Button
                      variant="contained"
                      style={{ background: "#3CB46E" }}
                    >
                      <b>Download Image</b>
                    </Button>
                  </a>
                </div>
              </div>

              <div className="details">
                <div className="author-photo-wrapper">
                  <img
                    className="author-photo"
                    alt="Author photo"
                    src={selectedImage.user.profile_image.medium}
                  />
                </div>
                <div className="user">
                  <b style={{ color: isDarkMode ? "#E5E5E5" : "#4F4F4F" }}>
                    {selectedImage.user.name}
                  </b>
                  <br />
                  <i style={{ color: "#A7A7A7" }}>
                    @{selectedImage.user.username}
                  </i>
                </div>
                <div className="social-icons">
                  {selectedImage.user.instagram_username && (
                    <div>
                      <InstagramIcon fontSize="small" />/
                      <i>{selectedImage.user.instagram_username}</i>
                    </div>
                  )}
                  {selectedImage.user.twitter_username && (
                    <div>
                      <TwitterIcon fontSize="small" />/
                      <i>{selectedImage.user.twitter_username}</i>
                    </div>
                  )}
                </div>
                <div className="likes">
                  <ThumbUpOffAltIcon /> <b>{selectedImage.likes}</b>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImageGallery;
