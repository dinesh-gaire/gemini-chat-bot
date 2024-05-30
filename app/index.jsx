import {speak, isSpeakingAsync, stop} from "expo-speech"
import { useState } from "react"
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity } from "react-native";

const Chatbot=()=>{
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const API_KEY = "AIzaSyA-WFdWSXWgfYqWdJYPhmoOxwK_xZH6-cs"

    const handleUserInput=async()=>{
        // Add User Input to chat
        let updatedChat = [
            ...chat,
            {
                role:"user",
                parts:[{text:userInput}]
            },
        ];

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
                {
                    contents:updatedChat
                }
            )

            console.log("Gemini Pro API Response: ", response.data);

            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if(modelResponse){
                //ADD model response
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role:"model",
                        parts:[{text:modelResponse}]
                    }
                ]

                setChat(updatedChatWithModel)

                setUserInput("")
            }
        } catch (error) {
            console.error("Error calling Gemini Pro API:", error);
            console.error("Error response:", error.response);
            setError("An error occured please try again")

        }finally{
            setLoading(false)
        }
    }

    const handleSpeech=async(text)=>{
        if(isSpeaking){
            //If Already speaking stop the speech
            stop();
            setIsSpeaking(false);
        }else{
            //If not speaking start the speech
            if(!(await isSpeakingAsync())){
                speak(text);
                setIsSpeaking(true);
            }
        }
    };


    const renderChatItem=({item})=>{
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={()=>handleSpeech(item.parts[0].text)}
        />
    }

    return(
        <View style={StyleSheet.container}>
            <Text style={styles.title}>
                Gemini Chatbot
            </Text>
    
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item,index)=>index.toString()}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333"/>}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )

};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16
    }
})

export default Chatbot;