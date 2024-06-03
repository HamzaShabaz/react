import { UserContext } from '../contexts/UserContext.jsx';
import { useContext } from 'react';

export const useUser = () => {
    return useContext(UserContext);
}