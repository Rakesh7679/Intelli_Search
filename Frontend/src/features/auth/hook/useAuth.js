import {useDispatch} from 'react-redux';
import {register,login,getMe} from '../service/auth.api';
import {setUser,setLoading,setError} from '../auth.slice';

export function useAuth(){
    const dispatch = useDispatch();

async function handaleRegister({username,email,password}){
    try{
        dispatch(setLoading(true));
        const data = await register({username,email,password});
        dispatch(setUser(data.user));

    }
    catch(error){
        dispatch(setError(error.message));
    }
    finally{
        dispatch(setLoading(false));
    }
  }

async function handaleLogin({email,password}){
    try{
        dispatch(setLoading(true));
        const data = await login({email,password});
        dispatch(setUser(data.user));
    }
    catch(error){
        dispatch(setError(error.message));
    }
    finally{
        dispatch(setLoading(false));
    }

  }

async function handaleGetMe(){
    try{
        dispatch(setLoading(true));
        const data = await getMe();
        dispatch(setUser(data.user));
    }
    catch(error){
        dispatch(setError(error.message));
    }
    finally{
        dispatch(setLoading(false));
    }
  }

  return {
    handaleRegister,
    handaleLogin,
    handaleGetMe
  }

}