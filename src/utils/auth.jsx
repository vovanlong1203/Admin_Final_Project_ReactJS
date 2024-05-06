// // utils/auth.js
import {jwtDecode} from 'jwt-decode';

export function checkAuth() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (expirationTime < currentTime) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error decoding accessToken:', error);
      return false;
    }
  } else {
    return false;
  }

}
