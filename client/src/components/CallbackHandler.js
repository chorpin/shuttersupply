import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate} from 'react-router-dom';
import { setJwtToken, login } from '../actions/authActions';

const CallbackHandler = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate =useNavigate()

  useEffect(() => {
    // 这里需要解析jwtToken，这取决于您的具体实现
    // 例如，jwtToken可能是URL查询参数的一部分
    const queryParams = new URLSearchParams(location.search);
    const jwtToken = queryParams.get('jwtToken');

    if (jwtToken) {
      dispatch(setJwtToken(jwtToken));
      dispatch(login());
      // 这里您可以将用户重定向到应用的其他部分
      console.log('should navigate to main page...')
      navigate('/')
    }
  }, [dispatch, location]);

  return <div>Processing .....</div>;
};

export default CallbackHandler;
