import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function will run only once after the initial render
    console.log('Component mounted, fetching user data');

    fetch('https://randomuser.me/api/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUser(data.results[0]); // Extract the first user from the results array
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError(error);
        setLoading(false);
      });

    return () => {
      console.log('Component unmounted');
    };
  },[]); // Empty dependency array

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  if (user) {
    return (
      <div>
        <h2>Random User</h2>
        <img src={user.picture.large} alt={user.name.first + ' ' + user.name.last} />
        <p>Name: {user.name.first} {user.name.last}</p>
        <p>Email: {user.email}</p>
        <p>Location: {user.location.city}, {user.location.country}</p>
      </div>
    );
  }

  return null; // Or some other default state
}

export default MyComponent;