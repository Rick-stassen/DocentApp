import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
  try {
    const response = await fetch("http://10.65.68.23:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response data:', data.error);

    if (data.error === 'User already exists') alert('Username is already in use');
    else if (data.error === 'Email already exist') alert('Email is already in use');
    else alert('');

    if (data.usernameExists) setError('Username is already in use');
    else if (data.emailExists) setError('Email is already in use');
    else setError('');

  } catch (err) {
    console.log('Fetch error:', err);
    setError('An error occurred');
  }
};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error} isadasBDsh</Text> : null}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "black"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "white"
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
});