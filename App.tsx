import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type MenuOption = 'beef' | 'chicken' | 'mutton' | 'veg';

type MenuItem = {
  label: string;
  value: MenuOption;
};

const menuItems: MenuItem[] = [
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Mutton', value: 'mutton' },
  { label: 'Veg', value: 'veg' },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<MenuOption | null>(null);
  const [feedback, setFeedback] = useState('No option selected');
  const [items, setItems] = useState<MenuItem[]>(menuItems);

  const makeSelection = () => {
    if (value === null) {
      setFeedback('Please select an option first');
      return;
    }

    const selectedItem = items.find((item) => item.value === value);
    setFeedback(selectedItem ? `${selectedItem.label} selected` : 'No option selected');
  };

  return (
    <View style={styles.container}>
      <Text>Menu App</Text>
      <Text>Please select an option below:</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        theme="LIGHT"
        placeholder="Select an option..."
        style={styles.picker}
      />
      <TouchableOpacity
        style={[styles.submitButton, !value && styles.submitButtonDisabled]}
        onPress={makeSelection}
        disabled={!value}
        accessibilityRole="button"
        accessibilityState={{ disabled: !value }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.feedback}>Selected Option: {feedback}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  picker: {
    width: '100%',
    maxWidth: 440,
  },
  submitButton: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    backgroundColor: '#176b52',
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#8b9b95',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  feedback: {
    marginTop: 20,
  },
});
