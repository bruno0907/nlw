import { ImageBackground } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  if (!hasLoadedFonts) return <SplashScreen />

  return (
    <>
      <StatusBar style="inverted" translucent />
      <ImageBackground
        source={blurBg}
        className="relative flex-1 bg-gray-900"
        imageStyle={{ position: 'absolute', left: '-100%' }}
      >
        <StyledStripes className="absolute left-2 top-0" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" redirect={isUserAuthenticated} />
          <Stack.Screen name="new" />
          <Stack.Screen name="memories" />
        </Stack>
      </ImageBackground>
    </>
  )
}
