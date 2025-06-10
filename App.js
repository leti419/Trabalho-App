import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './ProductList'; // Importa a seleção de produtos
import OrderSummary from './OrderSummary'; // Importa o resumo da comanda

// estrutura de navegação
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Produtos">
        {/*mostra os produtos disponíveis */}
        <Stack.Screen name="Produtos" component={ProductList} />
        {/* resumo da comanda (pedido dos clientes) */}
        <Stack.Screen name="Comanda" component={OrderSummary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}