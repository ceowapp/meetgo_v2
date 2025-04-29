import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderSearch from './HeaderSearch';
import {PermissionStatus, RESULTS} from 'react-native-permissions';
import {Permission as PermissionApp} from 'manager/appPermission';
import SectionCheckLocation from './SectionCheckLocation';
import SectionBlockedLocation from './SectionBlockedLocation';
import useLocation from 'scenes/locations/helper/useLocation';
import SectionEmptyLocation from './SectionEmptyLocation';
import {IResNearByMe} from 'scenes/locations/redux/type';
import SkeletonLocation from './SkeletonLocation';
import ItemLocation from './ItemLocation';
import LineBreak from 'components/LineBreak';
import {useScrollToTop} from '@react-navigation/native';
import {useAppSelector} from 'storeConfig/hook';
import {appStateSelector} from 'services/appstate/slice';
import LinearGradient from 'react-native-linear-gradient';
import Screen, {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {shadow} from 'utils/mixins';
import {BOTTOM_TAB_HEIGHT} from 'utils/spacing';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    height: resWidth(85),
    justifyContent: 'flex-end',
    ...shadow(),
  },
  header: {
    fontFamily: 'Roboto-bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.primaryWhite,
    paddingBottom: SPACING.m_16,
    textAlign: 'center',
  },
});
const LocationNFTScreens = () => {
  const { t } = useTranslation();
  const [resultPermission, setResultPermission] = useState<PermissionStatus>();
  const appState = useAppSelector(appStateSelector.getAppState);
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);
  const {
    loading,
    listLocationNear,
    onLoadMore,
    currentMetaPage,
    onSearch,
    getLocationNearByMe,
  } = useLocation();
  const callOnEndReached = useRef<boolean>(false);

  const checkPermissionLocation = async () => {
    const result = await PermissionApp.checkPermission('location');
    setResultPermission(result);
  };

  useLayoutEffect(() => {
    if (appState === 'active') {
      checkPermissionLocation();
    }
  }, [appState]);

  useEffect(() => {
    if (resultPermission === RESULTS.GRANTED) {
      getLocationNearByMe(1);
    }
  }, [resultPermission]);

  const onRefresh = () => {
    getLocationNearByMe(1);
  };

  const onBeginScroll = () => {
    callOnEndReached.current = true;
  };
  const handleLoadMore = () => {
    if (callOnEndReached.current) {
      onLoadMoreLocation();
      callOnEndReached.current = false;
    }
  };
  const onLoadMoreLocation = useCallback(() => {
    onLoadMore(currentMetaPage.currentPage);
  }, [currentMetaPage]);

  const dataEmpty = () => {
    if (loading) {
      return <SkeletonLocation />;
    }
    return <SectionEmptyLocation />;
  };

  const renderItem: ListRenderItem<IResNearByMe> = ({item}) => (
    <ItemLocation item={item} />
  );
  const seperator = () => <LineBreak />;

  const keyExtract = (item: IResNearByMe) => item.id || item.key;

  const hideKeyboard = () => Keyboard.dismiss();
  const headerInfo = (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{t('location.nearby_location')}</Text>
    </View>
  );
  const renderContent = () => {
    if (resultPermission === RESULTS.DENIED || resultPermission === undefined) {
      return <SectionCheckLocation setResultPermission={setResultPermission} />;
    }
    if (resultPermission !== RESULTS.GRANTED) {
      return (
        <SectionBlockedLocation
          setResultPermission={setResultPermission}
          resultPermission={resultPermission}
        />
      );
    }
    return (
      <>
        <HeaderSearch onSearch={onSearch} />
        <FlatList
          ref={flatListRef}
          data={listLocationNear}
          renderItem={renderItem}
          keyExtractor={keyExtract}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={onBeginScroll}
          onMomentumScrollBegin={onBeginScroll}
          onResponderStart={hideKeyboard}
          ListEmptyComponent={dataEmpty}
          ItemSeparatorComponent={seperator}
          contentContainerStyle={{
            paddingBottom: BOTTOM_TAB_HEIGHT + SPACING.m_16,
          }}
          onEndReached={handleLoadMore}
        />
      </>
    );
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      {headerInfo}
      {renderContent()}
    </LinearGradient>
  );
};
export default LocationNFTScreens;
