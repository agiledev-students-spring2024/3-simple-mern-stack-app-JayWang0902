import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

function AboutUs() {
  const [aboutData, setAboutData] = useState({ title: '', content: [], imageUrl: '' });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`) // Use axios and environmental variable for API endpoint
      .then(response => {
        setAboutData(response.data); // Axios automatically parses the JSON, so you access response.data directly
      })
      .catch(error => {
        console.error('Error fetching about data:', error);
      });
  }, []);

  return (
    <div>
      <h1>{aboutData.title}</h1>
      {aboutData.content.map((paragraph, index) => ( // Correctly handle content as an array
        <p key={index}>{paragraph}</p>
      ))}
      <img src={aboutData.imageUrl} alt="About Us" style={{ width: '200px', height: 'auto' }}/>
    </div>
  );
}

export default AboutUs;
