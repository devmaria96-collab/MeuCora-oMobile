import { Link } from 'expo-router';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  href: any;
  label: string;
  icon?: ReactNode;
};

export default function Tile({ href, label, icon }: Props) {
  return (
    <Link href={href as any} asChild>
      <TouchableOpacity
        style={{
          backgroundColor: '#1f1a20',
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 16,
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 10,
          elevation: 3,
          marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        } as any}
      >
        <View style={{
          width: 40, height: 40, borderRadius: 10, backgroundColor: '#ff4b6e33',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {icon}
        </View>
        <Text style={{ color: '#f6f6f6', fontSize: 16, fontWeight: '600' }}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}
