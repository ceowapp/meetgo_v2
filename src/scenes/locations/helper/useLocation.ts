import Geolocation from 'react-native-geolocation-service';
import useToast from 'components/Toast/useToast';
import {useState} from 'react';
import locationApi from '../redux/api';
import {IReqLocationSearch, IReqNearByMe, IResNearByMe} from '../redux/type';
import {isValidResponse} from 'utils/Utility';
import appConstant from 'constant/appConstant';
import {IMeta, IResponseType, IStatus} from 'constant/commonType';
import {useAppSelector} from 'storeConfig/hook';
import {AuthSelector} from 'scenes/auth/redux/slice';
const useLocation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentMetaPage, setCurrentMetaPage] = useState<IMeta>({} as IMeta);
  const [listLocationNear, setListLocationNear] = useState<IResNearByMe[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    currentLat: number;
    currentLong: number;
  }>();
  const account = useAppSelector(AuthSelector.getAccount);
  const {addToast} = useToast();

  const getCurrentPosition = () => {
    return new Promise(
      (
        resolve: ({
          currentLat,
          currentLong,
        }: {
          currentLat: number;
          currentLong: number;
        }) => void,
        reject: (val: Geolocation.GeoError) => void,
      ) => {
        Geolocation.getCurrentPosition(
          currLocation => {
            let dataCurr = {
              currentLat: appConstant.LOCATION_BEN_THANH.latitude,
              currentLong: appConstant.LOCATION_BEN_THANH.longitude,
            };
            if (currLocation) {
              dataCurr = {
                currentLat: currLocation.coords.latitude,
                currentLong: currLocation.coords.longitude,
              };
            }
            setCurrentLocation(dataCurr);
            resolve(dataCurr);
          },
          error => {
            reject(error);
          },
          {
            timeout: 10000,
            maximumAge: 10000,
            accuracy: {
              android: 'balanced',
              ios: 'best',
            },
            forceRequestLocation: true,
          },
        );
      },
    );
  };

  const getLocationNearByMe = async (reqPage: number) => {
    try {
      setLoading(true);
      reqPage === 1 && setListLocationNear([]);
      let resultLocation = currentLocation;
      // resultLocation = {
      //   currentLat: 10.710169651219642,
      //   currentLong: 106.6291218996048,
      // };
      if (!resultLocation) {
        resultLocation = await getCurrentPosition();
      }
      if (resultLocation) {
        const reqNearByMe: IReqNearByMe = {
          currentPage: reqPage,
          ...resultLocation,
        };
        const resNearByMe = await locationApi.getLocationNearByMe(reqNearByMe);
        if (isValidResponse(resNearByMe)) {
          if (reqPage > 1) {
            setListLocationNear([...listLocationNear, ...resNearByMe.data]);
          } else {
            setListLocationNear(resNearByMe.data);
          }
          if (resNearByMe.meta && reqPage <= resNearByMe.meta.totalPages) {
            setCurrentMetaPage(resNearByMe.meta);
          }
        }
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onLoadMore = (page: number) => {
    const nextPage = page + 1;
    if (nextPage <= currentMetaPage?.totalPages) {
      getLocationNearByMe(nextPage);
    }
  };

  const onSearch = async (search: string) => {
    try {
      setLoading(true);
      setListLocationNear([]);
      let resultLocation = currentLocation;
      // resultLocation = {
      //   currentLat: 10.710169651219642,
      //   currentLong: 106.6291218996048,
      // };
      if (resultLocation) {
        const dataSearch: IReqLocationSearch = {
          account,
          keyword: search,
          ...resultLocation,
        };
        const resultSearch = await locationApi.searchLocationNearByMe(
          dataSearch,
        );
        if (isValidResponse(resultSearch)) {
          setListLocationNear(resultSearch.data);
        }
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    listLocationNear,
    currentMetaPage,
    getLocationNearByMe,
    onLoadMore,
    onSearch,
  };
};
export default useLocation;
