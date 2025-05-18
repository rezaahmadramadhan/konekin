import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getValueSecure } from '../helpers/secureStore';
import { decodeToken } from '../helpers/jwtDecode';

const GET_USER = gql`
  query Query($id: ID) {
    findUserById(id: $id) {
      _id
      name
      username
      email
      userFollowers {
        _id
        name
        username
      }
      userFollowings {
        _id
        name
        username
      }
    }
  }
`;

export default function useProfile() {  
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setIsLoading(true);
        const token = await getValueSecure('token');
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.id) {
            setUserId(decoded.id);
          } else {
            console.error('Token decoded but no ID found');
          }
        } else {
          console.error('No token found in secure store');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserId();
  }, []);
    const { loading: queryLoading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
    onError: (error) => {
      console.error('Error fetching user data:', error);
    }
  });
  
  return {
    loading: isLoading || queryLoading,
    error,
    user: data?.findUserById || null,
    userId
  };
}
