import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
=======

>>>>>>> 968c6934462fa8b489e41eb55dd21454806bade5
export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);

    Meteor.loginWithPassword(email, password, (error) => {
      setIsLoading(false);

      if (error) {
        setError((error as Meteor.Error)?.reason || 'Login Failed.');
      } else {
        navigate('/jobs');
      }
    });
  };

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    handleLogin,
  };
<<<<<<< HEAD
};
=======
};
>>>>>>> 968c6934462fa8b489e41eb55dd21454806bade5
