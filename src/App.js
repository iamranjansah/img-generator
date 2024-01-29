import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';

const Container = styled.div`
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
  border-radius: 0 4px 4px 0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadMoreButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #555;
`;

const NoContentText = styled.p`
  font-size: 16px;
  color: #555;
`;

const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PreviewImage = styled.img`
  max-width: 80%;
  max-height: 80%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
          params: {
            query: searchTerm,
            per_page: 10,
            page,
            client_id: 'YOUR_UNSPLASH_ACCESS_KEY',
          },
        });

        if (response.data.results.length === 0) {
          setAllImagesLoaded(true);
        } else {
          setImages((prevImages) => [...prevImages, ...response.data.results]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() !== '') {
      fetchData();
    }
  }, [searchTerm, page]);

  const handleDownload = async (url, imageName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageName || 'image.jpg';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    setAllImagesLoaded(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query: searchTerm,
          per_page: 10,
          page,
          client_id: '2_05U8KMf_PwabDru5XE3oK7xnwTVcmAl4LFmHf9-Vc',
        },
      });

      if (response.data.results.length === 0) {
        setAllImagesLoaded(true);
      } else {
        setImages((prevImages) => [...prevImages, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Container>
      <h1>Image Search</h1>

      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
      {loading && <LoadingText>Loading...</LoadingText>}
      {!loading && images.length === 0 && (
        <NoContentText>No content found.</NoContentText>
      )}
      <ImageContainer>
        {images.map((image) => (
          <ImageWrapper key={image.id}>
            <Image
              src={image.urls.small}
              alt={image.alt_description}
              onClick={() => handlePreview(image.urls.full)}
            />
            <DownloadButton onClick={() => handleDownload(image.urls.full, image.id)}>
              Download
            </DownloadButton>
          </ImageWrapper>
        ))}
      </ImageContainer>

      {previewImage && (
        <PreviewOverlay onClick={closePreview}>
          <PreviewImage src={previewImage} alt="Preview" />
        </PreviewOverlay>
      )}

      {!allImagesLoaded && images.length > 0 && !loading && (
        <LoadMoreButton onClick={handleLoadMore}>
          {loading ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
      <p>
        <a href='https://www.instagram.com/iamranjansah' target='_blank' >@iamranjansah</a>
      </p>

    </Container>
  );
};

export default App;
