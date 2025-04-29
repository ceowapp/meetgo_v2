import LineBreak from 'components/LineBreak';
import React, {useEffect} from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import SectionEmpty from 'scenes/meets/components/SectionEmpty';
import SkeletonHistory from 'scenes/meets/components/SkeletonHistory';
import {SPACING} from 'utils/styleGuide';
import ItemHistory from './ItemHistory';
import useEarn from 'scenes/earn/helper/useEarn';
import {IDataEarn} from 'scenes/earn/redux/types';
import Screen, {resWidth} from 'utils/Screen';
import Container from 'components/Container';
import DialogModal from 'components/BaseModal/DialogModal';
import {
  showDialogModal,
  showEarnModal,
} from 'services/globalModal/modalHandler';
import EarnDetailDialog from './EarnDetailDialog';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from 'components/CommonHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
});
const HistoryEarnScreen = () => {
  const { t } = useTranslation();
  const {historyEarn, loading, listDataEarn} = useEarn();
  const {top} = useSafeAreaInsets();
  useEffect(() => {
    historyEarn();
  }, []);

  const onRefresh = () => historyEarn();

  const dataEmpty = () => {
    if (loading) {
      return <SkeletonHistory />;
    }
    return <SectionEmpty message={t('earn.emptyMessage')} />;
  };

  const renderItem: ListRenderItem<IDataEarn> = ({item}) => (
    <ItemHistory item={item} onClick={showDetailEarn} />
  );
  const seperator = () => <View style={{height: SPACING.m_16}} />;

  const keyExtract = (_item: IDataEarn, index: number) => index.toString();
  const showDetailEarn = (item: IDataEarn) => {
    showEarnModal({
      content: () => <EarnDetailDialog dataEarn={item} />,
    });
  };
  return (
    <LinearGradient style={{flex: 1}} {...Screen.linearBackground}>
      <Container edges={['bottom']}>
        <CommonHeader
          title={t('earn.earningTitle')}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listDataEarn}
          renderItem={renderItem}
          keyExtractor={keyExtract}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          ListEmptyComponent={dataEmpty}
          ItemSeparatorComponent={seperator}
          style={{
            paddingHorizontal: SPACING.m_16,
          }}
          contentContainerStyle={{
            paddingVertical: resWidth(40),
          }}
        />
      </Container>
    </LinearGradient>
  );
};
export default HistoryEarnScreen;
