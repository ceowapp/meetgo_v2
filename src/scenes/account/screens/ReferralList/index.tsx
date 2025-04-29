import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

import Screen, { resWidth } from 'utils/Screen';
import { SPACING } from 'utils/styleGuide';
import Container from 'components/Container';
import CommonHeader from 'components/CommonHeader';
import SectionEmpty from 'scenes/account/components/SectionEmpty';
import SkeletonList from 'scenes/account/components/SkeletonList';
import ItemReferral from './ItemReferral';
import { useReferral } from 'scenes/account/helper/useReferral';

const ReferralList = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { loading, fetchReferralList, shareReferralLink, shareManualReferralLink } = useReferral();
  const [referralList, setReferralList] = useState([]);
  
  useEffect(() => {
    loadReferrals();
  }, []);
  
  const loadReferrals = async () => {
    const refList = await fetchReferralList();
    setReferralList(refList || []);
  };
  
  const renderItem = ({ item }) => <ItemReferral item={item} />;
  const keyExtractor = (_, index) => `referral-${index}`;
  const EmptyComponent = () => {
    if (loading) {
      return <SkeletonList />;
    }
    return <SectionEmpty message={t('account.emptyReferralMessage')} />;
  };
  
  return (
    <LinearGradient {...Screen.linearBackground} style={styles.gradient}>
      <CommonHeader
        title={t('account.yourReferralList')}
        containerStyle={[styles.header, { height: insets.top + resWidth(44) }]}
      />
      <Container edges={['bottom']}>
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.container}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={shareReferralLink}
              activeOpacity={0.7}
            >
              <Text style={styles.shareButtonText}>{t('account.shareReferralLink')}</Text>
            </TouchableOpacity>
            <FlatList
              data={referralList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loadReferrals} />
              }
              ListEmptyComponent={<EmptyComponent />}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
            />
          </View>
        </SafeAreaView>
      </Container>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.m_16,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
  },
  shareButton: {
    backgroundColor: '#4287f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: resWidth(40),
  },
  separator: {
    height: SPACING.m_16,
  }
});

export default React.memo(ReferralList);