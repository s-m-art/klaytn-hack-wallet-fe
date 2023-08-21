import React, {useState} from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import UserIcon from '../../assets/icons/user.svg';
import LockIcon from '../../assets/icons/lock.svg';
import Bg from '../../assets/icons/login-bg.png';
import {COLOR} from '../../styles/color';
import {ROUTES} from '../constants';
interface Props {
  navigation: any;
}

function SignIn({navigation}: Props) {
  const [signInInfo, setSignInInfo] = useState({
    username: '',
    password: '',
  });

  const onChangeSigninInfo = (field: string, value: string) => {
    setSignInInfo(prev => ({...prev, [field]: value}));
  };

  const onSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  const onSignIn = () => {
    // TODO: Implement sign in
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Image
        source={Bg}
        style={{
          zIndex: -1,
          position: 'absolute',
          backgroundColor: COLOR.neutral_3,
          height: '100%',
          width: '100%',
        }}
      />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          top: '30%',
          bottom: '5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View style={{width: '100%', gap: 32, display: 'flex'}}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: '700',
              lineHeight: 50,
              color: COLOR.light,
            }}>
            Log in
          </Text>
          <View style={{display: 'flex', gap: 12, width: '100%'}}>
            <CustomInput
              placeHolder="Username"
              LeftAdornment={UserIcon}
              styles={{width: '100%'}}
              setValue={(text: string) => onChangeSigninInfo('username', text)}
              value={signInInfo.username}
            />
            <CustomInput
              placeHolder="Password"
              LeftAdornment={LockIcon}
              styles={{width: '100%'}}
              isPassword={true}
              setValue={(text: string) => onChangeSigninInfo('password', text)}
              value={signInInfo.password}
            />
          </View>
        </View>
        <View style={{display: 'flex', gap: 24}}>
          <Pressable
            style={{
              borderRadius: 100,
              padding: 15,
              backgroundColor: COLOR.orange,
            }}
            onPress={onSignIn}>
            <Text
              style={{
                color: COLOR.light,
                fontWeight: '600',
                fontSize: 18,
                textAlign: 'center',
                marginBottom: 4,
              }}>
              Log In
            </Text>
          </Pressable>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'center',
            }}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 2}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: COLOR.neutral_1,
                }}>
                Don't have an account?
              </Text>
              <Text
                style={{fontSize: 16, fontWeight: '500', color: COLOR.orange}}
                onPress={onSignUp}>
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SignIn;
