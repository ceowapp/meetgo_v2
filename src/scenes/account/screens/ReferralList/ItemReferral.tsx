import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { IResUserReferral } from 'scenes/account/redux/types';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

type IProps = {
  item: IResUserReferral;
};

const styles = StyleSheet.create({
  referralItem: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    marginVertical: 6,
    backdropFilter: 'blur(5px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  account: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  joinedAt: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  }
});

const ItemReferral: FC<IProps> = ({ item }) => {
  const { t } = useTranslation();
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'MMM d, yyyy');
  };
  return (
    <View style={styles.referralItem}>
      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.fullName}>
            {item.fullName}
          </Text>
          <Text style={styles.account}>
            {item.account}
          </Text>
        </View>
        <Text style={styles.joinedAt}>
          {t('account.joined')} {formatDate(item.createdAtTimestamp)}
        </Text>
      </View>
    </View>
  );
};

export default ItemReferral;


