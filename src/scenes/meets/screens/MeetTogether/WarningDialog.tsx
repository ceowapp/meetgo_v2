import {ButtonPrimary} from 'components/Button/Primary';
import React, {FC, useState} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IPropsWaring = {
  onContinue: () => void;
  onExit: () => Promise<void> | void;
  title?: string;
  description?: string;
  source?: ImageSourcePropType;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.l_24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.s_12,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.primary,
    textAlign: 'center',
    paddingBottom: SPACING.s_8,
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.primary,
    textAlign: 'center',
    paddingVertical: SPACING.s_12,
  },
  img: {
    width: resWidth(120),
    height: resWidth(96),
  },
  btnAccept: {flex: 1, backgroundColor: COLORS.shopGreen},
  btnCancel: {flex: 1, backgroundColor: COLORS.red},
});
const WarningDialog: FC<IPropsWaring> = ({
  onContinue,
  onExit,
  title,
  description,
  source,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const onExitMeet = async () => {
    setLoading(true);
    await onExit();
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {source && (
        <Image source={source} style={styles.img} resizeMode="contain" />
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={{flexDirection: 'row'}}>
        <ButtonPrimary
          content={t('meets.exit')}
          containerStyle={styles.btnCancel}
          onPress={onExitMeet}
          isLoading={loading}
          disabled={loading}
        />
        <View style={{width: SPACING.l_32}} />
        <ButtonPrimary
          content={t('meets.continue')}
          containerStyle={styles.btnAccept}
          onPress={onContinue}
          disabled={loading}
        />
      </View>
    </View>
  );
};
export default WarningDialog;
