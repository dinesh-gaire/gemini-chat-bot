import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chatbot from '../components/ChatBot'

const _layout = () => {
  return (
    <View style={styles.container}>
      <Chatbot/>
    </View>
  )
}

export default _layout

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})