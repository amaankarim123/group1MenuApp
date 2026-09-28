import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type MenuOption = 'beef' | 'chicken' | 'mutton' | 'veg';

type MenuDish = {
  id: MenuOption;
  category: string;
  name: string;
  description: string;
  price: number;
};

type OrderLine = {
  dish: MenuDish;
  quantity: number;
};

const menuItems: MenuDish[] = [
  {
    id: 'beef',
    category: 'SLOW COOKED',
    name: 'Braised beef bowl',
    description: 'Tender beef, herbed rice, and a bright green sauce.',
    price: 18,
  },
  {
    id: 'chicken',
    category: 'GUEST FAVORITE',
    name: 'Lemon herb chicken',
    description: 'Crisp-skinned chicken with lemon, greens, and potatoes.',
    price: 16,
  },
  {
    id: 'mutton',
    category: 'HOUSE SPECIAL',
    name: 'Spiced mutton curry',
    description: 'Fragrant spices, slow-simmered mutton, warm flatbread.',
    price: 19,
  },
  {
    id: 'veg',
    category: 'PLANT FORWARD',
    name: 'Roasted garden plate',
    description: 'Seasonal vegetables, whipped hummus, toasted seeds.',
    price: 14,
  },
];

export default function App() {
  const [selectedDish, setSelectedDish] = useState<MenuDish | null>(null);
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [feedback, setFeedback] = useState('Choose a dish to get started.');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const orderCount = orderItems.reduce((count, line) => count + line.quantity, 0);
  const subtotal = orderItems.reduce((amount, line) => amount + line.dish.price * line.quantity, 0);

  const updateQuantity = (dish: MenuDish, change: number) => {
    setOrderItems((currentItems) => {
      const existingLine = currentItems.find((line) => line.dish.id === dish.id);
      const nextQuantity = (existingLine?.quantity ?? 0) + change;

      if (nextQuantity <= 0) {
        return currentItems.filter((line) => line.dish.id !== dish.id);
      }

      if (existingLine) {
        return currentItems.map((line) =>
          line.dish.id === dish.id ? { ...line, quantity: nextQuantity } : line,
        );
      }

      return [...currentItems, { dish, quantity: nextQuantity }];
    });
  };

  const addToOrder = () => {
    if (!selectedDish) {
      setFeedback('Tap a dish above to add it to your order.');
      return;
    }

    updateQuantity(selectedDish, 1);
    setFeedback(`${selectedDish.name} added to your order.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.brand}>THE LITTLE TABLE</Text>
            <Pressable
              style={styles.orderBadge}
              onPress={() => setShowOrderSummary(true)}
              accessibilityRole="button"
              accessibilityLabel={`View order, ${orderCount} items`}
            >
              <Text style={styles.orderBadgeText}>ORDER {orderCount}</Text>
            </Pressable>
          </View>
          {showOrderSummary ? (
            <>
              <Text style={styles.headline}>Your order</Text>
              <Text style={styles.headerCaption}>
                {orderCount} {orderCount === 1 ? 'item' : 'items'} in your order.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.headline}>Good food,{'\n'}no guesswork.</Text>
              <Text style={styles.headerCaption}>A few favorites, made fresh today.</Text>
              <View style={styles.openLabel}>
                <View style={styles.openDot} />
                <Text style={styles.openText}>OPEN TODAY · 11 AM – 9 PM</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.menuSection}>
          {showOrderSummary ? (
            <>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.eyebrow}>ORDER SUMMARY</Text>
                  <Text style={styles.sectionTitle}>Order details</Text>
                </View>
                <Pressable
                  onPress={() => setShowOrderSummary(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Back to menu"
                >
                  <Text style={styles.backToMenu}>BACK TO MENU</Text>
                </Pressable>
              </View>

              {orderItems.length === 0 ? (
                <View style={styles.emptyOrder}>
                  <Text style={styles.emptyOrderTitle}>Your order is empty</Text>
                  <Text style={styles.emptyOrderText}>Choose something from today's menu to get started.</Text>
                  <Pressable
                    style={({ pressed }) => [styles.orderButton, pressed && styles.orderButtonPressed]}
                    onPress={() => setShowOrderSummary(false)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.orderButtonText}>Browse the menu</Text>
                    <Text style={styles.orderButtonArrow}>→</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.summaryCard}>
                    {orderItems.map((line, index) => (
                      <View
                        key={line.dish.id}
                        style={[
                          styles.summaryLine,
                          index < orderItems.length - 1 && styles.summaryLineBorder,
                        ]}
                      >
                        <View style={styles.summaryLineHeading}>
                          <Text style={styles.summaryDishName}>{line.dish.name}</Text>
                          <Text style={styles.summaryLineTotal}>${line.dish.price * line.quantity}</Text>
                        </View>
                        <View style={styles.summaryLineControls}>
                          <Text style={styles.eachPrice}>${line.dish.price} each</Text>
                          <View style={styles.quantityControl}>
                            <Pressable
                              style={styles.quantityButton}
                              onPress={() => updateQuantity(line.dish, -1)}
                              accessibilityRole="button"
                              accessibilityLabel={`Remove one ${line.dish.name}`}
                            >
                              <Text style={styles.quantityButtonText}>-</Text>
                            </Pressable>
                            <Text style={styles.quantityValue}>{line.quantity}</Text>
                            <Pressable
                              style={styles.quantityButton}
                              onPress={() => updateQuantity(line.dish, 1)}
                              accessibilityRole="button"
                              accessibilityLabel={`Add one ${line.dish.name}`}
                            >
                              <Text style={styles.quantityButtonText}>+</Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.subtotalRow}>
                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                    <Text style={styles.subtotalAmount}>${subtotal}</Text>
                  </View>
                  <Text style={styles.subtotalNote}>Based on the items in your order.</Text>

                  <Pressable
                    style={({ pressed }) => [styles.orderButton, pressed && styles.orderButtonPressed]}
                    onPress={() => setShowOrderSummary(false)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.orderButtonText}>Continue browsing</Text>
                    <Text style={styles.orderButtonArrow}>→</Text>
                  </Pressable>
                </>
              )}
            </>
          ) : (
            <>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.eyebrow}>MADE IN OUR KITCHEN</Text>
                  <Text style={styles.sectionTitle}>Today's menu</Text>
                </View>
                <Text style={styles.itemCount}>04 DISHES</Text>
              </View>

              <Text style={styles.instruction}>Pick what sounds good.</Text>

              <View style={styles.menuList}>
                {menuItems.map((dish, index) => {
                  const isSelected = selectedDish?.id === dish.id;

                  return (
                    <Pressable
                      key={dish.id}
                      onPress={() => {
                        setSelectedDish(dish);
                        setFeedback(`${dish.name} selected.`);
                      }}
                      style={({ pressed }) => [
                        styles.menuItem,
                        isSelected && styles.menuItemSelected,
                        pressed && styles.menuItemPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${dish.name}, ${dish.category.toLowerCase()}, $${dish.price}`}
                    >
                      <View style={[styles.dishNumber, isSelected && styles.dishNumberSelected]}>
                        <Text style={[styles.dishNumberText, isSelected && styles.dishNumberTextSelected]}>
                          0{index + 1}
                        </Text>
                      </View>
                      <View style={styles.dishDetails}>
                        <Text style={styles.dishCategory}>{dish.category}</Text>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        <Text style={styles.dishDescription}>{dish.description}</Text>
                      </View>
                      <View style={styles.dishPriceBlock}>
                        <Text style={styles.dishPrice}>${dish.price}</Text>
                        <View style={[styles.selectionMark, isSelected && styles.selectionMarkSelected]}>
                          {isSelected ? <Text style={styles.selectionCheck}>✓</Text> : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.orderPanel}>
                <Text style={styles.feedback} accessibilityLiveRegion="polite">
                  {feedback}
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.orderButton, pressed && styles.orderButtonPressed]}
                  onPress={addToOrder}
                  accessibilityRole="button"
                >
                  <Text style={styles.orderButtonText}>
                    {selectedDish ? `Add to order · $${selectedDish.price}` : 'Choose a dish'}
                  </Text>
                  <Text style={styles.orderButtonArrow}>→</Text>
                </Pressable>
                <Pressable
                  style={styles.viewOrderButton}
                  onPress={() => setShowOrderSummary(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`View order, ${orderCount} items`}
                >
                  <Text style={styles.viewOrderText}>View order ({orderCount})</Text>
                  <Text style={styles.viewOrderArrow}>→</Text>
                </Pressable>
                <Text style={styles.footerNote}>Freshly prepared · Thoughtfully sourced</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ed',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 36,
  },
  header: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#173d32',
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#d6e2d7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  orderBadge: {
    borderWidth: 1,
    borderColor: '#71887a',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  orderBadgeText: {
    color: '#f2f0e7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headline: {
    color: '#fffdf6',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '700',
    marginTop: 32,
  },
  headerCaption: {
    color: '#d2ddd2',
    fontSize: 15,
    marginTop: 10,
  },
  openLabel: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: '#244b3f',
    borderRadius: 4,
  },
  openDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#e6ad59',
    marginRight: 8,
  },
  openText: {
    color: '#e4e9de',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  menuSection: {
    width: '100%',
    maxWidth: 620,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eyebrow: {
    color: '#728075',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: '#20372e',
    fontSize: 27,
    fontWeight: '700',
    marginTop: 5,
  },
  itemCount: {
    color: '#8a9388',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    paddingBottom: 5,
  },
  instruction: {
    color: '#657168',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 15,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    width: '100%',
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffefa',
    borderWidth: 1,
    borderColor: '#e9e7de',
    borderRadius: 7,
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  menuItemSelected: {
    borderColor: '#42705b',
    backgroundColor: '#f0f4ec',
  },
  menuItemPressed: {
    opacity: 0.82,
  },
  dishNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1eee4',
    marginRight: 12,
  },
  dishNumberSelected: {
    backgroundColor: '#dce7d9',
  },
  dishNumberText: {
    color: '#788176',
    fontSize: 11,
    fontWeight: '700',
  },
  dishNumberTextSelected: {
    color: '#315b47',
  },
  dishDetails: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  dishCategory: {
    color: '#ac7b3f',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  dishName: {
    color: '#26382f',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  dishDescription: {
    color: '#707970',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  dishPriceBlock: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  dishPrice: {
    color: '#293b32',
    fontSize: 15,
    fontWeight: '700',
  },
  selectionMark: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: '#d4d8ce',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionMarkSelected: {
    backgroundColor: '#315b47',
    borderColor: '#315b47',
  },
  selectionCheck: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  orderPanel: {
    marginTop: 20,
  },
  feedback: {
    color: '#58685e',
    fontSize: 13,
    marginBottom: 10,
  },
  orderButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#c76b43',
    borderRadius: 5,
    paddingHorizontal: 17,
  },
  orderButtonPressed: {
    backgroundColor: '#ad5936',
  },
  orderButtonText: {
    color: '#fffdf8',
    fontSize: 14,
    fontWeight: '700',
  },
  orderButtonArrow: {
    color: '#fffdf8',
    fontSize: 21,
  },
  backToMenu: {
    color: '#315b47',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    paddingVertical: 8,
  },
  emptyOrder: {
    backgroundColor: '#fffefa',
    borderWidth: 1,
    borderColor: '#e9e7de',
    borderRadius: 7,
    padding: 18,
    marginTop: 16,
  },
  emptyOrderTitle: {
    color: '#26382f',
    fontSize: 17,
    fontWeight: '700',
  },
  emptyOrderText: {
    color: '#707970',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: '#fffefa',
    borderWidth: 1,
    borderColor: '#e9e7de',
    borderRadius: 7,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  summaryLine: {
    paddingVertical: 13,
  },
  summaryLineBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eceae2',
  },
  summaryLineHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryDishName: {
    flex: 1,
    minWidth: 0,
    color: '#26382f',
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 10,
  },
  summaryLineTotal: {
    color: '#293b32',
    fontSize: 15,
    fontWeight: '700',
  },
  summaryLineControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  eachPrice: {
    color: '#7a8379',
    fontSize: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1eee4',
    borderRadius: 4,
  },
  quantityButtonText: {
    color: '#315b47',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  quantityValue: {
    minWidth: 18,
    color: '#26382f',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#deded3',
    paddingTop: 15,
    marginTop: 17,
  },
  subtotalLabel: {
    color: '#26382f',
    fontSize: 15,
    fontWeight: '600',
  },
  subtotalAmount: {
    color: '#20372e',
    fontSize: 20,
    fontWeight: '700',
  },
  subtotalNote: {
    color: '#879087',
    fontSize: 11,
    marginTop: 5,
    marginBottom: 16,
  },
  viewOrderButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  viewOrderText: {
    color: '#315b47',
    fontSize: 13,
    fontWeight: '700',
  },
  viewOrderArrow: {
    color: '#315b47',
    fontSize: 18,
  },
  footerNote: {
    color: '#879087',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 13,
  },
});
