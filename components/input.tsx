import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

const palette = {
  surface: '#1f2937',     // fundo do campo (igual aos outros)
  text: '#e5e7eb',        // cor do texto
  placeholder: '#9ca3af', // placeholder
  border: '#374151',      // borda padrão
  focus: '#60a5fa',       // borda com foco
};

type Props = TextInputProps & { label?: string };

export default function Input({ label, style, ...props }: Props) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, { borderColor: focused ? palette.focus : palette.border }, style]}
        placeholderTextColor={palette.placeholder}
        cursorColor={palette.text}
        selectionColor={palette.text}
        keyboardAppearance="dark" // iOS
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { color: palette.text, fontSize: 12, opacity: 0.9 },
  input: {
    backgroundColor: palette.surface,
    color: palette.text,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
