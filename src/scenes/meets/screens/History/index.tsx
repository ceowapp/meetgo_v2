import {useNavigation, useScrollToTop} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import LineBreak from 'components/LineBreak';
import {STACK_NAVIGATOR} from 'navigation/types';
import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SectionEmpty from 'scenes/meets/components/SectionEmpty';
import SkeletonHistory from 'scenes/meets/components/SkeletonHistory';
import {useMeet} from 'scenes/meets/helper/useMeet';
import {IResHistoryMeet} from 'scenes/meets/redux/types';
import Screen, {resWidth} from 'utils/Screen';
import {SPACING} from 'utils/styleGuide';
import ItemHistory from './ItemHistory';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
  container: {
    padding: SPACING.m_16,
  },
});
const HistoryMeetScreen = () => {
  const { t } = useTranslation();
  const {loading, getHistoryMeet, listHistoryMeet, account} = useMeet();
  const {navigate} = useNavigation();
  const {top} = useSafeAreaInsets();
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  useEffect(() => {
    getHistoryMeet();
  }, []);

  const onRefresh = () => getHistoryMeet();

  const onNavigateHistoryDetail = (item: IResHistoryMeet) =>
    // @ts-ignore
    navigate(STACK_NAVIGATOR.HISTORY_MEET_DETAIL, {item});

  const dataEmpty = () => {
    if (loading) {
      return <SkeletonHistory />;
    }
    return <SectionEmpty />;
  };

  const renderItem: ListRenderItem<IResHistoryMeet> = ({item}) => (
    <ItemHistory
      item={item}
      account={account}
      onNavigateHistoryDetail={onNavigateHistoryDetail}
    />
  );
  const seperator = () => <View style={{height: SPACING.m_16}} />;

  const keyExtract = (item: IResHistoryMeet) => item.connectId;
  const headerInfo = (
    <CommonHeader
      title={t('meets.meet_history')}
      containerStyle={[
        styles.header,
        {
          height: top + resWidth(44),
        },
      ]}
    />
  );
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        {headerInfo}
        <FlatList
          data={listHistoryMeet}
          renderItem={renderItem}
          keyExtractor={keyExtract}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          ListEmptyComponent={dataEmpty}
          ItemSeparatorComponent={seperator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        />
      </Container>
    </LinearGradient>
  );
};
export default HistoryMeetScreen;
