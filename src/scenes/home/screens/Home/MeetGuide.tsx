import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';
import Images from 'utils/Images';
import {shadow} from 'utils/mixins';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  boldTxt: {
    fontWeight: 'bold',
    color: COLORS.white,
    fontSize: resFont(13),
  },
  img: {
    width: resWidth(80),
    height: '100%',
  },
  general: {
    color: COLORS.white,
    fontSize: resFont(13),
    lineHeight: resFont(18),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.m_16,
    borderRadius: SPACING.s_12,
    padding: SPACING.s_12,
    flex: 1,
  },
});

type IProps = {
  step: number;
  onClick: () => void;
};
const MeetGuide: FC<IProps> = ({step, onClick}) => {
  const { t } = useTranslation();
  const stepOne = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_1_title')} </Text>
          {t('home.guide_step_1_content_1')} <Text style={styles.boldTxt}>Meetgo</Text>, {t('home.guide_step_1_content_2')}{' '}
          <Text style={styles.boldTxt}>ConnectMeet</Text>{t('home.guide_step_1_content_3')}{' '}
          <Text style={styles.boldTxt}>Meet Go</Text> {t('home.guide_step_1_content_4')}
        </Text>
        <View style={{paddingTop: 8}}>
          <Text style={styles.general}>
            {t('home.guide_step_1_content_5')}
          </Text>
        </View>
      </View>
    );
  };
  const imgStepOne = () => (
    <Image
      source={Images.guide.step1}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const stepTwo = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_2_title')} </Text>
          {t('home.guide_step_2_content_1')}{' '}
          <Text style={styles.boldTxt}>Meet Go</Text>, {t('home.guide_step_2_content_2')}{' '}
          <Text style={styles.boldTxt}>{t('home.guide_step_2_content_3')}</Text>, {t('home.guide_step_2_content_4')}
          <Text style={styles.boldTxt}>{t('home.guide_step_2_content_5')}</Text> {t('home.guide_step_2_content_6')}
        </Text>
      </View>
    );
  };
  const imgStepTwo = () => (
    <Image
      source={Images.guide.step2}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const stepThree = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_3_title')} </Text>
          {t('home.guide_step_3_content')}
        </Text>
      </View>
    );
  };
  const imgStepThree_1 = () => (
    <Image
      source={Images.guide.step3_1}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const imgStepThree_2 = () => (
    <Image
      source={Images.guide.step3_2}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const stepFour = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_4_title')} </Text>
          {t('home.guide_step_4_content_1')}
          <Text style={styles.boldTxt}>{t('home.guide_step_4_content_2')}</Text> {t('home.guide_step_4_content_3')}
        </Text>
      </View>
    );
  };
  const imgStepFour = () => (
    <Image
      source={Images.guide.step4}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const stepFive = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_5_title')} </Text>
          {t('home.guide_step_5_content_1')}
        </Text>
        <View style={{paddingTop: 8}}>
          <Text style={styles.general}>
            {t('home.guide_step_5_content_2')}
          </Text>
        </View>
      </View>
    );
  };
  const imgStepFive = () => (
    <Image
      source={Images.guide.step5}
      resizeMode="contain"
      style={styles.img}
    />
  );
  const stepSix = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.general}>
          <Text style={styles.boldTxt}>{t('home.guide_step_6_title')} </Text>
          {t('home.guide_step_6_content_1')}
          {`\n`}
          <Text style={styles.boldTxt}>{t('home.guide_step_6_content_2')}</Text>
        </Text>
      </View>
    );
  };
  const imgStepSix = () => (
    <Image
      source={Images.guide.step6}
      resizeMode="contain"
      style={styles.img}
    />
  );

  const renderStep = () => {
    let contentStep = null;
    let imgStep = null;
    let imgStep2 = null;
    switch (step) {
      case 1: {
        contentStep = stepOne();
        imgStep = imgStepOne();
        break;
      }
      case 2: {
        contentStep = stepTwo();
        imgStep = imgStepTwo();
        break;
      }
      case 3: {
        contentStep = stepThree();
        imgStep = imgStepThree_1();
        imgStep2 = imgStepThree_2();
        break;
      }
      case 4: {
        contentStep = stepFour();
        imgStep = imgStepFour();
        break;
      }
      case 5: {
        contentStep = stepFive();
        imgStep = imgStepFive();
        break;
      }
      case 6: {
        contentStep = stepSix();
        imgStep = imgStepSix();
      }
      default: {
      }
    }
    return (
      <LinearGradient
        onTouchEnd={onClick}
        style={styles.row}
        colors={[COLORS.primary, COLORS.tertiary]}>
        {contentStep}
        {imgStep}
        {imgStep2}
      </LinearGradient>
    );
  };

  return renderStep();
};

export default MeetGuide;
