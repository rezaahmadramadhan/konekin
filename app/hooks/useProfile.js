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
    }
  }
`;

export default function useProfile() {
  const [userId, setUserId] = useState(null);
    useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getValueSecure('token');
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.id) {
            setUserId(decoded.id);
          }
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    
    fetchUserId();
  }, []);
  
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });
  
  return {
    loading,
    error,
    user: data?.findUserById || null,
    userId
  };
}
