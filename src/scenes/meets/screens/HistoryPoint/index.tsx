import {useScrollToTop} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import LineBreak from 'components/LineBreak';
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
import {IResHistoryTransfer} from 'scenes/meets/redux/types';
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
    flex: 1,
    padding: SPACING.m_16,
  },
});
const HistoryPointScreen = () => {
  const { t } = useTranslation();
  const {loading, getHistoryTransferPoint, listHistoryTransfer, account} =
    useMeet();
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    getHistoryTransferPoint();
  }, []);

  const onRefresh = () => getHistoryTransferPoint();

  const dataEmpty = () => {
    if (loading) {
      return <SkeletonHistory />;
    }
    return <SectionEmpty />;
  };

  const renderItem: ListRenderItem<IResHistoryTransfer> = ({item}) => (
    <ItemHistory item={item} account={account} />
  );
  const seperator = () => <View style={{paddingBottom: SPACING.l_24}} />;

  const keyExtract = (item: IResHistoryTransfer, index: number) =>
    index.toString();

  const headerInfo = (
    <CommonHeader
      title={t('meets.history_meet_point')}
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
          data={listHistoryTransfer}
          renderItem={renderItem}
          keyExtractor={keyExtract}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          ListEmptyComponent={dataEmpty}
          ItemSeparatorComponent={seperator}
          contentContainerStyle={{flex: 1, padding: SPACING.m_16}}
        />
      </Container>
    </LinearGradient>
  );
};
export default HistoryPointScreen;
