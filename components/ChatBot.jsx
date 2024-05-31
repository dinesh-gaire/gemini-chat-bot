import { speak, isSpeakingAsync, stop } from "expo-speech";
import { useState } from "react";
import { ActivityIndicator, View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import ChatBubble from "./ChatBubble.jsx";
import axios from "axios";

const Chatbot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "<--Put Your API Key here-->";

    const handleUserInput = async () => {
        // Add User Input to chat
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }]
            },
        ];

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat
                }
            );

            console.log("Gemini Pro API Response: ", response.data);

            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (modelResponse) {
                //ADD model response
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }]
                    }
                ];

                setChat(updatedChatWithModel);
                setUserInput("");
            }
        } catch (error) {
            console.error("Error calling Gemini Pro API:", error);
            console.error("Error response:", error.response);
            setError("An error occurred please try again");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            //If Already speaking stop the speech
            stop();
            setIsSpeaking(false);
        } else {
            //If not speaking start the speech
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>
                Gemini Chatbot
            </Text>

            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
                style={styles.flatList}
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
            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}
        </KeyboardAvoidingView>
    );
};

export default Chatbot;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8"
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center"
    },
    flatList: {
        flex: 1,
        paddingHorizontal: 10
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e6e6e6"
    },
    input: {
        flex: 1,
        height: 50,
        padding: 10,
        borderColor: "#007AFF",
        borderWidth: 1,
        borderRadius: 25,
        color: "#333",
        backgroundColor: "#f9f9f9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007AFF",
        borderRadius: 25,
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    loading: {
        marginTop: 10
    },
    error: {
        color: "red",
        marginTop: 10,
        textAlign: "center"
    },
});
