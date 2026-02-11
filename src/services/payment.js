// Mock Payment Service - No Real Razorpay Needed

export const initiatePayment = (order, customerDetails, onSuccess, onError) => {
  console.log('🧪 ======= MOCK PAYMENT INITIATED =======');
  console.log('📦 Order Details:', order);
  console.log('👤 Customer Details:', customerDetails);
  console.log('💰 Amount:', order.amount, 'paise =', order.amount / 100, 'rupees');
  
  // Create a nice confirmation dialog
  const message = `
🧪 MOCK PAYMENT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${order.id}
Amount: ₹${order.amount / 100}
Customer: ${customerDetails.name}
Email: ${customerDetails.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Click OK to simulate successful payment
Click Cancel to simulate payment failure
  `.trim();
  
  const proceed = window.confirm(message);
  
  if (proceed) {
    console.log('✅ User confirmed mock payment');
    console.log('⏳ Processing payment...');
    
    // Simulate payment processing delay (1.5 seconds)
    setTimeout(() => {
      const mockPaymentResponse = {
        razorpay_order_id: order.id,
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_signature: 'mock_signature_' + Date.now(),
      };
      
      console.log('✅ MOCK PAYMENT SUCCESSFUL!');
      console.log('📝 Payment Response:', mockPaymentResponse);
      console.log('🧪 ======= PAYMENT COMPLETED =======');
      
      onSuccess(mockPaymentResponse);
    }, 1500);
  } else {
    console.log('❌ User cancelled mock payment');
    console.log('🧪 ======= PAYMENT CANCELLED =======');
    onError('Payment cancelled by user');
  }
};

// Export for backward compatibility
export default { initiatePayment };