import axios from 'axios';

 const BASE_URL = 'https://pixabay.com/api/'
 const API_KEY = '39409581-90aaf96fc057cbb581f460bc3'

export const fetchImg = async (searchQuery, page) => {
  const queryParams = new URLSearchParams({
  key: API_KEY,
  q: searchQuery,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page,
  });
  
  try {
    const response = await axios.get(`${BASE_URL}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Ooops...Something went wrong');
  }
};
  

  