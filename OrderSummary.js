import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { formatCurrency, calculateTotal } from './utils/helpers';

export default function OrderSummary({ route, navigation }) {
  // recuperacao dos dados do menu anterior
  const { order, customerName, customerCpf } = route.params;
  const [includeService, setIncludeService] = useState(false);
  const [showFinalizationModal, setShowFinalizationModal] = useState(false);

  const subtotal = calculateTotal(order);
  // calcula a taxa de serviço de 10%
  const serviceFee = includeService ? subtotal * 0.1 : 0;
  // soma final com ou sem taxa
  const finalTotal = subtotal + serviceFee;

  // função para confirmar o pedido
  const confirmOrder = () => {
    setShowFinalizationModal(true);
  };

  // função para finalizar
  const finishOrder = () => {
    setShowFinalizationModal(false);
    navigation.popToTop();
  };

  // função para novo pedido
  const newOrder = () => {
    setShowFinalizationModal(false);
    navigation.popToTop();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo da Comanda</Text>
        <View style={styles.customerInfo}>
          <Text style={styles.customerLabel}>Cliente:</Text>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.customerLabel}>CPF:</Text>
          <Text style={styles.customerCpf}>{customerCpf}</Text>
        </View>
      </View>

      <View style={styles.orderSection}>
        <Text style={styles.sectionTitle}>Itens do Pedido</Text>
        {/* Lista dos itens selecionados */}
        <FlatList
          data={order}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {formatCurrency(item.price)} x {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.summarySection}>
        {/* mostra o subtotal */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>

        {/* botão que alterna da taxa de serviço */}
        <View style={styles.serviceSection}>
          <Button
            title={includeService ? 'Remover 10% de serviço' : 'Adicionar 10% de serviço'}
            onPress={() => setIncludeService(!includeService)}
            color={includeService ? "#FF9800" : "#4CAF50"}
          />
        </View>

        {/* mostra a taxa de serviço*/}
        {includeService && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de serviço (10%):</Text>
            <Text style={styles.summaryValue}>{formatCurrency(serviceFee)}</Text>
          </View>
        )}

        {/* mostra o total */}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Button 
              title="Voltar" 
              onPress={() => navigation.goBack()} 
              color="#666"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              title="Confirmar Pedido" 
              onPress={confirmOrder}
              color="#4CAF50"
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Novo Pedido" 
            onPress={() => navigation.popToTop()} 
            color="#2196F3"
          />
        </View>
      </View>

      <Modal
        visible={showFinalizationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.finalizationTitle}>🎉 Pedido Confirmado!</Text>
            <Text style={styles.finalizationText}>
              Obrigado por comprar conosco, seu pedido está sendo preparado e logo será entregue!
            </Text>
            <View style={styles.finalizationButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.finishButton]} 
                onPress={finishOrder}
              >
                <Text style={styles.modalButtonText}>Finalizar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.newOrderButton]} 
                onPress={newOrder}
              >
                <Text style={styles.modalButtonText}>Novo Pedido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// definicoes totais do estilo da tela resumo
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  customerInfo: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  customerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  customerCpf: {
    fontSize: 16,
    color: '#333',
  },
  orderSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  summarySection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceSection: {
    marginVertical: 15,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonSection: {
    padding: 15,
    paddingBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  // Estilos dos Modais
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    elevation: 5,
    alignItems: 'center',
  },
  finalizationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  finalizationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
    lineHeight: 24,
  },
  finalizationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#2196F3',
  },
  newOrderButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});