import useToast from 'components/Toast/useToast';
import {IResponseType, IStatus} from 'constant/commonType';
import {useState} from 'react';
import {isValidResponse} from 'utils/Utility';
import locationApi from '../redux/api';
import {IReqNearByMap, IResNearByMap} from '../redux/type';

const useLocationMap = () => {
  const [listLocationMap, setListLocationMap] = useState<IResNearByMap[]>([]);
  const {addToast} = useToast();
  const getLocationNearByMap = async (data: IReqNearByMap) => {
    try {
      const resLocationMaps = await locationApi.getLocationNearByMap(data);
      if (isValidResponse(resLocationMaps)) {
        setListLocationMap(resLocationMaps.data);
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message,
        position: 'top',
        type: 'ERROR_V3',
      });
    }
  };
  return {
    getLocationNearByMap,
    listLocationMap,
  };
};
export default useLocationMap;
