import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chatbot from '../components/ChatBot'

const App = () => {
  return (
    <View style={styles.container}>
      <Chatbot/>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})